from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Text, Numeric, Enum, ForeignKey
import bcrypt

db = SQLAlchemy()

class Usuario(db.Model):
    """
    Modelo que representa un usuario en la aplicación.
    Incluye métodos para gestionar contraseñas.
    """
    __tablename__ = 'Usuarios'
    usuario_id = Column(Integer, primary_key=True)
    correo = Column(String(255), nullable=False, unique=True)
    telefono = Column(String(50), nullable=False, unique=True)
    nombre_usuario = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    tipo_rol = Column(Enum('comprador', 'vendedor'), nullable=False)

    def set_password(self, password):
        """
        Genera un hash de la contraseña y lo almacena.
        :param password: Contraseña en texto plano.
        """
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """
        Verifica si una contraseña coincide con el hash almacenado.
        :param password: Contraseña en texto plano.
        :return: True si coincide, False en caso contrario.
        """
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def __repr__(self):
        """
        Representación del modelo para depuración.
        :return: Cadena representativa del usuario.
        """
        return f"<Usuario {self.nombre_usuario}>"

class Producto(db.Model):
    """
    Modelo que representa un producto en la aplicación.
    Incluye un método para convertir sus atributos en un diccionario.
    """
    __tablename__ = 'Productos'
    producto_id = Column(Integer, primary_key=True)
    titulo = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=False)
    foto = Column(String(255))
    categoria = Column(String(255), nullable=False)
    contacto = Column(String(255), nullable=False)
    precio = Column(Numeric(10, 2), nullable=False)
    nombre_usuario = Column(String(255), ForeignKey('Usuarios.nombre_usuario'), nullable=False)

    def __init__(self, titulo, descripcion, foto, categoria, contacto, precio, nombre_usuario):
        """
        Inicializa una instancia del modelo Producto.
        """
        self.titulo = titulo
        self.descripcion = descripcion
        self.foto = foto
        self.categoria = categoria
        self.contacto = contacto
        self.precio = precio
        self.nombre_usuario = nombre_usuario

    def __repr__(self):
        """
        Representación del modelo para depuración.
        :return: Cadena representativa del producto.
        """
        return f"<Producto {self.titulo}>"

    def to_dict(self):
        """
        Convierte los atributos del producto a un diccionario.
        :return: Diccionario con los datos del producto.
        """
        return {
            'id': self.producto_id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'imagen': self.foto,
            'categoria': self.categoria,
            'contacto': self.contacto,
            'precio': str(self.precio),
            'nombre_usuario': self.nombre_usuario
        }

class Compra(db.Model):
    """
    Modelo que representa una compra realizada por un usuario.
    Relaciona usuarios y productos.
    """
    __tablename__ = 'Compras'
    id = Column(Integer, primary_key=True)
    nombre_usuario = Column(String(50), ForeignKey('Usuarios.nombre_usuario'), nullable=False)
    producto_id = Column(Integer, ForeignKey('Productos.producto_id'), nullable=False)

class Opinion(db.Model):
    """
    Modelo que representa una opinión sobre un producto.
    Incluye un método para convertir sus atributos en un diccionario.
    """
    __tablename__ = 'Opiniones'
    opinion_id = Column(Integer, primary_key=True)
    calificacion = Column(Integer, nullable=False)
    comentario = Column(Text, nullable=False)
    nombre_usuario = Column(String(255), ForeignKey('Usuarios.nombre_usuario'), nullable=False)
    producto_id = Column(Integer, ForeignKey('Productos.producto_id'), nullable=False)

    def to_dict(self):
        """
        Convierte los atributos de la opinión a un diccionario.
        :return: Diccionario con los datos de la opinión.
        """
        return {
            'opinion_id': self.opinion_id,
            'calificacion': self.calificacion,
            'comentario': self.comentario,
            'nombre_usuario': self.nombre_usuario,
            'producto_id': self.producto_id
        }
