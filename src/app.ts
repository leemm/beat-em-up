import * as PIXI from 'pixi.js';
import { init as initLoader, ILoader } from './game/loader';
import GameLoop from './game/gameloop';

let ready = false;
let gameLoop = new GameLoop();

window.addEventListener('keydown', (e) => gameLoop.onKeyDown(e), false);
window.addEventListener('keyup', (e) => gameLoop.onKeyUp(e), false);

const start = async () => {
    const app = new PIXI.Application({
        width: 800,
        height: 400,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
    });

    document.body.appendChild(app.view);

    const { success, loader }: ILoader = await initLoader(app);
    loader.onComplete.add(async () => {
        if (success) {
            ready = true;

            await gameLoop.init(app);

            app.ticker.maxFPS = 59.99;
            app.ticker.add((delta) => gameLoop.loop(delta, ready));
        }
    });
};

start();
