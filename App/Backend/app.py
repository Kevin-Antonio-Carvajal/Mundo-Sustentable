from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_session import Session  # Importar Flask-Session
import os  # Importar os para generar una clave secreta
from flask_jwt_extended import JWTManager
from controllers.extensions import mail

from models.models import db  # Importar la instancia db desde models
from controllers.ControllerUsuario import usuario_blueprint
from controllers.auth import auth as auth_blueprint
from controllers.product import product
from flask import send_from_directory
from flask import current_app, send_from_directory

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://lab:Developer123!@localhost:3306/login_p5'
app.config.from_mapping(
    SECRET_KEY='dev'
)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

# Construir una ruta relativa al repositorio para UPLOAD_FOLDER
base_dir = os.path.abspath(os.path.dirname(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(base_dir, '..', 'fotos')

# Configuración de Flask-Session
app.secret_key = os.urandom(24)  # Genera una clave secreta segura
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)  # Inicializar Flask-Session

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'webaholics82@gmail.com'
app.config['MAIL_PASSWORD'] = 'yaoa bqxo jjdn lbea'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail.init_app(app)


# Inicializar SQLAlchemy con app
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = 'super-secret'  
jwt = JWTManager(app)

CORS(app)

app.register_blueprint(usuario_blueprint)  
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(product, url_prefix='/api')

# Iniciar la aplicación
if __name__ == '__main__':
    CORS(app)
    import logging
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)