#!/usr/bin/env bash

TOPLEVELDIR="`dirname $0`/.."
BUILDDIR="$TOPLEVELDIR/client-build"
PROJECTDIR="$TOPLEVELDIR/client/js"

echo "Deleting previous build directory"
rm -rf "$BUILDDIR"

echo "Building client with RequireJS"
node "$TOPLEVELDIR/bin/r.js" -o "$PROJECTDIR/build.js"

#java -jar ./compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js "$BUILDDIR/js/main.js"  --js_output_file "$BUILDDIR/js/main.js"

echo "Moving build.txt to current dir"
mv "$BUILDDIR/build.txt" "$TOPLEVELDIR"
find "$BUILDDIR" -name ".idea" -type d -exec rm -rf {} \;

echo "Build complete"
