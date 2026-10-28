from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from extensions import db
from models import Produto, Movimentacao
from routes.auth import login_required
from services.codigos import PREFIXOS, proximo_codigo

produtos_bp = Blueprint("produtos", __name__)


@produtos_bp.route("/produtos", methods=["GET"])
@login_required
def listar_produtos():
    produtos = Produto.query.order_by(Produto.nome).all()
    return jsonify([p.to_dict() for p in produtos])


@produtos_bp.route("/produtos", methods=["POST"])
@login_required
def cadastrar_produto():
    dados = request.get_json(silent=True) or {}
    nome = (dados.get("nome") or "").strip()
    descricao = (dados.get("descricao") or "").strip() or None
    categoria = (dados.get("categoria") or "").strip()

    if not nome or not categoria:
        return jsonify({"erro": "Nome e categoria são obrigatórios"}), 400
    if categoria not in PREFIXOS:
        return jsonify({"erro": "Categoria inválida"}), 400
    if Produto.query.filter_by(nome=nome).first():
        return jsonify({"erro": "Já existe um produto com esse nome"}), 409

    try:
        produto = Produto(
            nome=nome,
            descricao=descricao,
            categoria=categoria,
            codigo=proximo_codigo(categoria),
            quantidade=0,
        )
        db.session.add(produto)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"erro": "Não foi possível gerar o código, tente novamente"}), 409

    return jsonify(produto.to_dict()), 201


@produtos_bp.route("/produtos/<int:produto_id>", methods=["PUT"])
@login_required
def editar_produto(produto_id):
    produto = db.session.get(Produto, produto_id)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    dados = request.get_json(silent=True) or {}
    nome = (dados.get("nome") or "").strip()
    descricao = (dados.get("descricao") or "").strip() or None
    categoria = (dados.get("categoria") or "").strip()

    if not nome or not categoria:
        return jsonify({"erro": "Nome e categoria são obrigatórios"}), 400
    if categoria not in PREFIXOS:
        return jsonify({"erro": "Categoria inválida"}), 400

    outro = Produto.query.filter(
        Produto.nome == nome, Produto.id != produto_id
    ).first()
    if outro:
        return jsonify({"erro": "Já existe outro produto com esse nome"}), 409

    try:
        if categoria != produto.categoria:
            # categoria nova: o item recebe o próximo código dessa categoria
            produto.codigo = proximo_codigo(categoria)

        produto.nome = nome
        produto.descricao = descricao
        produto.categoria = categoria
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"erro": "Não foi possível salvar, tente novamente"}), 409

    return jsonify(produto.to_dict()), 200


@produtos_bp.route("/produtos/<int:produto_id>", methods=["DELETE"])
@login_required
def excluir_produto(produto_id):
    produto = db.session.get(Produto, produto_id)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    if Movimentacao.query.filter_by(produto_id=produto_id).first():
        return jsonify({
            "erro": "Este produto já tem movimentações e não pode ser excluído"
        }), 409

    db.session.delete(produto)
    db.session.commit()
    return jsonify({"ok": True}), 200

@produtos_bp.route("/produtos/<int:produto_id>", methods=["GET"])
@login_required
def detalhar_produto(produto_id):
    produto = db.session.get(Produto, produto_id)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    movimentacoes = (
        Movimentacao.query
        .filter_by(produto_id=produto_id)
        .order_by(Movimentacao.data.desc(), Movimentacao.id.desc())
        .all()
    )

    return jsonify({
        "produto": produto.to_dict(),
        "movimentacoes": [m.to_dict() for m in movimentacoes],
    })