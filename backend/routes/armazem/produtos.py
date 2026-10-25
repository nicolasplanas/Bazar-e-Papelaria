from flask          import Blueprint, request, jsonify
from extensions     import db
from models         import Produto
from routes.auth    import login_required
from sqlalchemy.exc import IntegrityError

produtos_bp = Blueprint("produtos", __name__)

CATEGORIAS = [
    "papelaria", 
    "bomboniere", 
    "sorvetes", 
    "presentes"
]

PREFIXOS = {
    "papelaria":  "PAP",
    "bomboniere": "BOM",
    "sorvetes":   "GEL",
    "presentes":  "PRE"
}

@produtos_bp.route("/produtos", methods=["GET"])
@login_required
def listar_produtos():
    
    return jsonify([p.to_dict() for p in Produto.query.order_by(Produto.nome).all()])

@produtos_bp.route("/produtos", methods=["POST"])
@login_required
def cadastrar_produto():

    dados     = request.get_json(silent=True) or {}
    nome      = (dados.get("nome") or "").strip()
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

def proximo_codigo(categoria):
    prefixo = PREFIXOS[categoria]
    codigos = db.session.query(Produto.codigo).filter(
        Produto.codigo.like(f"{prefixo}-%")
    ).all()

    maior = 0
    for (codigo,) in codigos:
        try:
            maior = max(maior, int(codigo.split("-")[1]))
        except (IndexError, ValueError):
            pass  # código fora do padrão é ignorado

    return f"{prefixo}-{maior + 1:05d}"