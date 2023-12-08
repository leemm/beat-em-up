import * as PIXI from 'pixi.js';
import { IScriptSprite } from './scripts';
import Chance from 'chance';

const chance = new Chance();

export function prop<T>(obj: T, key: string) {
    // @ts-ignore:next-line
    return obj[key];
}

export function key(keys: string[], code: string) {
    return keys.includes(code);
}

export function startingPosition(
    player: IScriptSprite,
    screen?: PIXI.Rectangle
): IScriptSprite {
    if (player.x === -1) {
        return { x: -40, y: player.y };
    }
    if (player.x === -9999) {
        return { x: screen.width + 50, y: player.y };
    }

    return player;
}

export function angleBetweenPoints(a: PIXI.Point, b: PIXI.Point): number {
    let deltaY = Math.abs(b.y - a.y);
    let deltaX = Math.abs(b.x - a.x);
    return Math.atan2(deltaY, deltaX);
}

export function random(): number {
    return chance.integer({ min: 1, max: 100 });
}

export function isHit(container1: PIXI.Container, container2: PIXI.Container) {
    let ab = container1.getBounds();
    let bb = container2.getBounds();

    ab.width = ab.width - 90;
    bb.width = bb.width - 90;

    return (
        ab.x + ab.width > bb.x &&
        ab.x < bb.x + bb.width &&
        ab.y + ab.height > bb.y &&
        ab.y < bb.y + bb.height
    );
}
