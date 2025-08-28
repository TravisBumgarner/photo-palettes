import gradient from "./gradientUtil";
import Swatch from "./Swatch";

const Gradient = ({ color }: { color: string }) => {
  return (
    <div style={{ display: "flex" }}>
      {Object.entries(gradient(color)).map(([key, value], index) => (
        <div>
          <Swatch key={index} color={value} />
        </div>
      ))}
    </div>
  );
};

export default Gradient;
