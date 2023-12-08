import * as PIXI from 'pixi.js';
import { IScriptSprite } from '../game/scripts';

import { distance } from '@graph-ts/vector2';

import Character, { CharacterAction, IMove } from './character';
import Players, { IActivePlayers } from '../game/players';
import { angleBetweenPoints, random, isHit } from '../game/helpers';
import { Axel } from '.';

export default class Barbon extends Character {
    script: IScriptSprite;
    rnd: number = 1;

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
                frames: [4, 5, 4],
            },
            attack: {
                frames: [6, 7, 8, 7],
            },
            hit: {
                frames: [9],
            },
        };

        this.init('barbon');

        this.container.position.set(x ?? 500, y ?? 200);

        // tmp bgcolor
        // const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
        // txtBG.width = this.container.width;
        // txtBG.height = this.container.height;
        // this.container.addChild(txtBG);

        this.script = script;

        this.speed = 1.5;
        this.newActionCount = 4;

        this.currentDirection = CharacterAction.Left;
    }

    update(
        delta: number,
        readyToMove: boolean,
        activePlayers: IActivePlayers,
        players: Players
    ) {
        if (readyToMove) {
            const player1 = players[activePlayers.player1.key as keyof Players];

            const nextAction = this.readyForNextAction(this.newActionCount);
            if (nextAction) {
                this.rnd = random();
            }

            const playerVector = new PIXI.Point(
                // @ts-ignore:next-line
                player1.container.x,
                // @ts-ignore:next-line
                player1.container.y
            );
            const enemyVector = new PIXI.Point(
                this.container.x,
                this.container.y
            );

            // Switch direction of character if < player.x
            if (
                this.currentDirection === CharacterAction.Left &&
                playerVector.x > enemyVector.x
            ) {
                this.currentDirection = CharacterAction.Right;
                this.container.scale.x *= -1;
            }

            if (
                this.currentDirection === CharacterAction.Right &&
                playerVector.x < enemyVector.x
            ) {
                this.currentDirection = CharacterAction.Left;
                this.container.scale.x *= -1;
            }

            let i: IMove;

            const angle = angleBetweenPoints(playerVector, enemyVector),
                dist = Math.abs(distance(playerVector, enemyVector));

            this.isCollisionDetection = isHit(
                // @ts-ignore:next-line
                player1.container,
                this.container
            );

            const isBeingHit: boolean =
                // @ts-ignore:next-line
                player1.enemiesBeingAttacked.find(
                    (enemy: Character) => this === enemy
                ) != null;

            if (isBeingHit) {
                this.isAttacking = false;
                this.newActionCount = 4;
                this.nextAnim('hit');
                return;
            }

            // randomise movement
            if (this.rnd >= 1 && this.rnd <= 40 && !this.isCollisionDetection) {
                this.isAttacking = false;
                this.newActionCount = 4;
                i = {
                    xOffset:
                        (playerVector.x < enemyVector.x ? -1 : 1) *
                        Math.cos(angle),
                    yOffset:
                        (playerVector.y < enemyVector.y ? -1 : 1) *
                        Math.sin(angle),
                };
            } else if (
                this.rnd >= 1 &&
                this.rnd <= 40 &&
                this.isCollisionDetection
            ) {
                this.isAttacking = false;
                this.newActionCount = 4;
                this.nextAnim('stand');
                return;
            } else if (this.rnd >= 41 && this.rnd <= 70) {
                this.newActionCount = 2;
                this.isAttacking = false;
                i = {
                    xOffset: playerVector.x < enemyVector.x ? 1 : -1,
                };
            } else if (
                this.rnd >= 71 &&
                this.rnd <= 100 &&
                !this.isCollisionDetection
            ) {
                this.isAttacking = false;
                this.newActionCount = 4;
                this.nextAnim('stand');
                return;
            } else if (
                this.rnd >= 71 &&
                this.rnd <= 100 &&
                this.isCollisionDetection
            ) {
                this.isAttacking = true;
                this.newActionCount = 2;
                this.nextAnim('attack');
                return;
            }

            // Move enemy towards player if under threshold (150 pixels)
            // if (dist <= 150 && !this.this.collisionOccurred) {
            //     console.log('under 150');
            //     i = {
            //         xOffset:
            //             (playerVector.x < enemyVector.x ? -1 : 1) *
            //             Math.cos(angle),
            //         yOffset:
            //             (playerVector.y < enemyVector.y ? -1 : 1) *
            //             Math.sin(angle),
            //     };
            // }
            // }

            // Only move sprite if required
            if (i) {
                this.nextAnim('walk');
                this.move(i, delta);
            }
        }
    }
}
