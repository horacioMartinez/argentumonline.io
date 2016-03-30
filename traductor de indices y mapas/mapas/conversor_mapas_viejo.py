import json
import struct
import os  

for fn in os.listdir('.'):
	if not os.path.isfile(fn):
		continue
	if not fn.endswith(".map"):
		continue
	
	origen = open(fn, "rb")

	fileDest = "mapas_json/" + "m" + fn[1:fn.find('.')] + '.json'
	print fileDest
	destino = open(fileDest,"w")

	origen.read(256+17)  # saco header

	mapa = [[[0 for x in range(6)] for x in range(101)] for x in range(101)] 
	y = 1
	while ( y < 101):
		x = 1
		while (x < 101):
			flags = struct.unpack('<B', (origen.read(1)))[0] # cant layers

			if (flags & 1):
				bloqueado=1
			else:
				bloqueado=0

			layer1 = struct.unpack('<H', (origen.read(2)))[0] # l1
			
			if (flags & 2):
				layer2 = struct.unpack('<H', (origen.read(2)))[0] # l1	
			else:
				layer2=0

			if (flags & 4):
				layer3 = struct.unpack('<H', (origen.read(2)))[0] # l1	
			else:
				layer3=0

			if (flags & 8):
				layer4 = struct.unpack('<H', (origen.read(2)))[0] # l1	
			else:
				layer4=0

			if (flags & 16):
				trigger = struct.unpack('<H', (origen.read(2)))[0] # l1
				if ( (trigger != 1) and (trigger != 4) ):
					trigger = 0
			else:
				trigger=0

			#mapa[x][y] = {'layer1':layer1, 'layer2':layer2,'layer3':layer3,'layer4':layer4,'trigger':trigger}
			mapa[x][y][0] = bloqueado
			mapa[x][y][1] = layer1
			mapa[x][y][2] = layer2
			mapa[x][y][3] = layer3
			mapa[x][y][4] = layer4
			mapa[x][y][5] = trigger
			x = x+1

		y = y+1

	json.dump(mapa, destino, indent=4)