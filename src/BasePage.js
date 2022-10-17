import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SlotMachine from "./components/SlotMachine";
import Slots from "./components/Slots";
import HocPage from "./components/HocPage";

const BasePage = () => {
    return (
        <div className="MainPage">
            <BrowserRouter>
                <Routes>
                    {/* <Route path="/" exact element={<Slots />} /> */}
                    <Route path="/hoc" element={<HocPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};
export default BasePage;
