import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { logger } from "../../../services/logging";
import Message from "../../../sharedComponents/Message";
import { SPACING } from "../../../styles/styleConsts";
import { sharedCSS } from "./shared";

const SUPPORTED_FORMATS = {
  "image/png": [],
  "image/jpeg": [],
  "image/jpg": [],
  "image/webp": [],
  "image/gif": [],
  "image/bmp": [],
  "image/avif": [],
  // Known currently not supported
  // 'image/x-adobe-dng': [],
  // 'image/tiff': [],
  // 'image/heic': [],
  // 'image/heif': [],
  // 'image/jxl': [],
};

const SUPPORTED_FORMATS_FLAT = Object.keys(SUPPORTED_FORMATS)
  .join(", ")
  .replaceAll("image/", "");

const Dropzone = ({ onDrop }: { onDrop: (acceptedFiles: File[]) => void }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    // maxSize: 1024 * 1024 * 5, // The image is converted on a canvas to another type. Separately, we already check on the backend for large files.
    accept: SUPPORTED_FORMATS,
    onDropRejected: (fileRejections) => {
      // There are multiple errors thrown if too many files are uploaded.
      // It looks goofy so we'll just display the first error and let the user try again.
      logger.info(
        "User performed a weird action trying to drop a file: " +
          JSON.stringify(fileRejections)
      );
      setErrorMessage(fileRejections[0].errors[0].message);
    },
  });

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: SPACING.MEDIUM.PX }}
    >
      {errorMessage && (
        <Message includeVerticalMargin message={errorMessage} color="error" />
      )}
      <Box
        sx={{
          ...sharedCSS,
          border: `2px dashed`,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          flexDirection: "column",
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop photo here...</Typography>
        ) : (
          <Typography>Drag and drop photo or click to select photo</Typography>
        )}
        <Typography variant="body2">
          (Supported: {SUPPORTED_FORMATS_FLAT})
        </Typography>
      </Box>
    </Box>
  );
};

export default Dropzone;
