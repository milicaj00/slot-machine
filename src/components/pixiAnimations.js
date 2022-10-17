import { Application } from "pixi.js";
import * as PIXI from "pixi.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

mock.onGet("/slots").reply(200, {
    slots: [
        ["b", "b", "c", "d", "e"],
        ["e", "f", "a", "b", "a"],
        ["a", "d", "b", "f", "d"],
        ["e", "f", "d", "d", "b"]
    ]
});
mock.onGet("/end").reply(200, {
    slots: [
        ["b", "c", "f", "a", "b"],
        ["b", "c", "f", "c", "c"],
        ["a", "a", "a", "a", "a"],
        ["b", "c", "f", "d", "d"]
    ]
});

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x5bba6f
});

// app.ticker.speed = 10;

const SYMBOL_SIZE = 100;
let choosen = false;
let startMatrix = null;
let endMatrix = null;

axios.get("/slots").then(function (response) {
    console.log(response.data);
    startMatrix = response.data.slots;
});
axios.get("/end").then(function (response) {
    console.log(response.data);
    endMatrix = response.data.slots;
});

app.loader
    .add(
        "a",
        "https://image.shutterstock.com/image-vector/paper-cut-letter-a-realistic-600w-1150993907.jpg"
    )
    .add(
        "b",
        "https://image.shutterstock.com/image-illustration/bright-neon-font-fluorescent-pink-600w-1053291407.jpg"
    )
    .add(
        "c",
        "https://image.shutterstock.com/image-vector/letter-c-logo-icon-design-600w-207054256.jpg"
    )
    .add(
        "d",
        "https://image.shutterstock.com/image-illustration/glossy-pink-paint-letter-d-600w-582499531.jpg"
    )
    .add(
        "e",
        "https://image.shutterstock.com/image-illustration/bright-neon-font-fluorescent-pink-600w-1053291392.jpg"
    )
    .add(
        "f",
        "https://image.shutterstock.com/image-vector/logo-f-letter-company-vector-600w-253353298.jpg"
    )

    .load((loader, resources) => {
        draw();
    })
    .onError.add(err => {
        console.log(err);
    });

const columns = [];

const draw = () => {
    const reelContainer = new PIXI.Container();
    app.stage.addChild(reelContainer);

    for (let i = 0; i < startMatrix[0]?.length; i++) {
        const column = new PIXI.Container();

        column.x = i * 150 + 100;
        column.y = 200;

        reelContainer.addChild(column);

        const blur = new PIXI.filters.BlurFilter();
        blur.blurX = 0;
        blur.blurY = 0;

        const c = {
            const: column,
            elements: [],
            position: 0,
            previousPosition: 0,
            blur: blur
        };
        column.filters = [c.blur];

        columns.push(c);

        for (let j = 0; j < startMatrix.length; j++) {
            const element = new PIXI.Sprite(
                PIXI.Texture.from(startMatrix[j][i])
            );

            element.y = j * SYMBOL_SIZE;

            // element.scale.x = 1
            // element.scale.y = 1

            element.scale.x = element.scale.y = Math.min(
                50 / element.texture.width,
                50 / element.texture.height
            );

            column.addChild(element);
            //console.log(PIXI.Texture.from(textures[j]));
            c.elements.push(element);
            //  console.log(c.elements);
        }
    }
};

let running = false;
const tweening = [];

export function start() {
    if (running) return;

    choosen = false;
    console.log("start");
    running = true;

    columns.forEach((column, i) => {
        // const extra = Math.floor(Math.random() * 3);

        const target = column.position + 10 + 10; //+ i * 5 // + extra;
        const time = 2500 + i * 600 + 600;

        const tween = {
            object: column,
            property: "position",
            propertyBeginValue: column.position,
            target: target,
            easing: backout(0.5),
            time: time,
            complete: i === columns.length - 1 ? done : null,
            start: Date.now(),
            index: i,
            end: Date.now() + 3000
        };

        tweening.push(tween);
    });
    // console.log(tweening);
}

const done = () => {
    running = false;
};

app.ticker.add(delta => {
    columns.forEach((column, j) => {
        column.blur.blurY = (column.position - column.previousPosition) * 8;
        column.previousPosition = column.position;

        column.elements.forEach((el, i) => {
            const prevy = el.y;

            el.y =
                ((column.position + i) % column.elements.length) * SYMBOL_SIZE -
                SYMBOL_SIZE;

            if (el.y < 0 && prevy > SYMBOL_SIZE && !choosen) {
                el.texture = PIXI.Texture.from(
                    // textures[Math.floor(Math.random() * textures.length)]
                    startMatrix[Math.floor(Math.random() * 4)][
                        Math.floor(Math.random() * 5)
                    ]
                );

                el.scale.x = el.scale.y = Math.min(
                    50 / el.texture.width,
                    50 / el.texture.height
                );
            }

            if (el.y < 0 && prevy > SYMBOL_SIZE && choosen) {
                // el.texture = PIXI.Texture.from(textures[i]);
                //el.texture = texture1[i];

                el.texture = PIXI.Texture.from(endMatrix[i][j]);

                el.scale.x = el.scale.y = Math.min(
                    50 / el.texture.width,
                    50 / el.texture.height
                );
            }
        });
    });
});

app.ticker.add(delta => {
    const now = Date.now();
    //console.log(now)
    const remove = [];

    tweening.forEach((tween, i) => {
        const phase = Math.min(1, (now - tween.start) / tween.time);

        tween.object[tween.property] = lerp(
            tween.propertyBeginValue,
            tween.target,
            tween.easing(phase)
        );

        if (phase > 0.28) {
            choosen = true;
        }

        if (phase === 1) {
            //kad se zavrsi
            tween.object[tween.property] = tween.target; // da ga smesti gde je i bio
            if (tween.complete) tween.complete(tween);
            remove.push(tween);

            console.log("stop " + tween.index);
        }
    });

    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount) {
    return t => --t * t * ((amount + 1) * t + amount) + 1;
}

export default app;
