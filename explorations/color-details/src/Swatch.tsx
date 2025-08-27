import convert from "color-convert";
import { getContrastColor } from "./utils";
import { fetchColor, type Palette } from "./api";
import { useEffect, useState } from "react";

const Swatch = ({ color }: { color: string }) => {
  const [colorDeets, setColorDeets] = useState<Palette | null>(null);

  useEffect(() => {
    fetchColor(color).then((r) => setColorDeets(r));
  }, [color]);
  console.log(colorDeets);
  return (
    <ul
      style={{
        backgroundColor: color,
        width: 200,
        border: "1px solid #000",
        listStyle: "none",
        padding: 10,
        color: getContrastColor(color),
      }}
    >
      <li>{colorDeets?.paletteTitle}</li>
      <li>Hex: {color.toUpperCase()}</li>
      <li>RGB: {convert.hex.rgb(color).join(", ")}</li>
      <li>HSL: {convert.hex.hsl(color).join(", ")}</li>
    </ul>
  );
};

export default Swatch;
