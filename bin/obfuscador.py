import sys, random, re, os

# argumento: direccion del build 

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

def get_nombres_funciones_class(codigo):
	return re.findall(',([^,]*):function\([^\)]*\)\{',codigo) #[^#]{20},([^,]*):function\([^\)]*\)\{[^#]{100}

def get_nombres_prototypes(codigo):
	return re.findall('\.prototype\.([^=]*)=function',codigo)

def agregar_exclude_funcs_from_codigo_externo(cod):
	nombresFuncsClass = get_nombres_funciones_class(cod)
	excludeFunctions.extend(nombresFuncsClass)

	nombresPrototipos = get_nombres_prototypes(cod)
	excludeFunctions.extend(nombresPrototipos)

	nombresPropiedades = (re.findall('\.([^=;\,\-\|\?\*\/\!\.\+\[\(\)\:\{\}]*)[=;\,\-\|\?\*\/\!\.\+\(\)\:\{\}\[]',cod))
	excludeFunctions.extend(nombresPropiedades)


baseDir = sys.argv[-1]
libDir = baseDir + "/lib/"
filename = baseDir + "/main.js"

origen = open(filename, "r")
log = open("../logObfucador.txt","w")

nombresUsados = []

codigo = ''.join(l[:-1] for l in origen)

nombreFunciones = get_nombres_funciones_class(codigo)

#saco repetidos
nombreFunciones = list(set(nombreFunciones))

# agrego funciones invalidas del codigo main
excludeFunctions.extend( get_nombres_prototypes(codigo) )

# funciones que no se las use unicamente como .funcion(...) :
for func in nombreFunciones:
	if (funcion_invalida(func)):
		continue
	regex = re.compile(r"\." + re.escape(func) + r"([^\(a-zA-Z0-9])")
	usos = regex.findall(codigo)
	if (len(usos) > 0):
		excludeFunctions.append(func)

# agrego funciones invalidas de las librerias
codigoLibrerias = ""

for fn in os.listdir(libDir):
	if not fn.endswith(".js"):
		continue
	archivo = open(libDir + fn, "r")
	codigoLibrerias =  codigoLibrerias +''.join(l[:-1] for l in archivo)

agregar_exclude_funcs_from_codigo_externo(codigoLibrerias)

# saco repetidos

excludeFunctions = list(set(excludeFunctions))


# Convierto a los nuevos nombres:

for func in nombreFunciones:
	if (funcion_invalida(func)):
		continue

	nuevo_nombre = generate_random_name();
	s = func + " -> " + nuevo_nombre
	#print s
	log.write(s + '\n')
	
	# Cambio nombre funcion en las declaraciones:
	regEx1 = r"(,)" + re.escape(func) + r"(:function\([^\)]*\){)"
	regEx2 = r'\1' + re.escape(nuevo_nombre) + r'\2'
	p = re.compile(regEx1)
	codigo = p.sub(regEx2, codigo)

	# Ahora en donde se use (por lo de arriba solo se consideran los casos con .func(..) )
	regEx1 = r"(\.)" + re.escape(func) + r"([\(\),])"
	regEx2 = r'\1' + re.escape(nuevo_nombre) + r'\2'
	p = re.compile(regEx1)
	codigo = p.sub(regEx2, codigo)

destino = open(filename,"w")
destino.write(codigo)
destino.close()