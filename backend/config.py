import os
from dotenv import load_dotenv

load_dotenv() # lê o .env só no seu computador

class Config:
    uri = os.environ.get("DATABASE_URL")

    if not uri:

        if os.environ.get("RENDER"):

            raise RuntimeError("DATABASE_URL não definida: cadastre em Environment no Render")
        
        uri = "sqlite:///estoque.db"  # uso local

    # força o driver psycopg2 (o SQLAlchemy 2.1 usaria psycopg 3 por padrão)
    if uri.startswith("postgres://"):

        uri = uri.replace("postgres://", "postgresql+psycopg2://", 1)

    elif uri.startswith("postgresql://"):
        
        uri = uri.replace("postgresql://", "postgresql+psycopg2://", 1)

    SQLALCHEMY_DATABASE_URI        = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False