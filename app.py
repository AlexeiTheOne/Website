import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, current_user, login_user, login_required, logout_user
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
import stripe, openai

load_dotenv()

# —————————————————————————————————————————————————————————————————————————————
# Flask should serve everything out of frontend/build, with static files mounted at /static
app = Flask(
    __name__,
    static_folder='frontend/build',
    static_url_path='/static'   # ✅ FIXED: now only serves /static/* as static
)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# — Extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)
login_manager.login_view = 'flask_login'

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
openai.api_key = os.getenv('OPENAI_API_KEY')

# — User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    subscribed = db.Column(db.Boolean, default=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# — API endpoints
@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return {"error": "Missing email or password"}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "Email already registered"}, 409

    hashed = generate_password_hash(password, method='pbkdf2:sha256')
    u = User(email=email, password=hashed)
    db.session.add(u)
    db.session.commit()
    login_user(u)
    return {"message": "User registered successfully"}

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return {"message": "Login successful"}
    return {"error": "Invalid email or password"}, 401

@app.route('/api/session')
def session_status():
    return {"logged_in": current_user.is_authenticated}

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/')

@app.route('/flask-login', methods=['GET', 'POST'])
def flask_login():
    if request.method == 'POST':
        email = request.form['email']
        pw = request.form['password']
        u = User.query.filter_by(email=email).first()
        if u and check_password_hash(u.password, pw):
            login_user(u)
            return redirect(url_for('dashboard'))
        flash('Invalid credentials')
    return redirect('/')

@app.route('/create-checkout-session', methods=['POST'])
@login_required
def create_checkout_session():
    session = stripe.checkout.Session.create(
        customer_email=current_user.email,
        payment_method_types=['card'],
        line_items=[{'price': 'price_your_price_id', 'quantity': 1}],
        mode='subscription',
        success_url=url_for('dashboard', _external=True) + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url=url_for('dashboard', _external=True),
    )
    return redirect(session.url, code=303)

@app.route('/analyze', methods=['POST'])
@login_required
def analyze():
    squad_data = request.files['squadbook'].read().decode()
    match_text = request.form['match_summary']
    prompt = "You are TacticalOracle, ..." + "\n" + squad_data
    resp = openai.ChatCompletion.create(
        model="ft:gpt-4o-2024-08-06:personal:tacticaloracle-v1:Bjb7nBsu",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": match_text}
        ],
        max_tokens=400
    )
    advice = resp.choices[0].message.content
    return {"advice": advice}

# ✅ React catch-all route — must come LAST before app.run()
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    full_path = os.path.join(app.static_folder, path)
    print(f"[React Router] Requested path: {path}")
    if path and os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# ✅ Start server
if __name__ == '__main__':
    app.run(debug=True)
