import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import calculateKmeans from "./kmeans";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pixelArray, setPixelArray] = useState<number[][]>([]);
  const [kmeans, setKmeans] = useState<number[][] | null>(null);

  // Helper to read image and extract pixel data
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new window.Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          const pixels: number[][] = [];
          for (let i = 0; i < data.length; i += 4) {
            // [R, G, B] only, ignore alpha
            pixels.push([data[i], data[i + 1], data[i + 2]]);
          }
          setPixelArray(pixels);
        };
        if (typeof event.target?.result === "string") {
          img.src = event.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKmeans = () => {
    console.log("started");
    const result = calculateKmeans(pixelArray, 5);
    setKmeans(result);
    console.log("ended");
  };

  return (
    <div className="App">
      <h1>File Picker Example</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && (
        <div>
          <p>Selected file: {selectedFile.name}</p>
        </div>
      )}
      {pixelArray.length > 0 && (
        <div>
          <h2>Pixel Array (first 10 rows):</h2>
          <pre>
            {pixelArray
              .slice(0, 2)
              .map((i) => i.join(", "))
              .join("\n")}
          </pre>
          <p>Total pixels: {pixelArray.length}</p>
          <button onClick={handleKmeans}>Do Kmeans</button>
        </div>
      )}
      {kmeans && (
        <div>
          <h2>Kmeans Result:</h2>
          {kmeans.map((color) => (
            <Color key={color.join(",")} rgb={color} />
          ))}
        </div>
      )}
    </div>
  );
}

const Color = ({ rgb }: { rgb: number[] }) => {
  const [r, g, b] = rgb;
  return (
    <div
      style={{
        display: "inline-block",
        width: "50px",
        height: "50px",
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
      }}
    />
  );
};

export default App;
