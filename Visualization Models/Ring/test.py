

import torch
import torch.nn as nn

#torch.manual_seed(1337)

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



model=torch.load("dataRing_5_5_4_16000_B.pt")
print(model)
