from flask  import Blueprint, jsonify
from models import Movimentacao

movimentacoes_bp = Blueprint("movimentacoes", __name__)


@movimentacoes_bp.route("/movimentacoes", methods=["GET"])
def listar_movimentacoes():
    
    movs = Movimentacao.query.order_by(Movimentacao.data.desc()).all()
    return jsonify([m.to_dict() for m in movs])