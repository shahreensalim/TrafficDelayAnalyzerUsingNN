from flask import Flask, render_template, url_for, request, jsonify, flash,redirect, session
import pandas as pd
from io import StringIO
import json
import numpy as np
from functions import myNet, generate_data, convert_json, convert_graph, generateDelay
app = Flask(__name__)
# arr = generate_data(5)
# traffic_graph = convert_graph(arr)
# print(traffic_graph)
# traffic_mat = convert_json(arr)
# print(traffic_mat)
# df = pd.read_csv("data.csv")
# all_data = json.loads(df.to_json(orient='records'))
# # print(all_data)
# df = pd.read_csv("adj_all.csv")
# adjmat_data = json.loads(df.to_json(orient='records'))
numNodes = 5
topo = 'star'
bw =5
traffic_graph = []
traffic_mat = []
delay_graph = []
delay_mat = []
delay_max=10

generate_data(10, topo, bw)
generate_data(15, topo, bw)
arr = generate_data(numNodes, topo, bw)
traffic_graph = convert_graph(arr)
print(traffic_graph)
traffic_mat = convert_json(arr)

@app.route("/")
def home():
    return render_template("index.html",title = "Home")


@app.route("/load_traffic",methods=["GET","POST"])
def load_traffic():
    global numNodes, topo, bw
    if request.method == "POST":
        req = request.get_json()
        numNodes = req['numNodes']
        topo = req['topo']
        bw = req['bw']
        returnData()
        return "Ok"
@app.route("/get_all_data", methods=["GET"])
def returnData():
    global traffic_graph, traffic_mat, delay_graph, delay_mat, numNodes, topo, bw
    arr = generate_data(numNodes, topo, bw)
    traffic_graph = convert_graph(arr)
    print(traffic_graph)
    traffic_mat = convert_json(arr)
    return jsonify({"traffic_data": traffic_graph, "traffic_mat":traffic_mat})

@app.route("/return_delay", methods=["GET"])
def returnDelay():
    global delay_graph, delay_mat, delay_max
    print(delay_graph)
    print(delay_mat)
    return jsonify({"delay_data": delay_graph, "delay_mat":delay_mat,'delay_max':delay_max})
@app.route("/send_traffic",methods=["GET","POST"])
def send_traffic():
    global traffic_graph, traffic_mat, delay_graph, delay_mat, delay_max;
    if request.method == "POST":
        req = request.get_json()
        traffic_mat = req['traffic_mat']
        traffic_graph = req['traffic_graph']
        print(traffic_graph)
        delay_graph, delay_mat, delay_max= generateDelay(traffic_mat)
        returnDelay()
        return "Ok"

if __name__ == "__main__":
    app.run(port=5000, debug=False)
