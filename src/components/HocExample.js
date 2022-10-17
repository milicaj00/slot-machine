import React, { useState } from "react";

const HocExample = Component => {
    const Test = () => {
        const [counter, setCounter] = useState(0);

        const increment = () => {
            setCounter(c => c + 1);
        };

        const decrement = () => {
            setCounter(c => c - 1);
        };

        return (
            <div>
                <h1>counter is: {counter}</h1>
                <Component increment={increment} decrement={decrement} />;
            </div>
        );
    };

    return Test;
};

export default HocExample;
