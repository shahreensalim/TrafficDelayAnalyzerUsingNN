from flask import Flask, render_template, url_for, request, jsonify, flash,redirect, session
import pandas as pd
from io import StringIO
import json
import numpy as np

app = Flask(__name__)
# df = pd.read_csv("data.csv")
# all_data = json.loads(df.to_json(orient='records'))
# # print(all_data)
# df = pd.read_csv("adj_all.csv")
# adjmat_data = json.loads(df.to_json(orient='records'))

@app.route("/")
def home():
    return render_template("index.html",title = "Home")

@app.route("/dashboard")
def dashboard():
    return render_template("index2.html", title = "Home")

@app.route("/get_all_data", methods=["GET"])
def returnData():
    return jsonify({"all_data": all_data, "adjmat": adjmat_data})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
