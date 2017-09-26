import * as PIXI from "pixi.js";
import {setupPixi, startRenderer, detectTouch, Tick} from "./CoreLib";
import {makeStatus} from "./Status";
import {loadBunnyTexture, setupBunnies} from "./Bunnies";

console.log("Baseline pixi bunny mark test version 1.0");

const app = setupPixi(document.getElementById("canvas") as HTMLCanvasElement);
const onTick = startRenderer (app) (detectTouch(app));
const status = makeStatus();

app.stage.addChild(status.display);

loadBunnyTexture("static/bunny.png")
    .then(texture => {
        const bunnies = setupBunnies (texture) (2);
        app.stage.addChildAt(bunnies.container, 0);

        onTick((tick:Tick) => {
            bunnies.onTick(tick);
            status.onTick (tick) (bunnies.getCount());
        });
    });