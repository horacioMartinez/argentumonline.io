import json
import struct
import os  
origen = open("./FK.ind", "rb")
destino = open("./extra_data","w")

origen.read(256 + 7)  # saco header

cantidad_mapas = struct.unpack('<H', (origen.read(2)))[0] # l1

x = 1
while (x < cantidad_mapas +1):
	# numero X = numero de mapa
	lluvia = struct.unpack('<B', (origen.read(1)))[0]
	if (lluvia > 0):
		lluvia = 1
	destino.write(str(x)+"="+'"outdoor"'+":"+str(lluvia)+"\n")
	x = x +1

#hay menos mapas aca que en la otra carpeta..
extra = 100
while (x < cantidad_mapas + 1 +extra):
	destino.write(str(x)+"="+'"outdoor"'+":"+"0"+"\n")
	x = x +1

destino.close()
