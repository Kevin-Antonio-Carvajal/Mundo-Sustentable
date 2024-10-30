from flask import Blueprint, render_template
from models.models import Usuario, db

usuario_blueprint = Blueprint('usuario', __name__, url_prefix='/usuarios')

