import { useState } from "react";
import "./App.css";

function ColorPickers({
  colors,
  setColors,
}: {
  colors: string[];
  setColors: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [textarea, setTextarea] = useState("");

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(e.target.value);
  };

  const handlePasteColors = () => {
    const lines = textarea
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (
      lines.length === 6 &&
      lines.every((line) => /^#?[0-9A-Fa-f]{6}$/.test(line))
    ) {
      setColors(
        lines.map((line) => (line.startsWith("#") ? line : "#" + line))
      );
    } else {
      alert("Please enter 6 valid hex colors, one per line.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {colors.map((color, idx) => (
          <input
            key={idx}
            type="color"
            value={color}
            onChange={(e) => handleColorChange(idx, e.target.value)}
            style={{ width: 40, height: 40, border: "none", cursor: "pointer" }}
          />
        ))}
      </div>
      <textarea
        value={textarea}
        onChange={handleTextareaChange}
        rows={6}
        style={{ width: 160, marginRight: 12, verticalAlign: "top" }}
        placeholder={colors.join("\n")}
      />
      <button onClick={handlePasteColors}>Replace colors (one per line)</button>
    </div>
  );
}

export default ColorPickers;
