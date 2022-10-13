import React, { useRef, useEffect } from "react";
import app from "./pixiAnimations";
import { start } from "./pixiAnimations";

const Slots = () => {
    const ref = useRef(null);

    useEffect(() => {
        // On first render add app to DOM
        ref.current.appendChild(app.view);
        // Start the PixiJS app
        app.start();

        return () => {
            // On unload stop the application
            app.stop();
            ref?.current?.removeChild(app.view)
        };
    }, []);

    return (
        <div ref={ref}>
            <button onClick={() => start()}>start</button>
        </div>
    );
};

export default Slots;
