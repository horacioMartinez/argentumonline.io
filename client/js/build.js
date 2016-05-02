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
                exclude: ["lib/pixi","lib/websock","lib/howler","lib/jquery","lib/jquery-ui","text","json"]
            },
            {
                name: "home",
                exclude: ["main","lib/lodash","lib/stacktrace","lib/class"]
            }
    ],

})
