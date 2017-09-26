import * as PIXI from 'pixi.js';
import { TickHandler, Tick } from './CoreLib';

export interface Bunny extends PIXI.Sprite {
    direction: {
        x: number;
        y: number;
    }
}

export const loadBunnyTexture = (url:string) => 
    new Promise<PIXI.Texture>(resolve => 
        new PIXI.loaders.Loader()
            .add("bunny", url)
            .load(res => resolve(res.resources.bunny.texture))
    );

const _makeBunnies = (container:PIXI.Container) => (texture:PIXI.Texture) => (amount:number = 100):Array<Bunny> => {
    const bunnies = new Array<Bunny>(amount);

    for(let idx = 0; idx < amount; idx++) {
        const bunny = new PIXI.Sprite(texture) as Bunny;
        bunny.direction = {
            x: Math.random() * 10,
            y: (Math.random() * 10) - 5
        }

        container.addChild(bunny);
        bunnies[idx] = (bunny);
    }

    return bunnies;
}

const updatePositions = (bunnies:Array<Bunny>) => (tick:Tick) => {
    //movement is made to match https://github.com/pixijs/bunny-mark/blob/master/src/Bunny.js
    bunnies.forEach(bunny => {
        bunny.position.x += bunny.direction.x;
        bunny.position.y += bunny.direction.y;
        bunny.direction.y += 0.75;
    
        if (bunny.position.x > tick.stageWidth) {
            bunny.direction.x *= -1;
            bunny.position.x = tick.stageWidth;
        }
        else if (bunny.position.x < 0) {
            bunny.direction.x *= -1;
            bunny.position.x = 0;
        }
    
        if (bunny.position.y > tick.stageHeight) {
            bunny.direction.y *= -0.85;
            bunny.position.y = tick.stageHeight;
            if (Math.random() > 0.5) {
                bunny.direction.y -= Math.random() * 6;
            }
        }
        else if (bunny.position.y < 0) {
            bunny.direction.y = 0;
            bunny.position.y = 0;
        }
    })
}

export const setupBunnies = (texture:PIXI.Texture) => (initialBunnies:number):{onTick:TickHandler, container:PIXI.Container, getCount:() => number} => {
    const container = new PIXI.Container();
    const makeBunnies = _makeBunnies (container) (texture);
    const bunnies = makeBunnies(initialBunnies);

    const onTick = (tick:Tick) => {
        if(tick.isTouched) {
            bunnies.push(...makeBunnies());
        }

        updatePositions (bunnies) (tick);
    }

    return {
        container: container,
        onTick: onTick,
        getCount: () => bunnies.length
    }  
}