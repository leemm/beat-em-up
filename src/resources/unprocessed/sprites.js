const cli = require('simple-cli-parser');
const path = require('path');
const fs = require('fs');
const defaults = require('./spritesheet.json');

const saveRoot = path.join(__dirname, '../sprites');

const generate = async (sprite) => {
    if (fs.existsSync(path.join(saveRoot, sprite + '.json'))) {
        fs.unlinkSync(path.join(saveRoot, sprite + '.json'));
    }

    if (fs.existsSync(path.join(saveRoot, sprite + '.png'))) {
        fs.unlinkSync(path.join(saveRoot, sprite + '.png'));
    }

    const files = fs
        .readdirSync(path.join(__dirname, '/' + sprite))
        .filter((file) => path.parse(file).ext.toLowerCase() === '.png');

    // Get width/height of individual sprite
    const sourceDimensions = await new cli([
        'identify',
        '-ping',
        '-format',
        "'%w %h'",
        path.join(__dirname, '/' + sprite + '/', files[0]),
    ]);

    const sourceWidth = parseInt(
            sourceDimensions.split(' ')[0].replace("'", ''),
            10
        ),
        sourceHeight = parseInt(
            sourceDimensions.split(' ')[1].replace("'", ''),
            10
        );

    // Generate spritesheet
    try {
        await new cli([
            'montage',
            path.join(__dirname, '/', sprite, '/', sprite + '*.png'),
            '-tile',
            `${files.length}x1`,
            '-geometry',
            `${sourceWidth}x${sourceHeight}+0+0`,
            '-background',
            'transparent',
            path.join(saveRoot, '/', sprite + '.png'),
        ]);
    } catch (err) {
        console.error(err);
        return false;
    }

    // Get width/height of generated spritesheet
    const spritesheetDimensions = await new cli([
        'identify',
        '-ping',
        '-format',
        "'%w %h'",
        path.join(saveRoot, '/', sprite + '.png'),
    ]);

    const spritesheetWidth = parseInt(
            spritesheetDimensions.split(' ')[0].replace("'", ''),
            10
        ),
        spritesheetHeight = parseInt(
            spritesheetDimensions.split(' ')[1].replace("'", ''),
            10
        );

    // Generate pixi.js spritesheet json
    const frames = {};
    files.forEach((file, idx) => {
        frames[file] = {
            frame: {
                x: idx * sourceWidth,
                y: 0,
                w: sourceWidth,
                h: sourceHeight,
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: idx * sourceWidth,
                y: 0,
                w: sourceWidth,
                h: sourceHeight,
            },
            sourceSize: { w: sourceWidth, h: sourceHeight },
        };
    });

    const axelSpritesheet = Object.assign({}, defaults, {
        meta: Object.assign({}, defaults.meta, {
            image: sprite + '.png',
            size: { w: spritesheetWidth, h: spritesheetHeight },
        }),
        frames,
    });

    fs.writeFileSync(
        path.join(saveRoot, sprite + '.json'),
        JSON.stringify(axelSpritesheet, null, 4)
    );
};

const start = async () => {
    await generate('axel');
    await generate('barbon');

    console.log("Done! Don't forget to npm run grunt");
};

start();
