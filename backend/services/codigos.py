from extensions import db
from models import Produto

PREFIXOS = {
    "papelaria": "PAP",
    "bomboniere": "BOM",
    "sorvetes": "GEL",
    "presentes": "PRE",
}


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
            pass

    return f"{prefixo}-{maior + 1:05d}"