from datetime         import datetime
from flask            import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors       import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///estoque.db"
db = SQLAlchemy(app)


class Produto(db.Model):

    id         = db.Column(db.Integer, primary_key=True)
    nome       = db.Column(db.String(100), unique=True, nullable=False)
    categoria  = db.Column(db.String(50), nullable=False)
    quantidade = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self):

        return {

            "id":         self.id,
            "nome":       self.nome,
            "categoria":  self.categoria,
            "quantidade": self.quantidade,

        }


class Movimentacao(db.Model):

    id         = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey("produto.id"), nullable=False)
    tipo       = db.Column(db.String(10), nullable=False)  # "entrada" ou "saida"
    quantidade = db.Column(db.Integer, nullable=False)
    data       = db.Column(db.DateTime, default=datetime.now)

    produto = db.relationship("Produto", backref="movimentacoes")

    def to_dict(self):

        return {

            "id": self.id,
            "produto": self.produto.nome,
            "tipo": self.tipo,
            "quantidade": self.quantidade,
            "data": self.data.isoformat(),

        }


with app.app_context():
    db.create_all()


@app.route("/entrada", methods=["POST"])
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
        db.session.flush()  # gera o id do produto antes do commit

    db.session.add(Movimentacao(produto_id=produto.id, tipo="entrada", quantidade=quantidade))
    db.session.commit()
    return jsonify(produto.to_dict()), 201


@app.route("/saida", methods=["POST"])
def registrar_saida():

    dados = request.get_json()
    nome = (dados.get("nome") or "").strip()

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


@app.route("/produtos", methods=["GET"])
def listar_produtos():

    return jsonify([p.to_dict() for p in Produto.query.order_by(Produto.nome).all()])


@app.route("/movimentacoes", methods=["GET"])
def listar_movimentacoes():
    
    movs = Movimentacao.query.order_by(Movimentacao.data.desc()).all()
    return jsonify([m.to_dict() for m in movs])


if __name__ == "__main__":
    app.run(debug=True)