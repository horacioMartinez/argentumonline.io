require.config({
    paths: {
        "jquery": "lib/jquery",
        "jquery-ui": "lib/jquery-ui"
    },
    shim: {
        "jquery-ui": {
            export:"$" ,
            deps: ['jquery']
        }
    }
});

define(['lib/class', 'lib/underscore.min', 'lib/stacktrace', 'util'], function() {
    require(["main"]);
});