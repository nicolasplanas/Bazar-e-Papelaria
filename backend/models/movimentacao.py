from datetime import datetime
from zoneinfo import ZoneInfo
from extensions import db

def agora_brasil():

    return datetime.now(ZoneInfo("America/Sao_Paulo")).replace(tzinfo=None)

class Movimentacao(db.Model):

    id         = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey("produto.id"), nullable=False)
    tipo       = db.Column(db.String(10), nullable=False)  # "entrada" ou "saida"
    quantidade = db.Column(db.Integer, nullable=False)
    data       = db.Column(db.DateTime, default=agora_brasil)

    produto = db.relationship("Produto", backref="movimentacoes")

    def to_dict(self):
        
        return {
            "id":         self.id,
            "produto":    self.produto.nome,
            "tipo":       self.tipo,
            "quantidade": self.quantidade,
            "data":       self.data.isoformat(),
        }