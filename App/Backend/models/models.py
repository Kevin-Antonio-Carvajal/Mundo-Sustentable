from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Text, Numeric, Enum, ForeignKey
import bcrypt

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'Usuarios'
    usuario_id = Column(Integer, primary_key=True)
    correo = Column(String(255), nullable=False, unique=True)
    telefono = Column(String(50), nullable=False, unique=True)
    nombre_usuario = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    tipo_rol = Column(Enum('comprador', 'vendedor'), nullable=False)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def __repr__(self):
        return f"<Usuario {self.nombre_usuario}>"

class Producto(db.Model):
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
        self.titulo = titulo
        self.descripcion = descripcion
        self.foto = foto
        self.categoria = categoria
        self.contacto = contacto
        self.precio = precio
        self.nombre_usuario = nombre_usuario

    def __repr__(self):
        return f"<Producto {self.titulo}>"

    def to_dict(self):
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
    __tablename__ = 'Compras'
    id = Column(Integer, primary_key=True)
    nombre_usuario = Column(String(50), ForeignKey('Usuarios.nombre_usuario'), nullable=False)
    producto_id = Column(Integer, ForeignKey('Productos.producto_id'), nullable=False)

class Opinion(db.Model):
    __tablename__ = 'Opiniones'
    opinion_id = Column(Integer, primary_key=True)
    calificacion = Column(Integer, nullable=False)
    comentario = Column(Text, nullable=False)
    nombre_usuario = Column(String(255), ForeignKey('Usuarios.nombre_usuario'), nullable=False)
    producto_id = Column(Integer, ForeignKey('Productos.producto_id'), nullable=False)

    def to_dict(self):
        return {
            'opinion_id': self.opinion_id,
            'calificacion': self.calificacion,
            'comentario': self.comentario,
            'nombre_usuario': self.nombre_usuario,
            'producto_id': self.producto_id
        }