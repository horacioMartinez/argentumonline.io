require.config({
    urlArgs: "bust=v0.0.1",
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

define(['lib/lodash', 'lib/stacktrace', 'utils/util'], function () {
    require(["main"]);
});