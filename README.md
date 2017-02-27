# Dakara-client

Dakara Online is a HTML5/Javascript MMORPG.

[Play it now.](http://horaciomartinez.github.io/dakara-client/)

[Server code.](https://github.com/DakaraOnline/dakara-server)

### Running ###

To run the client it is necessary to host the 'client' folder in a http server, one program that enables you to do this is [http-server](https://github.com/indexzero/http-server).

### Client configuration ###

The server version, ip and port can be configured in the file 'config.json':

```json
{
    "version":"0.13.2",
    "ip":"dakaraonline.tk",
    "port":"443"
}
```

### Client build ###

This step is not necessary, but it is recommended to transpile the code to es5 syntax to support older browsers, and to minify the code, you can achieve this running the script 'build.sh' inside the bin folder.

### Hosting server ###

In addition to following the indications in the [server](https://github.com/DakaraOnline/dakara-server) readme, you should use [websockify](https://github.com/kanaka/websockify) to translate the client traffic from websockets to pure TCP.

### License ###

This content is released under the (http://opensource.org/licenses/MIT) MIT License.


# Dakara-client (Español)

[Jugar!](http://web.dakara.com.ar/)

Cliente web del MMORPG Argentum Online, escrito desde cero en Javascript.

### Ejecutar ###

Solo es necesario hostear la carpeta client -que contiene el index.html-, en un servidor local http, como si se tratase de cualquier pagina web. Un programa simple para hacer esto es [http-server](https://github.com/indexzero/http-server)

### Configuración cliente ###

Para configurar el cliente usar el archivo config.json, donde se indica puerto, ip y version del servidor al cual se conectará:

```json
{
    "version":"0.13.2",
    "ip":"dakaraonline.tk",
    "port":"443"
}
```

### Cliente minificado ###

No hace falta hacer esto, pero es recomandable, ya que crea una version del codigo compatible con navegadores viejos, disminuye el tamaño del codigo y junta los distintos archivos en uno solo. [Ver wiki](https://github.com/horacioMartinez/dakara-client/wiki/Cliente-minificado)

### Hostear servidor propio ###

[Ver en wiki](https://github.com/horacioMartinez/dakara-client/wiki/Hostear-servidor-propio)

### Licencia ###

Los contenidos estan sujetos a la licencia MIT (http://opensource.org/licenses/MIT).
