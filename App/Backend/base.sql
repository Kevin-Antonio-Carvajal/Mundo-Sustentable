CREATE DATABASE login_p5;

CREATE USER 'lab'@'localhost' IDENTIFIED BY 'Developer123!';

GRANT ALL PRIVILEGES ON login_p5.* TO 'lab'@'localhost'
WITH GRANT OPTION;

USE login_p5;

CREATE TABLE Usuarios
(
  usuario_id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  tipo_rol ENUM('comprador', 'vendedor') NOT NULL,
  UNIQUE (correo),
  UNIQUE (telefono),
  UNIQUE (nombre_usuario) -- Asegura que nombre_usuario sea único, si aún no se ha definido                        
);

CREATE TABLE Productos (
  producto_id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  foto VARCHAR(255),  
  categoria VARCHAR(255) NOT NULL,
  contacto VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,  
  nombre_usuario VARCHAR(255) NOT NULL,  -- Usar nombre_usuario en vez de usuario_id
  FOREIGN KEY (nombre_usuario) REFERENCES Usuarios(nombre_usuario) -- Actualización de la clave foránea
);

CREATE TABLE Compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(50) NOT NULL,
  producto_id INT NOT NULL,
  FOREIGN KEY (nombre_usuario) REFERENCES Usuarios(nombre_usuario),
  FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);

CREATE TABLE Opiniones (
  opinion_id INT AUTO_INCREMENT PRIMARY KEY,
  calificacion INT NOT NULL,
  comentario TEXT NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  producto_id INT NOT NULL,
  FOREIGN KEY (nombre_usuario) REFERENCES Usuarios(nombre_usuario),
  FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);

-- Asegurarse de que el precio no pueda ser negativo
ALTER TABLE Productos
MODIFY precio DECIMAL(10, 2) CHECK (precio >= 0);

-- Asegurar que el correo sea un correo válido
ALTER TABLE Usuarios
MODIFY correo VARCHAR(255) NOT NULL CHECK (correo LIKE '%@%');

-- Asegurar que el teléfono tenga un formato válido (asumiendo que es un número mexicano)
ALTER TABLE Usuarios
MODIFY telefono VARCHAR(50) NOT NULL CHECK (telefono REGEXP '^[0-9]{10}$');
