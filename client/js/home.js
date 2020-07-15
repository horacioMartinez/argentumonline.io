require.config({
    urlArgs: "bust=v1.1.0",
    paths: {
        "jquery": "lib/jquery",
        "jquery-ui": "lib/jquery-ui",
        "bootstrap": "lib/bootstrap",
        "text": "lib/text",
        "json": "lib/json"
    },
    shim: {
        "jquery-ui": {
            exports: "$",
            deps: ['jquery']
        },
        "bootstrap": {
            exports: "bootstrap",
            deps: ['jquery']
        },
    }
});

define([], function () {
    require(['bootstrap']);
    require(["main"]);
});