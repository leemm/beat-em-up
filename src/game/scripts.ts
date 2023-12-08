export interface IScriptSprite {
    sprite?: string;
    x: number;
    y: number;
    xEnd?: number;
    yEnd?: number;
}

export interface IScripts {
    level1: IScript;
}

export interface IScript {
    player: {
        [key: string]: IScriptSprite;
    };
    wave: {
        [key: string]: {
            [key: string]: IScriptSprite;
        };
    };
}

export default class Scripts {
    async load(): Promise<IScripts> {
        const level1 = await this._request(1);
        return { level1 };
    }

    async _request(level: number): Promise<IScript> {
        return fetch(`http://localhost:3000/scripts/level${level}.json`).then(
            (response) => response.json() as unknown as IScript
        );
    }
}
