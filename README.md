# Dakara-client

[Jugar!](http://web.dakara.com.ar/)

Cliente web del MMORPG Argentum Online, escrito desde cero en Javascript.

# Ejecutar

Solo es necesario hostear la carpeta client -que contiene el index.html-, en un servidor local http, como si se tratase de cualquier pagina web. Un programa simple para hacer esto es [http-server](https://github.com/indexzero/http-server)

# Configuración cliente

Para configurar el cliente usar el archivo config.json, donde se indica puerto, ip y version del servidor al cual se conectará:

```json
{
    "version":"0.13.2",
    "ip":"dakaraonline.tk",
    "port":"443"
}
```

# Cliente minificado

No hace falta hacer esto, pero es recomandable, ya que crea una version del codigo compatible con navegadores viejos, disminuye el tamaño del codigo y junta los distintos archivos en uno solo. VER MAS

Ir a la carpeta bin y ejecutar build.sh. Es necesario estar corriendo linux, tener node, gulp y varias cosas mas que no tengo ganas de fijarme.

El cliente minificado se crea en una nueva carpeta 'dakara-client-build/build'.

# Hostear servidor propio

El cliente funciona con cualquier servidor 0.13 de Argentum Online, pueden usar el de [Dakara](https://github.com/DakaraOnline/dakara-server) o cualquier otro.
Sin embargo para hacerlo es necesario ejecutar [websockify](https://github.com/kanaka/websockify) en el servidor.

Que hace y porque es necesario websockify? Al correr el cliente desde un navegador, no es posible utilizar las conecciones de TCP "puro" que utilizan las aplicaciones de escritorio, sino que es necesario usar WebSockets, un protocolo adicional encima de TCP.

Entonces, Para que el servidor de Argentum pueda entender estas conexiones de WebSockets, websockify se encarga de traducirlas y comunicarselo al servidor.

Se trata de un esquema asi:

Cliente web -> websockify -> servidor

Servidor -> websockify -> cliente web

Para lograr esto, es necesario conectarse a un puerto designado a websockify, no al del servidor (ahora lo vemos en un ejemplo)

Además, sigue siendo posible conectarse desde el cliente de escritorio (el original del Argentum), para ello habrá que indicarle directamente el puerto de nuestro servidor (como siempre), no el de websockify.

### Ejemplo de configuración

Tenemos el servidor de Argentum Online con la configuración:

IP: localhost
puerto: 7666

Entonces, corremos websockify para que tradusca el trafico del puerto 443 al 7666 (es decir, el de nuestro servidor)

$ websockify 443:7666

Por lo tanto, desde el cliente web nos conectamos al puerto 443:

(config.json)
{
"version":"0.13.0"
"ip":"localhost"
"port":"443"
}

Y si se quiere conectar desde el cliente de escritorio, se debe hacerlo al puerto 7666.




