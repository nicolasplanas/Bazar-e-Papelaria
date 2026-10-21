from flask  import Blueprint, jsonify
from models import Produto
from routes.auth import login_required

produtos_bp = Blueprint("produtos", __name__)


@produtos_bp.route("/produtos", methods=["GET"])
@login_required
def listar_produtos():
    
    return jsonify([p.to_dict() for p in Produto.query.order_by(Produto.nome).all()])