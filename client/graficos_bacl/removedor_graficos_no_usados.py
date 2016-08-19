#INSTRUCCIONES:
# poner script en la carpeta de graficos, y tambien poner ahi el graficos.json y CREAR carpeta llamada sin_usar (todo en la misma carpeta)
# mueve todos los graficos a la carpeta sin_usar

import json
import struct
import os  
from pprint import pprint

graficosEnUso = []

with open('graficos.json') as data_file:    
    data = json.load(data_file)

#pprint(data)

for grh in data:
	if type(grh) is not dict: #no es una lista (hay algunos que son 0)
		continue
	if 'grafico' not in grh:
		continue
	graficosEnUso.append(str(grh['grafico']))

for fn in os.listdir('.'):
	if not os.path.isfile(fn):
		continue
	if not (fn.endswith(".png") or fn.endswith(".jpg") or fn.endswith(".bmp") ):
		continue
	numeroGrafico = fn[0:fn.find('.')]
	if (numeroGrafico not in graficosEnUso):
		print("removido grafico: " + str(numeroGrafico))
		#os.remove(fn)
		os.rename(fn,"sin_usar/" + fn)