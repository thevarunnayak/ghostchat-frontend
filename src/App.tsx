import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Join from "./pages/Join";
import Chat from "./pages/Chat";
import MatrixRain from "./components/MatrixRain";
import BootScreen from "./components/BootScreen";
import { applyTheme, getTheme } from "./lib/theme";

export default function App() {
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    const theme = getTheme();
    applyTheme(theme);
  }, []);
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