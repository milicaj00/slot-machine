import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SlotMachine from "./components/SlotMachine";
import Slots from "./components/Slots";

const BasePage = () => {
    return (
        <div className="MainPage">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Slots/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};
export default BasePage