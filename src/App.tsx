import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Join from "./pages/Join";
import Chat from "./pages/Chat";
import MatrixRain from "./components/MatrixRain";
import BootScreen from "./components/BootScreen";

export default function App() {
  const [bootDone, setBootDone] = useState(false);

  return (
    <>
      {!bootDone && <BootScreen onDone={() => setBootDone(true)} />}

      {bootDone && (
        <>
          <MatrixRain />

          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Join />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}