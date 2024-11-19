from flask import Blueprint, request, jsonify
from models.models import db, Usuario
import bcrypt
from flask_jwt_extended import create_access_token
from flask_mail import Message
from controllers.extensions import mail  

auth = Blueprint('auth', __name__)

def send_registration_email(user_email):
    """
    Envía un correo electrónico de bienvenida al usuario registrado.
    
    :param user_email: Dirección de correo del usuario.
    """
    msg = Message(
        'Bienvenido a Market Mundo Sustentable :)', 
        sender='MScreatec@gmail.com', 
        recipients=[user_email]
    )
    msg.body = 'Gracias por tu registro, ahora puedes conseguir productos sustentables fácil y rápido! :)'
    mail.send(msg)

@auth.route('/register', methods=['POST'])
def register():
    """
    Registra un nuevo usuario en la base de datos.

    Verifica que el correo, nombre de usuario y teléfono no estén en uso.
    Crea un hash de la contraseña y almacena los datos del usuario.
    Envía un correo de bienvenida al usuario registrado.

    :return: Respuesta JSON con mensaje de éxito o error.
    """
    data = request.get_json()
    email = data['email']
    phone = data['phone']
    username = data['username']
    password = data['password']
    role = data['role']
    
    # Verificar si el correo ya existe
    if Usuario.query.filter_by(correo=email).first():
        return jsonify({'alert': 'Correo electrónico ya en uso'}), 400

    # Verificar si el nombre de usuario ya existe
    if Usuario.query.filter_by(nombre_usuario=username).first():
        return jsonify({'alert': 'Nombre de usuario ya en uso'}), 400

    # Verificar si el teléfono ya existe
    if Usuario.query.filter_by(telefono=phone).first():
        return jsonify({'alert': 'Número de teléfono ya en uso'}), 400

    # Validar formato de teléfono
    if not phone.isdigit() or len(phone) != 10:
        return jsonify({'alert': 'Número de teléfono no válido'}), 400

    # Validar longitud del nombre de usuario
    if len(username) < 3 or len(username) > 20:
        return jsonify({'alert': 'El nombre de usuario debe tener entre 3 y 20 caracteres'}), 400

    # Crear hash de contraseña
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Crear y almacenar el usuario en la base de datos
    new_user = Usuario(
        correo=email,
        telefono=phone,
        nombre_usuario=username,
        password_hash=hashed_password.decode('utf-8'),
        tipo_rol=role
    )
    db.session.add(new_user)
    db.session.commit()

    # Enviar correo de registro
    send_registration_email(email)

    return jsonify({'message': 'Usuario creado exitosamente'}), 201
    
@auth.route('/login', methods=['POST'])
def login():
    """
    Inicia sesión para un usuario existente.

    Verifica las credenciales proporcionadas (nombre de usuario, contraseña y rol).
    Genera un token de acceso si las credenciales son válidas.

    :return: Respuesta JSON con mensaje y token en caso de éxito, o mensaje de error.
    """
    data = request.get_json()
    username = data['username']
    password = data['password']
    role = data['role']

    user = Usuario.query.filter_by(nombre_usuario=username).first()
    if user and user.check_password(password) and user.tipo_rol == role:
        access_token = create_access_token(identity=username)
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid username, password, or role'}), 401
