import json

################################################# GRAFICOS #################################################

origen = open("indices_originales/Graficos.ini", "r")
destino = open("indices_json/graficos.json","w")

res = [0 for i in range(24209)]
def agregar_grh(numGrh,grafico,offX,offY,width,height):
	nuevogrh= {'grafico':grafico, 'offX':offX, 'offY':offY, 'width':width, 'height':height}
	res[numGrh]=nuevogrh

def agregar_animacion(numGrh,grhs,velocidad):
	nuevaAnimacion= {'frames':grhs, 'velocidad':velocidad}
	res[numGrh]=nuevaAnimacion


graficos_inexistentes = [15232,4171,16113,684,17015,17016,17017,17018,17019,17020,17021,17022,17023,17024,17025,17026,3107,3108,3109,3110,3111,3112,3113,3114,685,686,687,688,689,690,3115,3116,3117,18029,18030,15233,15234,15235,15236,15237,15238,15239,6083,18031,18032,18033,18034,18035,18036,694,695,18038,18039,18040,18041]
grhs_invalidos=[]
# Cargar datos:
for line in origen:
	if line[0] != 'G':
		continue
	#saco Grh:
	line = line[3:]
	#saco fin de lineas:
	line = line.rstrip('\n')
	line = line.rstrip('\r')

	numGrh= int(line[:line.find('=')]) # ID = numgrh
	line = line[line.find('=')+1:]
	valores= line.split('-')
	
	frames = int(valores[0])
	valores.pop(0)
	if frames == 1 :
		grafico= int(valores[0])
		if grafico in graficos_inexistentes:
			grhs_invalidos.append(numGrh)
			continue
		offX = int (valores[1])
		offY = int (valores[2])
		width = int (valores[3])
		height = int (valores[4])
		agregar_grh(numGrh,grafico,offX,offY,width,height)
	else:
		grhs=[] # es una animacion, referencia a grhs anteriores
		for valor in valores:
			if valor == valores[len(valores)-1]:
				velocidad = float(valor)
			else:
				grhs.append(int(valor))

		skip=False
		for grhAvalidar in grhs:
			if grhAvalidar in grhs_invalidos:
				skip=True

		if skip:
			continue
		agregar_animacion(numGrh,grhs,velocidad)

json.dump(res, destino, indent=4)

################################################# CABEZAS #################################################

origen = open("indices_originales/Cabezas.ini", "r")
destino = open("indices_json/cabezas.json","w")

elementos=[]
res = [0 for i in range(515)]

def agregar(id,up,right,down,left):
	nuevoRes= {'up':up, 'right':right, 'down':down, 'left':left}
	res[id]=nuevoRes

for line in origen:
	if line[0] != 'H':
		continue
	#saco comments:
	line = line[:line.find('\'')]
	
	elementos.append( int( line[line.find('=')+1:]) )


i = 0
while i < ( len(elementos)):
	if ( i % 4 == 0) :
		agregar((i/4)+1,elementos[i],elementos[i+1],elementos[i+2],elementos[i+3])
	i = i+1

json.dump(res, destino, indent=4)

################################################# CASCOS #################################################

origen = open("indices_originales/Cascos.ini", "r")
destino = open("indices_json/cascos.json","w")

elementos=[]
res = [0 for i in range(23)]

def agregar(id,up,right,down,left):
	nuevoRes= { 'up':up, 'right':right, 'down':down, 'left':left}
	res[id]=nuevoRes

for line in origen:
	if line[0] != 'H':
		continue
	#saco comments:
	line = line[:line.find('\'')]
	
	elementos.append( int( line[line.find('=')+1:]) )


i = 0
while i < ( len(elementos)):
	if ( i % 4 == 0) :
		agregar((i/4)+1,elementos[i],elementos[i+1],elementos[i+2],elementos[i+3])
	i = i+1

json.dump(res, destino, indent=4)

################################################# CUERPOS #################################################

origen = open("indices_originales/cuerpos.ini", "r")
destino = open("indices_json/cuerpos.json","w")

elementos=[]
res = [0 for i in range(566)]

def agregar_cuerpo(id,up,right,down,left,offX,offY):
	nuevoRes= { 'up':up, 'right':right, 'down':down, 'left':left, 'offHeadX':offX, 'offHeadY':offY}
	res[id]=nuevoRes

for line in origen:
	if (line[0] != 'H') and (line[0] != 'W'):
		continue
	#saco comments:
	line = line[:line.find('\'')]
	
	elementos.append( int( line[line.find('=')+1:]) )


i = 0
while i < ( len(elementos)):
	if ( i % 6 == 0) :
		agregar_cuerpo((i/6)+1,elementos[i],elementos[i+1],elementos[i+2],elementos[i+3],elementos[i+4],elementos[i+5])
	i = i+1

json.dump(res, destino, indent=4)

################################################# ARMAS #################################################

origen = open("indices_originales/Armas.dat", "r")
destino = open("indices_json/armas.json","w")

elementos=[]
res = [0 for i in range(78)]

def agregar(id,up,right,left,down):
	nuevoRes= { 'up':right, 'right':down, 'down':up, 'left':left}
	res[id]=nuevoRes

for line in origen:
	if line[0] != 'D':
		continue
	#saco comments:
	line = line[:line.find('\'')]
	
	elementos.append( int( line[line.find('=')+1:]) )


i = 0
while i < ( len(elementos)):
	if ( i % 4 == 0) :
		if (i> 0 ):
			agregar((i/4)+2,elementos[i],elementos[i+1],elementos[i+2],elementos[i+3])
		else:
			agregar((i/4)+1,elementos[i],elementos[i+1],elementos[i+2],elementos[i+3])
	i = i+1

json.dump(res, destino, indent=4)

################################################# ESCUDOS #################################################

origen = open("indices_originales/Escudos.dat", "r")
destino = open("indices_json/escudos.json","w")

elementos=[]
res = [0 for i in range(11)]

def agregar(id,up,right,left,down):
	nuevoRes= { 'up':up, 'right':right, 'down':down, 'left':left}
	res[id]=nuevoRes

for line in origen:
	if line[0] != 'D':
		continue
	#saco comments:
	line = line[:line.find('\'')]
	
	elementos.append( int( line[line.find('=')+1:]) )


i = 0
while i < ( len(elementos)):
	if ( i % 4 == 0) :
		if (i> 0 ):
			agregar((i/4)+2,elementos[i],elementos[i+1],elementos[i+2],elementos[i+3])
		else:
			agregar((i/4)+1,elementos[i],elementos[i+1],elementos[i+2],elementos[i+3])
	i = i+1

json.dump(res, destino, indent=4)

################################################# CASCOS #################################################

origen = open("indices_originales/FXs.ini", "r")
destino = open("indices_json/fxs.json","w")

elementos=[]
res = [0 for i in range(39)]

def agregar(id,animacion,offX,offY):
	nuevoRes= { 'animacion':animacion, 'offX':offX, 'offY':offY}
	res[id]=nuevoRes

for line in origen:
	if (line[0] != 'A') and (line[0] != 'O'):
		continue
	#saco comments:
	line = line[:line.find('\'')]
	
	elementos.append( int( line[line.find('=')+1:]) )


i = 0
while i < ( len(elementos)):
	if ( i % 3 == 0) :
		agregar((i/3)+1,elementos[i],elementos[i+1],elementos[i+2])
	i = i+1

json.dump(res, destino, indent=4)