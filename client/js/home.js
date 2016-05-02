require.config({
    urlArgs: "bust=v1", // Cambiar para refrescar cache
    paths: {
        "jquery": "lib/jquery",
        "jquery-ui": "lib/jquery-ui",
        "text": "lib/text",
        "json": "lib/json"
    },
    shim: {
        "jquery-ui": {
            exports:"$" ,
            deps: ['jquery']
        }
    }
});

define(['lib/class', 'lib/lodash', 'lib/stacktrace', 'util'], function() {
    require(["main"]);
});