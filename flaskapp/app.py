from flask import Flask, jsonify
from flask_cors import CORS

from nba_api.stats.endpoints import leaguedashteamstats
import json
import pandas as pd

def df_to_json(df):
    columns = df.columns.to_list()
    columns_dict = [{"Header": col, "accessor": col} for col in columns]
    
    data_dict = df.to_dict(orient="records")
    
    return json.dumps({"columns": columns_dict, "data": data_dict})

app = Flask(__name__)

CORS(app)

@app.route('/')
def index():
    return "Flask API v1", 200

@app.route('/data')
def data():
    df = leaguedashteamstats.LeagueDashTeamStats()
    df = df.get_data_frames()[0]
    cols = ['TEAM_NAME', 'W_PCT', 'PTS', 'AST', 'REB', 'PTS_RANK', 'AST_RANK', 'REB_RANK']
    df = df[cols]
    return df_to_json(df), 200

@app.route('/health')
def health():
    return '', 200

@app.route('/ready')
def ready():
    return '', 200