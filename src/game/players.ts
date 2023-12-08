import * as PIXI from 'pixi.js';
import { IScripts } from './scripts';
import * as Sprites from '../sprites';
import { startingPosition } from './helpers';
import Enemies from './enemies';

export interface IActivePlayer {
    key: string;
    obj: string;
}

export interface IActivePlayers {
    player1?: IActivePlayer;
    player2?: IActivePlayer;
}

export default class Players {
    scripts: IScripts;
    activePlayers: IActivePlayers;
    axel: Sprites.Axel;

    canAcceptInput: boolean = false;

    constructor(
        app: PIXI.Application,
        scripts: IScripts,
        activePlayers: IActivePlayers
    ) {
        this.scripts = scripts;
        this.activePlayers = activePlayers;

        const starting = startingPosition(this.scripts.level1.player['1']);

        if (
            activePlayers.player1.key === 'axel' ||
            activePlayers.player2.key === 'axel'
        ) {
            this.axel = new Sprites['Axel'](
                app,
                this.scripts.level1.player['1'],
                starting.x,
                starting.y
            );
        }
    }

    update(
        delta: number,
        ready: boolean,
        keys: string[],
        allowInputs: boolean,
        attacked: boolean,
        enemies: Enemies
    ) {
        if (!ready) {
            return;
        }

        if (this.axel) {
            this.axel.update(delta, keys, allowInputs, attacked, enemies);
        }

        this.canAcceptInput = this.axel.canAcceptInput;
    }
}
