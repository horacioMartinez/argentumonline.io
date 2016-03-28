require.config({
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

define(['lib/class', 'lib/underscore', 'lib/stacktrace', 'util'], function() {
    require(["main"]);
});