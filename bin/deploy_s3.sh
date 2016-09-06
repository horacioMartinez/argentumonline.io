#!/usr/bin/env bash
############# MODIFICACION DE ###########################################
#  https://www.savjee.be/2014/03/Jekyll-to-S3-deploy-script-with-gzip/  #
#########################################################################


##
# Color stuff
##
NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2; tput bold)
YELLOW=$(tput setaf 3)

function red() {
    echo "$RED$*$NORMAL"
}

function green() {
    echo "$GREEN$*$NORMAL"
}

function yellow() {
    echo "$YELLOW$*$NORMAL"
}

##
# Actual script
##


BUCKET='s3://web.dakara.com.ar/'
SITE_DIR='./../dakara-client-build/build/'

# COMENTADO ########################
if false 
then
red '--> Gzipping all html, css, js and json files'
find $SITE_DIR \( -iname '*.html' -o -iname '*.css' -o -iname '*.js' -o -iname '*.json' \) -exec gzip -9 -n {} \; -exec mv {}.gz {} \;


yellow '--> Uploading css files'
s3cmd sync --exclude '*.*' --include '*.css' --add-header='content-type':'text/css' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET


yellow '--> Uploading js files'
s3cmd sync --exclude '*.*' --include '*.js' --add-header='content-type':'application/javascript' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET

yellow '--> Uploading json files'
s3cmd sync --exclude '*.*' --include '*.json' --add-header='content-type':'application/json' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET

# Sync media files first
#yellow '--> Uploading images (jpg, png, ico)'
#s3cmd sync --exclude '*.*' --include '*.png' --include '*.jpg' --include '*.ico' $SITE_DIR $BUCKET


# Sync html files
yellow '--> Uploading html files'
s3cmd sync --acl-public --delete-removed --exclude '*.*' --include '*.html' --add-header='content-type':'text/html' --add-header='Content-Encoding: gzip' $SITE_DIR $BUCKET
fi
# FIN COMENTADO ###################

# Sync everything else
yellow '--> Syncing everything else'
s3cmd sync --delete-removed $SITE_DIR $BUCKET