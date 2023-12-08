import * as PIXI from 'pixi.js';
import { prop } from '../game/helpers';
import Barbon from './barbon';

interface IAnimation {
    frames?: number[];
    textures?: PIXI.Texture<PIXI.Resource>[];
}

interface ICharacterAnimation {
    stand?: IAnimation;
    walk?: IAnimation;
    attack?: IAnimation;
    hit?: IAnimation;
    fall?: IAnimation;
}

export enum CharacterAction {
    Default,
    Left,
    Right,
    Down,
    Up,
    Attack,
    Hit,
}

export interface IMove {
    xOffset?: number;
    yOffset?: number;
}

export default class Character {
    start: number = Date.now();
    speed: number = 1;
    newActionCount: number = 3;

    spriteName: string;
    app: PIXI.Application;
    currentDirection: CharacterAction;
    currentAnimation: string;
    sheet: PIXI.Spritesheet;
    container: PIXI.Container;
    sprite: PIXI.AnimatedSprite;
    animation: ICharacterAnimation = {
        stand: {},
        walk: {},
        attack: {},
    };

    isCollisionDetection: boolean = false;
    isAttacking: boolean = false;
    enemiesBeingAttacked: Barbon[] = [];

    isNowInView: boolean = false;

    nextActionTimer: number;

    canAcceptInput: boolean = false;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.currentDirection = CharacterAction.Right;
        this.currentAnimation = 'stand';
    }

    init(sprite: string, x?: number, y?: number) {
        this.spriteName = sprite;

        this.sheet = PIXI.Loader.shared.resources[sprite].spritesheet;

        this.container = new PIXI.Container();

        // cache standing textures
        this.animation.stand.textures = this._animationFromSpritesheet(
            this.sheet.textures,
            sprite,
            this.animation.stand.frames
        );

        // create an animated sprite
        this.sprite = new PIXI.AnimatedSprite(this.animation.stand.textures);

        this.sprite.animationSpeed = 0.1;
        this.sprite.position.x = 0 - this.sprite.width / 2;
        this.sprite.anchor.y = 0.5;
        this.sprite.play();

        if (x || y) {
            this.container.position.set(x, y);
        }

        this.container.addChild(this.sprite);
        this.app.stage.addChild(this.container);
    }

    action(delta: number, action: CharacterAction) {
        switch (action) {
            case CharacterAction.Left:
                if (this.currentDirection === CharacterAction.Right) {
                    this.currentDirection = CharacterAction.Left;
                    this.container.scale.x *= -1;
                }
                this.nextAnim('walk');
                this.isAttacking = false;
                this.move({ xOffset: this.speed * -1 }, delta);
                break;
            case CharacterAction.Right:
                if (this.currentDirection === CharacterAction.Left) {
                    this.currentDirection = CharacterAction.Right;
                    this.container.scale.x *= -1;
                }
                this.nextAnim('walk');
                this.isAttacking = false;
                this.move({ xOffset: this.speed }, delta);
                break;
            case CharacterAction.Up:
                this.nextAnim('walk');
                this.isAttacking = false;
                this.move({ yOffset: this.speed * -1 }, delta);
                break;
            case CharacterAction.Down:
                this.nextAnim('walk');
                this.isAttacking = false;
                this.move({ yOffset: this.speed }, delta);
                break;
            case CharacterAction.Attack:
                this.nextAnim('attack');
                this.isAttacking = true;
                break;
            case CharacterAction.Default:
                this.nextAnim('stand');
                this.isAttacking = false;
                break;
            case CharacterAction.Hit:
                this.isAttacking = false;
                this.nextAnim('hit');
                break;
        }
    }

    nextAnim(anim: string) {
        if (this.currentAnimation !== anim) {
            const thisAnim = this._switchAnimation(
                this.sheet,
                this.animation,
                anim,
                this.spriteName
            );
            this.sprite.textures = thisAnim.textures;
            this.sprite.play();
            this.currentAnimation = anim;
        }
    }

    move(move: IMove, delta?: number) {
        if (move.xOffset) {
            this.container.x += this.speed * move.xOffset * (delta || 0);
        }
        if (move.yOffset) {
            this.container.y += this.speed * move.yOffset * (delta || 0);
        }
    }

    readyForNextAction(newActionCount: number) {
        let current = Date.now(),
            elapsed = (current - this.start) / 1000;

        if (elapsed > newActionCount) {
            this.start = Date.now();
            return true;
        }

        return false;
    }

    _switchAnimation(
        sheet: PIXI.Spritesheet,
        animation: any,
        anim: string,
        sprite: string
    ) {
        // load textures if they're missing for animation type
        const thisAnim = prop(animation, anim) as IAnimation;
        if (!thisAnim.textures) {
            thisAnim.textures = this._animationFromSpritesheet(
                sheet.textures,
                sprite,
                thisAnim.frames
            );
        }

        return thisAnim;
    }

    _animationFromSpritesheet(
        textures: PIXI.utils.Dict<PIXI.Texture<PIXI.Resource>>,
        prefix: string,
        indexes: number[]
    ): PIXI.Texture<PIXI.Resource>[] {
        return indexes.map(
            (index) =>
                textures[`${prefix}${String(index).padStart(2, '0')}.png`]
        );
    }
}
