import { AnimatePresence, motion } from "framer-motion";

const spinnerStyle = {
  width: 75,
  height: 75,
  border: `10px solid`,
  borderColor: "divider",
  animation: "spin 2s linear infinite",
};

// CSS animation runs on the compositor thread, less likely to be blocked
const cssAnimation = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Loading = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssAnimation }} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexGrow: 1,
        }}
      >
        <div style={spinnerStyle} />
      </div>
    </>
  );
};

export default Loading;
