from flask import Flask, jsonify
from nbapy import league
import json
import pandas as pd
import os
import math

def df_to_json(df):
    columns = df.columns.to_list()
    columns_dict = [{"Header": col, "accessor": col} for col in columns]
    
    data_dict = df.to_dict(orient="records")
    
    return json.dumps({"columns": columns_dict, "data": data_dict})

app = Flask(__name__)

if os.environ.get('FLASK_ENV') != 'production':
    from flask_cors import CORS
    CORS(app)

@app.route('/')
def index():
    return "Flask API v1", 200

@app.route('/data')
def data():
    cols = ['TEAM_NAME', 'W_PCT', 'P_EXP', 'PTS', 'OPP_PTS', 'AST', 'REB', 'PTS_RANK', 'OPP_PTS_RANK', 'AST_RANK', 'REB_RANK']
    team_df = league.TeamStats(per_mode='PerGame').stats()
    opp_df = league.TeamStats(measure_type='Opponent', per_mode='PerGame').stats()
    df = pd.merge(team_df, opp_df, on='TEAM_ID')
    df = df.filter(regex='^(?!.*_y)', axis=1)
    df = df.rename(columns=lambda x: x.replace('_x', ''))
    df['P_EXP'] = df.apply(lambda row: math.pow(row['PTS'], 16) / (math.pow(row['PTS'], 16) + math.pow(row['OPP_PTS'], 16)), axis=1).round(2)
    df = df[cols]
    return df_to_json(df), 200

@app.route('/health')
def health():
    return '', 200

@app.route('/ready')
def ready():
    return '', 200