require.config({
    urlArgs: "bust=v0.2.4",
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