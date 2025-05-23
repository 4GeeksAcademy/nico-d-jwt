from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)
bcrypt = Bcrypt()

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        return jsonify({'msg': 'Error al procesar la solicitud, faltan datos'}), 404
    else:
        if not User.query.filter_by(email=data['email']).first():
            user = User()
            user.email = data['email']
            pss_hashed = bcrypt.generate_password_hash(data['password'])
            user.password = pss_hashed
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            return jsonify({'msg': 'El usuario fue creado con exito'})
        else:
            return jsonify({'msg': 'El usuario que intenta crear ya existe'}), 400


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        return jsonify({'msg': 'Error al iniciar sesion, revise sus credenciales'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'msg': 'Error al iniciar sesion, revise sus credenciales'}), 404
    token = create_access_token(identity=user.email)
    return jsonify({'token': token}), 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'msg': 'Felicidades accediste a tu perfil usando JWT Token'}), 200