require.config({
    paths: {
        "jquery": "lib/jquery",
        "jquery-ui": "lib/jquery-ui",
        "PxLoader": "lib/PxLoader"
    },
    shim: {
        "jquery-ui": {
            exports:"$" ,
            deps: ['jquery']
        }
    }
});

define(['lib/class', 'lib/underscore.min', 'lib/stacktrace', 'util'], function() {
    require(["main"]);
});