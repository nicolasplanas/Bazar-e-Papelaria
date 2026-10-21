import hmac
from functools         import wraps
from flask             import Blueprint, request, jsonify, current_app
from itsdangerous      import URLSafeTimedSerializer, BadSignature
from werkzeug.security import check_password_hash

auth_bp = Blueprint("auth", __name__)

TEMPO_SESSAO = 60 * 60 * 12  # 12 horas


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="login-estoque")


@auth_bp.route("/login", methods=["POST"])
def login():
    dados = request.get_json(silent=True) or {}
    usuario = str(dados.get("usuario", ""))
    senha = str(dados.get("senha", ""))

    usuario_ok = hmac.compare_digest(
        usuario.encode(), current_app.config["ADMIN_USER"].encode()
    )
    hash_salvo = current_app.config["ADMIN_PASSWORD_HASH"]
    senha_ok = bool(hash_salvo) and check_password_hash(hash_salvo, senha)

    if not (usuario_ok and senha_ok):
        return jsonify({"erro": "Usuário ou senha inválidos"}), 401

    token = _serializer().dumps({"usuario": usuario})
    return jsonify({"token": token})


def login_required(f):
    @wraps(f)
    def decorada(*args, **kwargs):
        cabecalho = request.headers.get("Authorization", "")
        if not cabecalho.startswith("Bearer "):
            return jsonify({"erro": "Não autorizado"}), 401
        try:
            _serializer().loads(cabecalho[7:], max_age=TEMPO_SESSAO)
        except BadSignature:  # inclui token expirado
            return jsonify({"erro": "Sessão expirada, faça login novamente"}), 401
        return f(*args, **kwargs)

    return decorada

@auth_bp.route("/api/sessao", methods=["GET"])
@login_required
def sessao():
    return jsonify({"ok": True})