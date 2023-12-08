import * as PIXI from 'pixi.js';
import { IScripts, IScript } from './scripts';
import * as Sprites from '../sprites';
import Players, { IActivePlayers } from './players';
import { startingPosition } from './helpers';

export default class Enemies {
    app: PIXI.Application;
    scripts: IScripts;
    onScreenSprites: Sprites.Barbon[] = [];

    activePlayers: IActivePlayers;

    currentLevel: IScript;
    currentWave: number = 1;

    constructor(
        app: PIXI.Application,
        scripts: IScripts,
        activePlayers: IActivePlayers
    ) {
        this.app = app;
        this.scripts = scripts;
        this.activePlayers = activePlayers;

        this.currentLevel = this.scripts.level1;

        this.loadWave();
    }

    loadWave() {
        const wave = this.currentLevel.wave[this.currentWave.toString()];

        for (const idx in wave) {
            const starting = startingPosition(wave[idx], this.app.screen);

            const newEnemy = new Sprites[
                wave[idx].sprite as keyof typeof Sprites
            ](this.app, starting, starting.x, starting.y);

            // @ts-ignore:next-line
            this.onScreenSprites.push(newEnemy);
        }

        this.app.stage.children.sort((a, b) => a.y - b.y);
    }

    attacking() {
        return (
            this.onScreenSprites.find(
                (enemy) => enemy.isCollisionDetection && enemy.isAttacking
            ) != null
        );
    }

    update(
        delta: number,
        ready: boolean,
        readyToMove: boolean,
        players: Players
    ) {
        if (!ready) {
            return;
        }

        this.onScreenSprites.forEach((enemy) => {
            enemy.update(delta, readyToMove, this.activePlayers, players);
        });
    }
}
