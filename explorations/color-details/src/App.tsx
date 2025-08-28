import { useState } from "react";
import "./App.css";
import ColorPickers from "./ColorPickers";
import Swatch from "./Swatch";
import Gradient from "./Gradient";
import convert from "color-convert";

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
  return (
    <>
      <ColorPickers colors={colors} setColors={setColors} />
      <div style={{ display: "flex" }}>
        <div>
          <button
            style={{ display: "block", width: "150px" }}
            onClick={() =>
              navigator.clipboard.writeText(
                colors.map((color) => color.toUpperCase()).join(", ")
              )
            }
          >
            Copy Hex
          </button>
          <button
            style={{ display: "block", width: "150px" }}
            onClick={() =>
              navigator.clipboard.writeText(
                colors
                  .map((color) => convert.hex.rgb(color).join(", "))
                  .join(", ")
              )
            }
          >
            Copy RGB
          </button>
          <button
            style={{ display: "block", width: "150px" }}
            onClick={() =>
              navigator.clipboard.writeText(
                colors
                  .map((color) => convert.hex.hsl(color).join(", "))
                  .join(", ")
              )
            }
          >
            Copy HSL
          </button>
        </div>
        {colors.map((color, index) => (
          <Swatch key={index} color={color} />
        ))}
      </div>
      <div>
        {colors.map((color) => (
          <Gradient key={color} color={color} />
        ))}
      </div>
    </>
  );
}

export default App;
