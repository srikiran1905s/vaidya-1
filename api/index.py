import sys
import os

# Add backend_flask to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend_flask'))

from app import app