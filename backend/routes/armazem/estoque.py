from flask      import Blueprint, request, jsonify
from models     import Produto, Movimentacao
from extensions import db

estoque_bp = Blueprint("estoque", __name__)


@estoque_bp.route("/entrada", methods=["POST"])
def registrar_entrada():

    dados     = request.get_json()
    nome      = (dados.get("nome") or "").strip()
    categoria = dados.get("categoria")

    try:

        quantidade = int(dados.get("quantidade"))

    except (TypeError, ValueError):

        return jsonify({"erro": "Quantidade inválida"}), 400

    if not nome or not categoria or quantidade <= 0:

        return jsonify({"erro": "Preencha todos os campos corretamente"}), 400

    produto = Produto.query.filter_by(nome=nome).first()

    if produto:

        produto.quantidade += quantidade

    else:

        produto = Produto(nome=nome, categoria=categoria, quantidade=quantidade)
        db.session.add(produto)
        db.session.flush()

    db.session.add(Movimentacao(produto_id=produto.id, tipo="entrada", quantidade=quantidade))
    db.session.commit()

    return jsonify(produto.to_dict()), 201


@estoque_bp.route("/saida", methods=["POST"])
def registrar_saida():

    dados = request.get_json()
    nome  = (dados.get("nome") or "").strip()

    try:

        quantidade = int(dados.get("quantidade"))

    except (TypeError, ValueError):

        return jsonify({"erro": "Quantidade inválida"}), 400

    if not nome or quantidade <= 0:

        return jsonify({"erro": "Preencha todos os campos corretamente"}), 400

    produto = Produto.query.filter_by(nome=nome).first()

    if not produto:

        return jsonify({"erro": "Produto não encontrado"}), 404
    
    if produto.quantidade < quantidade:

        return jsonify({"erro": f"Estoque insuficiente (disponível: {produto.quantidade})"}), 400

    produto.quantidade -= quantidade
    db.session.add(Movimentacao(produto_id=produto.id, tipo="saida", quantidade=quantidade))
    db.session.commit()

    return jsonify(produto.to_dict())