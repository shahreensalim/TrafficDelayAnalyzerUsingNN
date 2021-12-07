At first please go to http://knowledgedefinednetworking.org and download the 4 datasets under the "Understanding the Network Modeling of Computer Networks:" section.
1. routing.zip
2. saturation.zip
3. netSize.zip
4. topologies.zip
The entire code for training, testing, saving the models, and saving the results are done in a single notebook "534_UD_ANN.ipynb". You can find it inside the folder "Notebook Files". You can run this notebook on a jupyter notebook or on google colab. The original notebook was run on google colab.
The names of the classes and the functions are self-explanatory most of the time. The Class myNet is the class for the feed-forward neural network. Class Dataset generates batched data. The read_and_create_models() function reads all the data files in the given directory and trains, creates, and saves a model for each file.
