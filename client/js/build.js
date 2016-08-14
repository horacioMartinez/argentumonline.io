({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../dakara-client-build/build",
    mainConfigFile: 'home.js',
    removeCombined: true,
    fileExclusionRegExp: /^(build)\.js$/,
    modules: [
        {
            name: "main",
            exclude: ["detect"]
            // exclude: ["lib/pixi", "lib/websock", "lib/howler", "lib/jquery", "lib/jquery-ui", "lib/bootstrap", "text", "json"]
        },
        {
            name: "home",
            exclude: ["detect"]
            /*exclude: ["main", "lib/lodash", "lib/stacktrace"]*/
        }
    ],
    optimize: "none",
})
