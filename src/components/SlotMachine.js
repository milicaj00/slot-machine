import { Stage, Sprite, withFilters, useTick } from "@inlet/react-pixi";
import matchers from "@testing-library/jest-dom/matchers";

import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { useEffect, useState } from "react";

const SlotMachine = () => {
    const loader = new PIXI.Loader();

    const images = [
        "../images/slot1.png",
        "../images/slot1.png",
        "../images/slot1.png",
        "../images/slot1.png"
    ];

    const Filters = withFilters(Container, {
        blur: PIXI.filters.BlurFilter
    });

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [rotation, setRotation] = useState(0);

    let i = 0;
    // custom ticker
    // useTick(delta => {
    //     i += 0.05 * delta;

    //     setX(Math.sin(i) * 100);
    //     setY(Math.sin(i / 1.5) * 100);
    //     setRotation(-10 + Math.sin(i / 10 + Math.PI * 2) * 10);
    // });

    const matrix = Array(5)
        .fill()
        .map(() => Array(5).fill());

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            matrix[i][j] = {
                image: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png",
                x: (1 + i) * 100,
                y: (1 + j) * 100
            };
        }
    }

    matrix.forEach(element => {
        console.log(element);
    });

    return (
        <div id="id">
            <Stage options={{ backgroundColor: 0xeef1f5 }}>
                {matrix.map((el, i) =>
                    el.map((m, j) => (
                        <Sprite
                            key={m.x + m.y}
                            anchor={0.5}
                            x={m.x}
                            y={m.y}
                            image={m.image}
                        />
                    ))
                )}
            </Stage>
        </div>
    );
};

export default SlotMachine;
