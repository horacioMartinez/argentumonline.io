#!/usr/bin/env bash

TOPLEVELDIR="`dirname $0`/.."
BUILDDIR="$TOPLEVELDIR/dakara-client-build"
TEMP_CLIENTDIR="$TOPLEVELDIR/client-temp"
TEMP_GITDIR="$TOPLEVELDIR/git-temp"
PROJECTDIR="$TEMP_CLIENTDIR/js"


#Esto solo lo hago porque r.js no anda si le pasas directamete ES 6. TODO: updatearlo cuando lo arreglen y sacar esto de copiar el cliente y pasarlo a es5
echo "copiando client a client-temp......"
rm -rf "$TEMP_CLIENTDIR"
cp -r "$TOPLEVELDIR/client" "$TEMP_CLIENTDIR"

echo "Convirtiendo a es5........"
gulp es6toes5-tempclient


echo "Deleting previous build directory (except git files)........"
#rm -rf "$BUILDDIR"
find "$BUILDDIR" -mindepth 1 -maxdepth 1 -not -name '.git' -not -name '.gitignore' | xargs rm -rf

echo "copiando git del build a git-temp (necesario porque sino r.js lo borra de la carpeta)"
rm -rf "$TEMP_GITDIR"
cp -r "$BUILDDIR" "$TEMP_GITDIR"


echo "Building client with RequireJS........"
node "$TOPLEVELDIR/bin/r.js" -o "$PROJECTDIR/build.js"

echo "Uglifycando........"
gulp uglify


#echo "Obfuscando........"
#python "$TOPLEVELDIR/bin/obfuscador.py" "$BUILDDIR/js"

echo "Autoprefixer........"
gulp autoprefixer

echo "Comprimiendo........"

{
	find "$BUILDDIR" \( -name '*.css' -o -name '*.html' -o -name '*.xml' -o -name '*.json' -o -name '*.js' \) -exec gzip --verbose --keep --best --force {} \;
} &>> "$BUILDDIR/build.txt"

echo "Borrando scss y map........"
find "$BUILDDIR" \( -name '*.scss' -o -name '*.map' \) -type f -delete

#para copiar tambien archivos ocultos (los de git):
shopt -s dotglob
echo "Moviendo git-temp a dakara-client-build"
mv "$TEMP_GITDIR/"* "$BUILDDIR"

echo "Moving build.txt to current dir........"
mv "$BUILDDIR/build.txt" "$TOPLEVELDIR"


echo "borrando temporales......"
rm -rf "$TEMP_CLIENTDIR"
rm -rf "$TEMP_GITDIR"

echo "Build complete"