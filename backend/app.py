import os
from flask      import Flask
from config     import Config
from extensions import db, cors
from routes     import register_routes

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def create_app():

    app = Flask(__name__, instance_path=os.path.join(BASE_DIR, "database"))
    app.config.from_object(Config)

    db.init_app(app)
    cors.init_app(app, origins=os.environ.get("FRONTEND_URL", "*"))

    register_routes(app)

    with app.app_context():

        db.create_all()

    return app


if __name__ == "__main__":

    app = create_app()
    app.run(debug=True, port=5000)