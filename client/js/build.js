({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../client-build",
    mainConfigFile: 'home.js',
    removeCombined: true,
    fileExclusionRegExp: /^(build)\.js$/,

        modules: [
            {
                name: "main",
                exclude: ["lib/pixi","lib/websock","lib/howler","lib/jquery","lib/jquery-ui","text","json"]
            },
            {
                name: "home",
                exclude: ["main","lib/underscore","lib/stacktrace","lib/class"]
            }
    ],

})
