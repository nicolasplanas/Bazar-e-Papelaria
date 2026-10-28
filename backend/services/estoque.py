from extensions import db
from models import Produto, Movimentacao


class EstoqueError(Exception):
    """Erro de regra de negócio, com status HTTP sugerido."""
    def __init__(self, mensagem, status=400):
        super().__init__(mensagem)
        self.status = status


def movimentar(produto_id, quantidade, tipo):
    produto = db.session.get(Produto, produto_id)
    if not produto:
        raise EstoqueError("Produto não encontrado", 404)

    if tipo == "saida":
        if produto.quantidade < quantidade:
            raise EstoqueError(
                f"Estoque insuficiente (disponível: {produto.quantidade})", 400
            )
        produto.quantidade -= quantidade
    else:
        produto.quantidade += quantidade

    db.session.add(Movimentacao(produto_id=produto.id, tipo=tipo, quantidade=quantidade))
    db.session.commit()
    return produto