import bcrypt

class PasswordHasher:
    @staticmethod
    def hash_password(password):
        """
        Genera un hash para una contraseña dada.
        
        :param password: La contraseña a hashear.
        :return: Un hash de la contraseña.
        """
        # Convertir la contraseña a bytes, luego hashear
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        return hashed_password.decode('utf-8')

    @staticmethod
    def check_password(hashed_password, password):
        """
        Verifica si una contraseña coincide con su versión hasheada.
        
        :param hashed_password: El hash de la contraseña almacenada.
        :param password: La contraseña proporcionada para verificar.
        :return: True si las contraseñas coinciden, False de lo contrario.
        """
        # Convertir ambas, la contraseña y el hash, a bytes
        hashed_password_bytes = hashed_password.encode('utf-8')
        password_bytes = password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_password_bytes)