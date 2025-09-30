import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled, type SxProps } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { PALETTE_SIZE } from "../../consts";
import { logger } from "../../services/logging";
import Loading from "../../sharedComponents/Loading";
import Message from "../../sharedComponents/Message";

import { FONT_SIZES, SPACING } from "../../styles/styleConsts";
import type { TGeneratePaletteResponse } from "../../types";
import { type TGeneratedPalette } from "../../types";
import { resizeImage } from "../../utils/images";
import CanvasAndPalette from "./components/CanvasAndPalette";
import Dropzone from "./components/Dropzone";
import { sharedCSS } from "./components/shared";
import PageWrapper from "../../sharedComponents/PageWrapper";
import kmeans from "../../utils/kmeans";

async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

type CreationStatus =
  | "INITIAL"
  | "UPLOADING"
  | "SELECTING_COLORS"
  | "SUBMITTING"
  | "SUBMITTED"
  | "ERROR";

const Create = ({ mode }: { mode: "lite" | "full" }) => {
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<Blob | null>(null);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus>("INITIAL");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [palette, setPalette] = useState<TGeneratedPalette | null>(null);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0);

  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>(
    Array.from({ length: PALETTE_SIZE }, (_, i) => i)
  );

  const updateSwatch = useCallback(
    (index: number, color: string, percentLocation: [number, number]) => {
      setPalette((prev) => {
        if (!prev) return prev;
        const updated = [...prev];
        updated[index].color = color;
        updated[index].percentLocation = percentLocation;
        return updated;
      });
    },
    []
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        // An error was thrown, it's handled internally by Dropzone.tsx
        return;
      }

      setCreationStatus("UPLOADING");
      const photo = acceptedFiles[0];
      setOriginalPhoto(photo);
      let resizedPhoto: Blob;
      try {
        resizedPhoto = await resizeImage(photo, {
          maxWidth: 1600,
          maxHeight: 1600,
        });
      } catch (e) {
        logger.error("Error resizing image", e);
        setErrorMessage(
          "There was an error loading your image. Please try a different image."
        );
        setCreationStatus("ERROR");
        return;
      }

      setPhoto(resizedPhoto);

      let response: TGeneratePaletteResponse;

      response = await kmeans(resizedPhoto);

      if (response.success) {
        setCreationStatus("SELECTING_COLORS");

        setPalette(structuredClone(response.palettes[0]));
      } else {
        setCreationStatus("ERROR");
      }
    },
    [setCreationStatus, mode]
  );

  const handleClearPalette = useCallback(() => {
    setPalette(null);
    setCreationStatus("INITIAL");
    setPhoto(null);
    setSelectedPaletteIndex(0);
  }, [setPalette]);

  const handleAddToCanvas = useCallback(async () => {
    if (!palette) return;
    setCreationStatus("SUBMITTED");

    const sortedPalette = paletteSortOrder.map((index) => palette[index]);
    parent.postMessage(
      {
        pluginMessage: {
          type: "handle-add-to-canvas",
          colors: sortedPalette.map(({ color }) => color),
          title: "FOobar",
          imageBytes: originalPhoto
            ? await blobToUint8Array(originalPhoto)
            : null,
        },
      },
      "*"
    );
  }, [palette, paletteSortOrder, photo]);

  const handleTryAgain = useCallback(() => {
    setCreationStatus("INITIAL");
    setPalette(null);
    setErrorMessage(null);
    setPhoto(null);
  }, [setPalette, setPhoto]);

  if (creationStatus === "INITIAL") {
    return (
      <PageWrapper width="full">
        <Dropzone onDrop={onDrop} />
      </PageWrapper>
    );
  }

  if (creationStatus === "ERROR") {
    return (
      <PageWrapper width="full">
        <Message
          message={errorMessage || "An error occurred. Please try again."}
          color="error"
          callback={handleTryAgain}
          callbackText="Try again"
        />
      </PageWrapper>
    );
  }

  if (
    creationStatus === "UPLOADING" ||
    creationStatus === "SUBMITTING" ||
    creationStatus === "SUBMITTED"
  ) {
    return (
      <PageWrapper width="full">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            ...sharedCSS,
          }}
        >
          <Loading />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper width="full">
      <Container>
        {/* 
          When mode === 'lite' && useSingleColumnDisplay ? null
          LeftColumn becomes empty. No GeneratedPalettes are shown
          and the TextField is moved to the right column.
          Therefore, hide it.
        */}
        <Box sx={{ margin: "0 auto" }}>
          <CanvasAndPalette
            photo={photo}
            palette={palette}
            selectedPaletteIndex={selectedPaletteIndex}
            updateSwatch={updateSwatch}
            paletteSortOrder={paletteSortOrder}
            setPaletteSortOrder={setPaletteSortOrder}
          />
        </Box>
        <SectionWrapper>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              justifyContent: "space-between",
            }}
          >
            <Button variant="text" onClick={handleClearPalette}>
              Clear
            </Button>
            <Button
              variant="contained"
              sx={{ flexGrow: 1 }}
              onClick={handleAddToCanvas}
            >
              Add to canvas
            </Button>
          </Box>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

const SectionWrapper = styled(Box)(() => ({
  display: "flex",
  gap: SPACING.TINY.PX,
  flexDirection: "column",
  width: "100%",
}));

const labelStyles: SxProps = {
  fontSize: FONT_SIZES.SMALL.PX,
};

const Container = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: SPACING.MEDIUM.PX,
  alignItems: "flex-start",
}));

export default Create;
