import sys, random, re

excludeFunctions = ["init","start","stop","doubleclick","flush","resizeUi","success","tic","tick","render","resize","click","show","hide","setPosition","cambiarHeading"]
excludeChars = [' ','{','}','(',')','$','"',"'"]

def funcion_invalida(func):
	if (func in excludeFunctions):
		return True
	for ch in excludeChars:
		if ch in func:
			return True
	return False

def generate_random_name():
	nombre = ''.join(random.choice(["I","l","i","t"]) for i in range(10))
	while nombre in nombresUsados:
		nombre = ''.join(random.choice(["I","l","i","t"]) for i in range(10))
	nombresUsados.append(nombre)
	return nombre

filename = sys.argv[-1]

origen = open(filename, "r")
log = open("./logObfucador.txt","w")

nombresUsados = []

codigo = ''.join(l[:-1] for l in origen)

nombreFunciones = (re.findall('[^#]{20},([^,]*):function\([^\)]*\)\{[^#]{100}',codigo)) #nombreFunciones = (re.findall('[^#]{20},([^,]*):function\([^\)]*\)\{[^#]{100}',codigo))
#saco repetidos
nombreFunciones = list(set(nombreFunciones))

nombresPrototipos = (re.findall('\.prototype\.([^=]*)=',codigo))
excludeFunctions.extend(nombresPrototipos)



for func in nombreFunciones:
	if (funcion_invalida(func)):
		continue

	nuevo_nombre = generate_random_name();
	s = func + " -> " + nuevo_nombre
	print s
	log.write(s + '\n')
	
	# Cambio nombre funcion en las declaraciones:
	regEx1 = r"(,)" + re.escape(func) + r"(:function\([^\)]*\){)"
	regEx2 = r'\1' + re.escape(nuevo_nombre) + r'\2'
	p = re.compile(regEx1)
	codigo = p.sub(regEx2, codigo)

	# Ahora en donde se use
	regEx1 = r"(\.)" + re.escape(func) + r"([\(\),])"
	regEx2 = r'\1' + re.escape(nuevo_nombre) + r'\2'
	p = re.compile(regEx1)
	codigo = p.sub(regEx2, codigo)

destino = open(filename,"w")
destino.write(codigo)
destino.close()
