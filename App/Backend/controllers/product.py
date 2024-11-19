from flask import Blueprint, request, jsonify, current_app
from models.models import db, Producto
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from flask_mail import Message
from models.models import db, Usuario, Producto, Compra, Opinion
from controllers.extensions import mail
import logging

# Definir el blueprint para las rutas relacionadas con productos
product = Blueprint('product', __name__)

@product.route('/add-product', methods=['POST'])
@jwt_required()
def add_product():
    """
    Añade un nuevo producto a la base de datos.
    
    El usuario debe estar autenticado. La función valida la existencia de la imagen,
    guarda los datos del producto en la base de datos y almacena el archivo en el servidor.

    :return: Mensaje de éxito o error.
    """
    nombre_usuario = get_jwt_identity()

    if 'foto' not in request.files:
        return jsonify({'error': 'Falta el archivo de la foto'}), 400
    file = request.files['foto']
    if file.filename == '':
        return jsonify({'error': 'Archivo no seleccionado'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(current_app.config['UPLOAD_FOLDER']):
        os.makedirs(current_app.config['UPLOAD_FOLDER'])
    file.save(file_path)

    new_product = Producto(
        nombre_usuario=nombre_usuario,
        titulo=request.form['titulo'],
        descripcion=request.form['descripcion'],
        foto=file_path,
        categoria=request.form['categoria'],
        contacto=request.form['contacto'],
        precio=request.form['precio']
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify({'message': 'Producto añadido exitosamente', 'file_path': file_path}), 201

@product.route('/productos', methods=['GET'])
@jwt_required()
def get_productos():
    """
    Obtiene una lista de productos, filtrada opcionalmente por categoría.
    
    :return: Lista de productos en formato JSON.
    """
    categoria = request.args.get('categoria', None)
    try:
        if categoria:
            productos = Producto.query.filter_by(categoria=categoria).all()
        else:
            productos = Producto.query.all()
        return jsonify([producto.to_dict() for producto in productos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product.route('/productos/<int:id>', methods=['GET'])
@jwt_required()
def get_producto(id):
    """
    Obtiene los detalles de un producto específico por su ID.

    :param id: ID del producto.
    :return: Detalles del producto o mensaje de error si no existe.
    """
    producto = Producto.query.get(id)
    if producto:
        return jsonify(producto.to_dict())
    else:
        return jsonify({'message': 'Producto no encontrado'}), 404

@product.route('/mis-productos', methods=['GET'])
@jwt_required()
def get_mis_productos():
    """
    Obtiene una lista de productos creados por el usuario autenticado.

    :return: Lista de productos en formato JSON.
    """
    nombre_usuario = get_jwt_identity()
    productos = Producto.query.filter_by(nombre_usuario=nombre_usuario).all()
    return jsonify([producto.to_dict() for producto in productos]), 200

@product.route('/productos/<int:producto_id>', methods=['DELETE'])
@jwt_required()
def delete_producto(producto_id):
    """
    Elimina un producto por su ID.
    
    :param producto_id: ID del producto a eliminar.
    :return: Mensaje de éxito o error.
    """
    producto = Producto.query.get_or_404(producto_id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado exitosamente'}), 200

@product.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    """
    Actualiza los datos de un producto existente.
    
    :param id: ID del producto a actualizar.
    :return: Mensaje de éxito o error.
    """
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({'message': 'Producto no encontrado'}), 404

    data = request.json
    producto.titulo = data.get('titulo', producto.titulo)
    producto.descripcion = data.get('descripcion', producto.descripcion)
    producto.categoria = data.get('categoria', producto.categoria)
    producto.contacto = data.get('contacto', producto.contacto)
    producto.precio = data.get('precio', producto.precio)
    db.session.commit()
    return jsonify({'message': 'Producto actualizado correctamente'}), 200

@product.route('/comprar', methods=['POST'])
@jwt_required()
def comprar():
    """
    Registra una compra para el usuario autenticado y envía un correo de confirmación.
    
    :return: Mensaje de éxito o error.
    """
    try:
        nombre_usuario = get_jwt_identity()
        producto_id = request.json.get('producto_id')
        
        if not producto_id:
            return jsonify({'error': 'Falta el ID del producto'}), 400

        nueva_compra = Compra(nombre_usuario=nombre_usuario, producto_id=producto_id)
        db.session.add(nueva_compra)

        user = Usuario.query.filter_by(nombre_usuario=nombre_usuario).first()
        producto = Producto.query.get(producto_id)

        if not user or not producto:
            return jsonify({'error': 'Usuario o producto no encontrado'}), 404

        send_purchase_email(user.correo, producto.titulo)
        db.session.commit()

        return jsonify({'message': 'Compra exitosa y correo enviado'}), 200
    except Exception as e:
        logging.error(f"Error al realizar la compra: {e}")
        return jsonify({'error': str(e)}), 500

def send_purchase_email(user_email, product_title):
    """
    Envía un correo electrónico de confirmación de compra.

    :param user_email: Dirección de correo del usuario.
    :param product_title: Título del producto comprado.
    """
    msg = Message(
        'Confirmación de Compra',
        sender='MScreatec@gmail.com',
        recipients=[user_email]
    )
    msg.body = f'Has comprado el producto: {product_title}. Gracias por tu compra!'
    mail.send(msg)

@product.route('/productos-comprados', methods=['GET'])
@jwt_required()
def productos_comprados():
    """
    Obtiene una lista de productos comprados por el usuario autenticado.

    :return: Lista de productos en formato JSON.
    """
    try:
        nombre_usuario = get_jwt_identity()
        compras = Compra.query.filter_by(nombre_usuario=nombre_usuario).all()
        productos = [Producto.query.get(compra.producto_id).to_dict() for compra in compras if Producto.query.get(compra.producto_id)]
        return jsonify(productos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product.route('/add-opinion', methods=['POST'])
@jwt_required()
def add_opinion():
    """
    Añade una opinión a un producto específico.
    
    :return: Mensaje de éxito o error.
    """
    try:
        nombre_usuario = get_jwt_identity()
        data = request.json

        nueva_opinion = Opinion(
            calificacion=data['calificacion'],
            comentario=data['comentario'],
            nombre_usuario=nombre_usuario,
            producto_id=data['producto_id']
        )
        db.session.add(nueva_opinion)
        db.session.commit()
        return jsonify({'message': 'Opinión añadida exitosamente'}), 201
    except Exception as e:
        logging.error(f"Error al añadir la opinión: {e}")
        return jsonify({'error': str(e)}), 500

@product.route('/opiniones/<int:producto_id>', methods=['GET'])
def obtener_opiniones(producto_id):
    """
    Obtiene todas las opiniones de un producto específico.

    :param producto_id: ID del producto.
    :return: Lista de opiniones en formato JSON.
    """
    try:
        opiniones = Opinion.query.filter_by(producto_id=producto_id).all()
        return jsonify([opinion.to_dict() for opinion in opiniones]), 200
    except Exception as e:
        logging.error(f"Error obteniendo opiniones: {e}")
        return jsonify({'error': str(e)}), 500
