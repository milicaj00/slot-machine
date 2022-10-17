import React from "react";
import HocExample from "./HocExample";

const Counter1 = ({ increment, decrement }) => {
    return (
        <div>
            <button onClick={() => increment()}>Count + 1</button>
            <button onClick={() => decrement()}>Count - 1</button>
        </div>
    );
};

export default HocExample(Counter1);
