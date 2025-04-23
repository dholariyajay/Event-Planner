from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_mapping(
            SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
            SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///events.db'),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
        )
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Initialize CORS
    CORS(app)
    
    # Initialize SQLAlchemy with the app
    db.init_app(app)
    
    # Register blueprints
    from app.api import api_bp
    app.register_blueprint(api_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app
