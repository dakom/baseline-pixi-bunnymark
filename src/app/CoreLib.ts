import * as PIXI from "pixi.js";

export interface Tick {
    deltaTime:number,
    isTouched:boolean,
    stageWidth:number,
    stageHeight:number
}
export interface TickHandler{
    (tick: Tick): void
}

export const setupPixi = (canvas:HTMLCanvasElement) => 
    new PIXI.Application({
        width: window.innerWidth, 
        height: window.innerHeight, 
        backgroundColor: 0x2a2a2a,
        view: canvas,
        autoStart: false,
        });

export const startRenderer = (app:PIXI.Application) => (isTouched:() => boolean) => (onTick:TickHandler) => {
    let lastUpdate;
    
    const renderFrame = (frameNow) => {
        onTick({
            deltaTime: lastUpdate === undefined ? 0 : frameNow - lastUpdate,
            isTouched: isTouched(),
            stageWidth: window.innerWidth,
            stageHeight: window.innerHeight
        });
        
        lastUpdate = frameNow;

        app.render();

        requestAnimationFrame(renderFrame);
    }
    requestAnimationFrame(renderFrame);

    window.onresize = evt => {
        app.view.setAttribute('width', window.innerWidth.toString());
        app.view.setAttribute('height', window.innerHeight.toString());

        app.renderer.resize(this.stageWidth,this.stageHeight);
    };
}

export const detectTouch = (app:PIXI.Application):(() => boolean) => {
    let isTouching = false;

    app.renderer.plugins.interaction.on('pointerdown', () => isTouching = true);
    app.renderer.plugins.interaction.on('pointerup', () => isTouching = false);

    return () => isTouching;
}

