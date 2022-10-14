import React, { useRef, useEffect } from "react";
import app from "./pixiAnimations";
import { start } from "./pixiAnimations";
import axios from 'axios'
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

mock.onGet("/slots").reply(200, {
    slots: [
      ['a','b','c','d','e'],
      ['e','c','a','b','a'],
      ['a','d','b','c','d'],
      ['e','a','d','d','b']
    ],
  });
  
//   axios.get("/slots").then(function (response) {
//     console.log(response.data);
//   });

const Slots = () => {
    const ref = useRef(null);

    useEffect(() => {
        // On first render add app to DOM
        ref.current.appendChild(app.view);
        // Start the PixiJS app


        axios.get('/slots').then(res => {
          console.log(res.data)
        })

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
