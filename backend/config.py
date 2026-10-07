import os
from dotenv import load_dotenv

load_dotenv() # lê o .env só no seu computador

class Config:

    uri = os.environ.get("DATABASE_URL")


    if not uri:
        # o Render define a variável RENDER automaticamente
        if os.environ.get("RENDER"):

            raise RuntimeError("DATABASE_URL não definida: cadastre em Environment no Render")
        
        uri = "sqlite:///estoque.db"  # uso local

        # o SQLAlchemy exige "postgresql://", mas alguns provedores entregam "postgres://"
    if uri.startswith("postgres://"):

        uri = uri.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI        = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False