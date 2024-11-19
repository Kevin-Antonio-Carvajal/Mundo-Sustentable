# Mundo Sustentable
Repositorio oficial del proyecto final Riesgo Tecnológico - 2024, Facultad de Ciencias, UNAM, semestre 2024-2.

## Profesores:
- Selene Marisol Martínez Ramírez
- Luis Angel Rojas Espinoza
- Luis Rey Rutiaga Robles
- César Eduardo Jardines Mendoza
- Itzel Azucena Delgado Díaz

## Alumnos:
- Antonio Carvajal Kevin
- Martínez Pardo Esaú
- Terrazas Alejandro


## Instrucciones de Ejecución

### Crear y Activar el Entorno Virtual
Para ejecutar el programa primero se deberá crear el entorno virtual para la ejecución. Se puede hacer con los siguientes comandos:

#### En Windows:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### En macOS o linux:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Configuración de la Base de Datos
Se deberá haber levantado la base de datos desde un software gestor de bases de datos (SGBDD) o bien para crear la base desde la consola:

```bash
sudo mysql -u root -p < base.sql
```

### Ejecución del Backend
Una vez lista la base de datos navega hacia el directorio del Backend de la app y ejecuta:

```bash
cd App/Backend/
python3 -m flask run
```

### Ejecución del Frontend
Ahora abre otra instancia de la consola y, asegurandote de que el entorno virtual está activado, ejecuta lo siguiente para ejecutar el Frontend:

```bash
cd App/Frontend/
```

Si es la primera vez, deberás instalar las dependencias con:
```bash
npm install
```

Luego para ejecutar:
```bash
npm start
```





