import numpy as np
import random
def generate_data(n, topo, bw):
    arr = []
    for i in range(n):
        arr.append([])
        for j in range(n):
            if i==j:
                x = 0
            else:
                x = round(random.uniform(0.1, 10.0), 1)
            arr[i].append(x)
    arr = np.array(arr)
    print(arr.shape)
    return arr

def convert_graph(arr):
    nodes= []
    links = []
    for i in range(arr.shape[0]):
        nodes.append({'id': i+1})
    for i in range(arr.shape[0]):
        for j in range(arr.shape[1]):
            if i==j:
                continue
            links.append({'source':i+1, 'target': j+1, 'value':arr[i][j]})
    ret = {'nodes': nodes, "links": links}
    return ret
def convert_json(arr):
    ret = []
    for i in range(arr.shape[0]):
        x = []
        for j in range(arr.shape[1]):
            x.append(arr[i][j])
        ret.append({i:x})
    return ret

def convert_np(g):
    ret = []
    for i in range(len(g)):
        ret.append(g[i][str(i)])
    ret = np.array(ret)
    return ret
def generateDelay(traffic):
    d = convert_np(traffic)
    print(d)
    for i in range(d.shape[0]):
        for j in range(d.shape[1]):
            d[i][j] = round(d[i][j]*1.5/2,1)
    x = convert_graph(d)
    y = convert_json(d)
    return x,y
