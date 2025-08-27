export type Palette = {
  paletteTitle: string;
  colors: Array<{
    name: string;
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    lab: { l: number; a: number; b: number };
    luminance: number;
    luminanceWCAG: number;
    bestContrast: string;
    swatchImg: {
      svgNamed: string;
      svg: string;
    };
    requestedHex: string;
    distance: number;
  }>;
};

export const fetchColor = async (color: string): Promise<Palette> => {
  const response = await fetch(
    `https://api.color.pizza/v1/?values=${color.replace("#", "")}&list=bestOf`
  );
  const data = await response.json();
  return data as Palette;
};
