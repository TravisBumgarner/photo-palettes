import { useState } from "react";
import "./App.css";
import ColorPickers from "./ColorPickers";

function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

function App() {
  const [colors, setColors] = useState<string[]>(() =>
    Array.from({ length: 6 }, getRandomColor)
  );
  return <ColorPickers colors={colors} setColors={setColors} />;
}

export default App;
