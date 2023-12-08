import * as PIXI from 'pixi.js';
import Enemies from '../game/enemies';
import { isHit, key } from '../game/helpers';
import { IScriptSprite } from '../game/scripts';

import Character, { CharacterAction } from './character';

export default class Axel extends Character {
    script: IScriptSprite;
    autoMove: boolean;

    constructor(
        app: PIXI.Application,
        script: IScriptSprite,
        x?: number,
        y?: number
    ) {
        super(app);

        this.animation = {
            stand: {
                frames: [1, 2, 3, 2],
            },
            walk: {
                frames: [4, 5, 6, 7, 8, 9],
            },
            attack: {
                frames: [10, 1, 10, 1, 11, 12],
            },
            hit: {
                frames: [13],
            },
        };

        this.init('axel', x ?? 200, y ?? 200);

        this.container.scale.x *= -1;

        this.script = script;
        this.autoMove = true;

        this.speed = 1.3;
    }

    update(
        delta: number,
        keys: string[],
        allowInputs: boolean,
        attacked: boolean,
        enemies: Enemies
    ) {
        if (this.autoMove) {
            if (this.container.x < this.script.xEnd) {
                this.nextAnim('walk');
                this.move({ xOffset: 1 }, delta);
            } else {
                this.nextAnim('stand');
                this.autoMove = false;
                this.canAcceptInput = true;
            }
        }

        // this.isCollisionDetection = isHit(
        //     // @ts-ignore:next-line
        //     player1.container,
        //     this.container
        // );

        if (allowInputs) {
            this.enemiesBeingAttacked = enemies?.onScreenSprites.map(
                (enemy) => {
                    return isHit(enemy.container, this.container) &&
                        this.isAttacking
                        ? enemy
                        : null;
                }
            );

            if (keys.length === 0) {
                if (attacked) {
                    this.action(delta, CharacterAction.Hit);
                } else {
                    this.action(delta, CharacterAction.Default);
                }
            }

            if (key(keys, 'Space')) {
                this.action(delta, CharacterAction.Attack);
            } else {
                if (key(keys, 'ArrowLeft')) {
                    this.action(delta, CharacterAction.Left);
                }
                if (key(keys, 'ArrowRight')) {
                    this.action(delta, CharacterAction.Right);
                }
                if (key(keys, 'ArrowUp')) {
                    this.action(delta, CharacterAction.Up);
                }
                if (key(keys, 'ArrowDown')) {
                    this.action(delta, CharacterAction.Down);
                }
            }
        }
    }
}
