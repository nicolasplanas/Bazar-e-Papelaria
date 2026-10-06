import os

class Config:

    uri = os.environ.get("DATABASE_URL, SQLITE://estoque.bd")

    # Alguns provedores entregram "postgres://", que o SQLAlchemy não aceita
    if uri.startswith("postgre://"):

        uri = uri.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI        = "sqlite:///estoque.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False