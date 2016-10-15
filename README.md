# Dakara-client

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

### License ###

This content is released under the (http://opensource.org/licenses/MIT) MIT License.
