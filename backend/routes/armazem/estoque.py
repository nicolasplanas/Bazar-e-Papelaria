from flask       import Blueprint, request, jsonify
from models      import Produto, Movimentacao
from extensions  import db
from routes.auth import login_required

estoque_bp = Blueprint("estoque", __name__)


def _ler_movimentacao():
    """Lê produto_id e quantidade do JSON. Retorna (produto_id, quantidade) ou None."""
    dados = request.get_json(silent=True) or {}
    try:
        produto_id = int(dados.get("produto_id"))
        quantidade = int(dados.get("quantidade"))
    except (TypeError, ValueError):
        return None
    if quantidade <= 0:
        return None
    return produto_id, quantidade


@estoque_bp.route("/entrada", methods=["POST"])
@login_required
def registrar_entrada():
    leitura = _ler_movimentacao()
    if leitura is None:
        return jsonify({"erro": "Selecione um produto e informe uma quantidade válida"}), 400

    produto_id, quantidade = leitura
    produto = db.session.get(Produto, produto_id)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    produto.quantidade += quantidade
    db.session.add(Movimentacao(produto_id=produto.id, tipo="entrada", quantidade=quantidade))
    db.session.commit()
    return jsonify(produto.to_dict()), 201


@estoque_bp.route("/saida", methods=["POST"])
@login_required
def registrar_saida():
    leitura = _ler_movimentacao()
    if leitura is None:
        return jsonify({"erro": "Selecione um produto e informe uma quantidade válida"}), 400

    produto_id, quantidade = leitura
    produto = db.session.get(Produto, produto_id)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404
    if produto.quantidade < quantidade:
        return jsonify({"erro": f"Estoque insuficiente (disponível: {produto.quantidade})"}), 400

    produto.quantidade -= quantidade
    db.session.add(Movimentacao(produto_id=produto.id, tipo="saida", quantidade=quantidade))
    db.session.commit()
    return jsonify(produto.to_dict()), 200