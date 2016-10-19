#!/usr/bin/bash

TOPLEVELDIR="`dirname $0`/.."
BUILDDIR="$TOPLEVELDIR/dakara-client-build/build"
TEMP_CLIENTDIR="$TOPLEVELDIR/client-temp"
PROJECTDIR="$TEMP_CLIENTDIR/js"

#Esto solo lo hago porque r.js no anda si le pasas directamete ES 6. TODO: updatearlo cuando lo arreglen y sacar esto de copiar el cliente y pasarlo a es5
echo "copiando client a client-temp......"
rm -rf "$TEMP_CLIENTDIR"
cp -r "$TOPLEVELDIR/client" "$TEMP_CLIENTDIR"
# borrar archivos ocultos (OJO, ignora los errores)
rm -rf "$TEMP_CLIENTDIR"/.* 2> /dev/null

echo "Convirtiendo a es5........"
gulp es6toes5-tempclient


echo "Deleting previous build directory........"
rm -rf "$BUILDDIR"

echo "Building client with RequireJS........"
node "$TOPLEVELDIR/bin/r.js" -o "$PROJECTDIR/build.js"

echo "Uglifycando........"
gulp uglify

#echo "Comprimiendo........"
#{
#	find "$BUILDDIR" \( -name '*.css' -o -name '*.html' -o -name '*.xml' -o -name '*.json' -o -name '*.js' \) -exec gzip --verbose --keep --best -n --force {} \;
#} &>> "$BUILDDIR/build.txt"

echo "Borrando scss y map........"
find "$BUILDDIR" \( -name '*.scss' -o -name '*.map' \) -type f -delete

echo "Moving build.txt to current dir........"
mv "$BUILDDIR/build.txt" "$TOPLEVELDIR"

echo "borrando cliente temporal......"
rm -rf "$TEMP_CLIENTDIR"

echo "Build complete"