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
            exclude: ["detect","jquery","lib/jquery"]
        },
        {
            name: "home",
            exclude: ["detect"]
        }
    ],
    optimize: "none",
})
