from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return "Flask API v1", 200

@app.route('/data')
def data():
    return jsonify({'stats': [45, 62, 71]}), 200

@app.route('/health')
def health():
    return '', 200

@app.route('/ready')
def ready():
    return '', 200