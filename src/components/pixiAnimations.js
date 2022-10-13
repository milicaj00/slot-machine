import { Application } from "pixi.js";
import * as PIXI from "pixi.js";

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x5bba6f
});


let textures = [];
let texture1 = [];
const SYMBOL_SIZE = 100;
let choosen = false;

app.loader
    .add(
        "image1",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
    )
    .add(
        "image2",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
    )
    .add(
        "image3",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/107366/img_landscape.jpg"
    )
    .add(
        "image4",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
    )
    .add(
        "image5",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/107366/img_landscape.jpg"
    )
    .load((loader, resources) => {
        textures = Object.keys(resources);
        // texture1 = [
        //     PIXI.Texture.from(
        //         "https://s3-us-west-2.amazonaws.com/s.cdpn.io/107366/img_landscape.jpg"
        //     ),
        //     PIXI.Texture.from(
        //         "https://s3-us-west-2.amazonaws.com/s.cdpn.io/107366/img_landscape.jpg"
        //     ),
        //     PIXI.Texture.from(
        //         "https://s3-us-west-2.amazonaws.com/s.cdpn.io/107366/img_landscape.jpg"
        //     ),
        //     PIXI.Texture.from(
        //         "https://s3-us-west-2.amazonaws.com/s.cdpn.io/107366/img_landscape.jpg"
        //     ),
        //     PIXI.Texture.from(
        //         "https://s3-us-west-2.amazonaws.com/s.cdpn.io/107366/img_landscape.jpg"
        //     )
        // ];
        draw();
    })
    .onError.add(err => {
        console.log(err);
    });

const columns = [];

const draw = () => {
    const reelContainer = new PIXI.Container();
    app.stage.addChild(reelContainer);

    for (let i = 0; i < 5; i++) {
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

        for (let j = 0; j < 4; j++) {
            const element = new PIXI.Sprite(PIXI.Texture.from(textures[j]));

            element.y = j * SYMBOL_SIZE;

            // element.scale.x = 1
            // element.scale.y = 1

            element.scale.x = element.scale.y = Math.min(
                50 / element.texture.width,
                50 / element.texture.height
            );

            column.addChild(element);
            c.elements.push(element);
        }
    }
};

let running = false;
const tweening = [];

export function start() {
    if (running) return;

    pom = 0;

    console.log("start");

    running = true;

    columns.forEach((column, i) => {
        const extra = Math.floor(Math.random() * 3);
        const target = column.position + 10 + i * 5 + extra;
        const time = 2500 + 600 + 600;

        const tween = {
            object: column,
            property: "position",
            propertyBeginValue: column.position,
            target: target,
            easing: backout(0.5),
            time: time,
            complete: i === columns.length - 1 ? done : null,
            start: Date.now(),
            index: i
        };

        tweening.push(tween);
    });
}

const done = () => {
    running = false;
    console.log(pom / 4);
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
                el.texture = PIXI.Texture.from(textures[i]);

                el.scale.x = el.scale.y = Math.min(
                    50 / el.texture.width,
                    50 / el.texture.height
                );
            }
        });
    });
});

let pom = 0;

app.ticker.add(delta => {
    const now = Date.now()
    //console.log(now)
    const remove = [];

    tweening.forEach((tween, i) => {
        const phase = Math.min(1, (now - tween.start) / tween.time);
        pom++;

        tween.object[tween.property] = lerp(
            tween.propertyBeginValue,
            tween.target,
            tween.easing(phase)
        );

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
