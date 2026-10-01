from .armazem.estoque       import estoque_bp
from .armazem.produtos      import produtos_bp
from .armazem.movimentacao  import movimentacoes_bp
from .previsao.previsao     import previsao_bp


def register_routes(app):

    app.register_blueprint(estoque_bp)
    app.register_blueprint(produtos_bp)
    app.register_blueprint(movimentacoes_bp)
    app.register_blueprint(previsao_bp)