require.config({
    urlArgs: "bust=v0.0.1",
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

define(['lib/lodash', 'lib/stacktrace'], function () {
    require(['bootstrap']);
    require(["main"]);
});