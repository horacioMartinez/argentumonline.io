#!/usr/bin/env bash

TOPLEVELDIR="`dirname $0`/.."
BUILDDIR="$TOPLEVELDIR/dakara-client-build/build"
PROJECTDIR="$TOPLEVELDIR/client/js"

echo "Deleting previous build directory"
rm -rf "$BUILDDIR"

echo "Building client with RequireJS"
node "$TOPLEVELDIR/bin/r.js" -o "$PROJECTDIR/build.js"

echo "Obfuscando..."
python "$TOPLEVELDIR/bin/obfuscador.py" "$BUILDDIR/js"

echo "Autoprefixer.."
gulp autoprefixer

echo "Comprimiendo..."
{
	find "$BUILDDIR" \( -name '*.css' -o -name '*.html' -o -name '*.xml' -o -name '*.json' -o -name '*.js' \) -exec gzip --verbose --keep --best --force {} \;
} &>> "$BUILDDIR/build.txt"

echo "Borrando scss y map"
find "$BUILDDIR" \( -name "*.scss" -o -name '*.map' \) -type f -delete

echo "Moving build.txt to current dir"
mv "$BUILDDIR/build.txt" "$TOPLEVELDIR"

echo "Build complete"
