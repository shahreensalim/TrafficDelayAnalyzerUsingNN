import numpy as np
import random
import os



import torch
import torch.nn as nn

#torch.manual_seed(1337)
filename =""
class myNet(nn.Module):
    def __init__(self,
                 input_dim: int,
                 layer_num: int = 2,
                 neuron_num: int = -1
                 ) :

        super(myNet, self).__init__()
        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        self._layer_num = layer_num
        if neuron_num < 0:
          neuron_num = input_dim
        if(layer_num == 2):
          self.linear_predictor = nn.Sequential(
              nn.Linear(input_dim, neuron_num),
              nn.Sigmoid(),
              nn.Linear(neuron_num, input_dim)
          )
          print("hola")
        else:
          self.linear_predictor = nn.Sequential(
              nn.Linear(input_dim, input_dim),
          )

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        #print("Vow")
        inputs = inputs.float()
        outputs = self.linear_predictor(inputs)
        #print("done vow")
        return outputs
traffic_matrix = {"5":[], "10":[], "15":[]}
def generate_data(n, topo, bw):
    global filename, traffic_matrix
    filename = "Visualization Models/"+topo+"/data"+topo+"_"+str(n)+"_"+str(n)+"_4_16000_B.pt"
    if(len(traffic_matrix[str(n)])==0):
        for i in range(n):
            traffic_matrix[str(n)].append([])
            for j in range(n):
                if i==j:
                    x = 0
                else:
                    x = round(random.uniform(0.1, 4), 1)
                traffic_matrix[str(n)][i].append(x)
        traffic_matrix[str(n)]= np.array(traffic_matrix[str(n)])
    return traffic_matrix[str(n)]

def convert_graph(arr):
    print(arr)
    nodes= []
    links = []
    for i in range(arr.shape[0]):
        nodes.append({'id': i+1})
    for i in range(arr.shape[0]):
        for j in range(arr.shape[1]):
            if i==j:
                continue
            links.append({'source':i+1, 'target': j+1, 'value':round(float(arr[i][j]), 1)})
    ret = {'nodes': nodes, "links": links}
    return ret
def convert_json(arr):
    ret = []
    for i in range(arr.shape[0]):
        x = []
        for j in range(arr.shape[1]):
            x.append(round(float(arr[i][j]),1))
        ret.append({i:x})
    return ret

def convert_np(g):
    ret = []
    for i in range(len(g)):
        ret.append(g[i][str(i)])
    ret = np.array(ret)
    return ret
def generateDelay(traffic):
    global filename
    traffic = convert_np(traffic)
    traffic = torch.from_numpy(traffic)
    #filename = "Visualization Models/"+topo+"/data"+topo+"_"+str(n)+"_"+str(n)+"_4_16000_B.pt"
    print(filename)
    assert(os.path.exists(filename))
    model = torch.load(filename)
    d = model(traffic)
    d = d.detach().numpy()
    maxi = float(np.max(d))
    for i in range(d.shape[0]):
        for j in range(d.shape[1]):
            d[i][j] = max(0, d[i][j])
    x = convert_graph(d)
    y = convert_json(d)
    return x,y, maxi
