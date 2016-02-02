f = open("mapa.js", "w")

for i in range (1,313):
	n = "mapa"+str(i)
	f.write("""'text!../mapas/""")
	f.write(n)
	f.write(""".json',""")


f.write("""





""")

for i in range (1,313):
	n = "mapa"+str(i)
	f.write(n)
	f.write(""",""")

f.write("""





""")

f.write("""

	getMapaFile: function(numMap){

	switch (numMap){

""")

for i in range (1,313):
	n = "mapa"+str(i)
	f.write("""
		case """)
	f.write(str(i))
	f.write(""":\n""")
	f.write(""" 
			return """)
	f.write(n)
	f.write(""";\n""")
	f.write("""
			break;""")
f.write("""
		default:
				throw Error("Numero de mapa invalido"); 
	}
}""")