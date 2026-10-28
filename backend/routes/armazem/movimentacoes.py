from flask       import Blueprint, jsonify
from models      import Movimentacao
from routes.auth import login_required

movimentacoes_bp = Blueprint("movimentacoes", __name__)


@movimentacoes_bp.route("/movimentacoes", methods=["GET"])
@login_required
def listar_movimentacoes():
    
    movs = Movimentacao.query.order_by(Movimentacao.data.desc(), Movimentacao.id.desc()).all()
    return jsonify([m.to_dict() for m in movs])