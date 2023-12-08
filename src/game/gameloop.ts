import * as PIXI from 'pixi.js';
import Scripts from './scripts';
import Enemies from './enemies';
import Players, { IActivePlayers } from './players';

export default class GameLoop {
    keys: string[] = [];
    enemies: Enemies;
    players: Players;

    activePlayers: IActivePlayers;

    allowInputs: boolean;

    async init(app: PIXI.Application) {
        this.allowInputs = false;

        this.activePlayers = {
            player1: { key: 'axel', obj: 'Axel' },
        };

        const scripts = new Scripts();

        const loadedScripts = await scripts.load();

        this.enemies = new Enemies(app, loadedScripts, this.activePlayers);
        this.players = new Players(app, loadedScripts, this.activePlayers);
    }

    loop(delta: number, ready: boolean) {
        if (this.players.canAcceptInput && !this.allowInputs) {
            this.allowInputs = true;
        }

        const attacked = this.enemies.attacking();

        this.players.update(
            delta,
            ready,
            this.keys,
            this.allowInputs,
            attacked,
            this.enemies
        );
        this.enemies.update(delta, ready, this.allowInputs, this.players);
    }

    onKeyDown(e: KeyboardEvent) {
        if (!this.keys.includes(e.code)) {
            this.keys.push(e.code);
        }
    }

    onKeyUp(e: KeyboardEvent) {
        if (this.keys.includes(e.code)) {
            this.keys.splice(this.keys.indexOf(e.code), 1);
        }
    }
}
