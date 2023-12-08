import * as PIXI from 'pixi.js';
import onChange from 'on-change';

export interface ILoader {
    success: boolean;
    loader: PIXI.Loader;
}

export interface ICurrentText {
    [key: string]: string;
}

function _updateText(
    text: string,
    container: PIXI.Text,
    app: PIXI.Application
) {
    container.text = text;
    container.x = (app.renderer.view.width - container.width) / 2;
    container.y = app.renderer.view.height - container.height - 10;
}

async function init(app: PIXI.Application) {
    const loader = PIXI.Loader.shared;

    let success = true;

    // Store current text
    let currentText: ICurrentText = {};

    let container = new PIXI.Text(currentText['1'], {
        fontFamily: 'Arial',
        fontSize: 24,
        align: 'center',
    });
    app.stage.addChild(container);

    const watchedObject = onChange(currentText, function () {
        _updateText(Object.values(this).join(' '), container, app);
    });

    watchedObject['1'] = 'Loading Assets...';

    // Load sprites
    loader.add('axel', '../resources/sprites/axel.json');
    loader.add('barbon', '../resources/sprites/barbon.json');

    loader.load((loader, resources) => {
        for (const [key, props] of Object.entries(resources)) {
            if (props.error) {
                _updateText(`${key}:${props.error}`, container, app);
                success = false;
            }
        }
    });

    loader.onLoad.add((loader, t) => (watchedObject['2'] = t.name));
    loader.onProgress.add(
        (loader) => (watchedObject['3'] = loader.progress + '%')
    );

    return Promise.resolve({ success, loader });
}

export { init };
