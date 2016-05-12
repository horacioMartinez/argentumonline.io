require.config({
    urlArgs: "bust=v0.01", // Cambiar para refrescar cache
    paths: {
        "jquery": "lib/jquery",
        "jquery-ui": "lib/jquery-ui",
        "text": "lib/text",
        "json": "lib/json"
    },
    shim: {
        "jquery-ui": {
            exports: "$",
            deps: ['jquery']
        }
    }
});

define(['lib/class', 'lib/lodash', 'lib/stacktrace', 'utils/util'], function () {
    require(["main"]);
});