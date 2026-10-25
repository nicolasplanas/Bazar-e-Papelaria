from extensions import db

class Produto(db.Model):

    id         = db.Column(db.Integer, primary_key=True)
    nome       = db.Column(db.String(100), unique=True, nullable=False)
    descricao  = db.Column(db.String(255))
    categoria  = db.Column(db.String(50), nullable=False)
    codigo     = db.Column(db.String(20))
    quantidade = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self):
        
        return {
            "id":         self.id,
            "nome":       self.nome,
            "descricao":  self.descricao,
            "categoria":  self.categoria,
            "codigo":     self.codigo,
            "quantidade": self.quantidade
        }