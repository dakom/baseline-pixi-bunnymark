import * as PIXI from 'pixi.js';
import { TickHandler, Tick } from './CoreLib';

export const makeStatus = () => {
    const status = new PIXI.Text("Loading...", {fill: 0xFF00FF});

    const onTick = (tick:Tick) => (nBunnies:number) => {
        const fps = Math.round(1000/tick.deltaTime).toString();
        status.text = `${fps} FPS w/ ${nBunnies.toString()} Bunnies`;
    }

    return {
        display: status,
        onTick: onTick
    }
}