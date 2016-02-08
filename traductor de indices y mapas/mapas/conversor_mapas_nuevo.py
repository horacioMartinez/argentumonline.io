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
	destino = open(fileDest,"w")

	#if fileDest != "mapas_json/mapa1.json":
	#	continue
	print fileDest

	origen.read(256+17)  # saco header

	mapa = [[[0 for y in range(6)] for y in range(101)] for y in range(101)] 
	x = 1
	while ( x < 101):
		y = 1
		while (y < 101):
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
			
			mapa[y][x][0] = bloqueado
			mapa[y][x][1] = layer1	
			mapa[y][x][2] = layer2
			mapa[y][x][3] = layer3				
			mapa[y][x][4] = layer4
			mapa[y][x][5] = trigger
			y = y+1
		x = x+1
	x = 1
	destino.write("[")
	while ( x < 101):
		y = 1
		destino.write("[")
		while (y < 101):
			destino.write("{")
			mapa[x][y][0] = mapa[x][y][0]
			if mapa[x][y][0] != 0:
				destino.write(""""0":""")
				destino.write(str(mapa[x][y][0]))
			#mapa[x][y][1] = mapa[x][y][1]
			if mapa[x][y][1] != 0:
				if mapa[x][y][0] != 0:
					destino.write(",")	
				destino.write(""""1":""")
				destino.write(str(mapa[x][y][1]))
			#mapa[x][y][2] = mapa[x][y][2]
			if mapa[x][y][2] != 0:
				if ( (mapa[x][y][0] != 0) or (mapa[x][y][1] != 0)):
					destino.write(",")
				destino.write(""""2":""")
				destino.write(str(mapa[x][y][2]))
			#mapa[x][y][3] = mapa[x][y][3]
			if mapa[x][y][3] != 0:
				if ( (mapa[x][y][0] != 0 or mapa[x][y][1] != 0) or mapa[x][y][2] != 0):
					destino.write(",")
				destino.write(""""3":""")
				destino.write(str(mapa[x][y][3]))
			#mapa[x][y][4] = layer4
			if mapa[x][y][4] != 0:
				if ( ((mapa[x][y][0] != 0 or mapa[x][y][1] != 0) or mapa[x][y][2] != 0) or mapa[x][y][3] != 0):
					destino.write(",")
				destino.write(""""4":""")
				destino.write(str(mapa[x][y][4]))

			if mapa[x][y][5] != 0:
				if ((((mapa[x][y][0] != 0 or mapa[x][y][1] != 0) or mapa[x][y][2] != 0) or mapa[x][y][3] != 0) or mapa[x][y][4] != 0):
					destino.write(",")
				destino.write(""""5":""")
				destino.write(str(mapa[x][y][5]))

			if y==100:
				destino.write("}")
			else:
				destino.write("},")
			y = y+1
		if x==100:
			destino.write("]")
		else:
			destino.write("],")
		x = x+1
	destino.write("]")

	
