from .auth     import auth_bp
from .armazem  import estoque_bp, produtos_bp, movimentacoes_bp
from .previsao import previsao_bp


def register_routes(app):
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(estoque_bp)
    app.register_blueprint(produtos_bp)
    app.register_blueprint(movimentacoes_bp)
    app.register_blueprint(previsao_bp)