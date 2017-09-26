/*
 * Imports
 */
const path = require('path');
const express = require('express');
const { FuseBox, RawPlugin, CSSPlugin, QuantumPlugin, WebIndexPlugin, EnvPlugin, Sparky } = require("fuse-box");
/*
 * Config
 */

const projectName = "baseline-pixi-bunnymark";
const PageTitle = "Baseline Pixi Bunnymark";
const sourceMapStyle = { inline: false };

/*
 * No need to adjust anything below this line
 */



const BUILD = {
    PRODUCTION: "production",
    TEST: "test",
    DEV: "dev",
    BUILD_DEBUG: "build-debug"
}

const buildType = process.env.BUILD_TYPE;

if(Object.keys(BUILD).map(key => BUILD[key]).indexOf(buildType) === -1) {
    console.error(`unknown build type! [${buildType}]`);
    process.exit();
}
console.log(`----------- building [${buildType}] --------`);

/*
 * Main Producer
 */
const mainProducer = FuseBox.init({
    homeDir: "src",
    useTypescriptCompiler : true,
    cache: false,
    sourceMaps: (buildType === BUILD.PRODUCTION) ? undefined : sourceMapStyle,
    output: (buildType === BUILD.PRODUCTION) ? `dist/$name.min.js` : `dist/$name.js`,
    plugins: [
        RawPlugin([".glsl"]),
        
        WebIndexPlugin({
            title: PageTitle,
            template: "./src/webpage/index.html",
            path: "."
        }),

        CSSPlugin(),

        EnvPlugin({ BUILD_TYPE: buildType }),

        (buildType === BUILD.PRODUCTION) && QuantumPlugin({
            removeUseStrict: false,
            bakeApiIntoBundle: projectName,
            treeshake: true,
            uglify: true,
            target: "browser"
        })
    ],
    target: "browser",
});

const mainBundle = mainProducer.bundle(projectName);

switch(buildType) {
    case BUILD.TEST:
        mainBundle.test("[tests/**/**.test.ts]");
        break;
    default:
        mainBundle.instructions(`> app/Main.ts`);
        break;
}

/*
 * Run Fuse
 */


if (buildType === BUILD.DEV) {
    mainBundle.watch();
    

    mainProducer.dev({ open: true }, server => {
        const app = server.httpServer.app;
        app.use("/static/", express.static(path.resolve("./src/webpage/static")));
    });
}

mainProducer.run();
