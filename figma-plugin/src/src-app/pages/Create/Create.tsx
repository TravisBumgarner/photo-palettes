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

import {
  FONT_SIZES,
  SPACING,
  subtleBackground,
} from "../../styles/styleConsts";
import type { TGeneratePaletteResponse } from "../../types";
import { type TGeneratedPalette } from "../../types";
import { resizeImage } from "../../utils/images";
import CanvasAndPalette from "./components/CanvasAndPalette";
import Dropzone from "./components/Dropzone";
import SelectGeneratedPalette from "./components/SelectGeneratedPalette";
import { sharedCSS } from "./components/shared";
import PageWrapper from "../../sharedComponents/PageWrapper";
import kmeans from "../../utils/kmeans";

type CreationStatus =
  | "INITIAL"
  | "UPLOADING"
  | "SELECTING_COLORS"
  | "SUBMITTING"
  | "SUBMITTED"
  | "ERROR";

const MAX_NAME_LENGTH = 50;

const Create = ({ mode }: { mode: "lite" | "full" }) => {
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus>("INITIAL");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const useSingleColumnDisplay = true;

  const [name, setName] = useState("");
  const [generatedPalettes, setGeneratedPalettes] = useState<
    TGeneratedPalette[]
  >([]);
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0);

  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>(
    Array.from({ length: PALETTE_SIZE }, (_, i) => i)
  );
  const [tempId, setTempId] = useState<string | null>(null);

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

  const resetSortOrder = useCallback(() => {
    setPaletteSortOrder(Array.from({ length: PALETTE_SIZE }, (_, i) => i));
  }, [setPaletteSortOrder]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        // An error was thrown, it's handled internally by Dropzone.tsx
        return;
      }

      setCreationStatus("UPLOADING");
      const photo = acceptedFiles[0];

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

        setGeneratedPalettes(response.palettes);
        setPalette(structuredClone(response.palettes[0]));
      } else {
        setCreationStatus("ERROR");
      }
    },
    [setGeneratedPalettes, setCreationStatus, mode]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value.slice(0, MAX_NAME_LENGTH));
    },
    []
  );

  const handleClearPalette = useCallback(() => {
    setPalette(null);
    setCreationStatus("INITIAL");
    setPhoto(null);
    setName("");
    setSelectedPaletteIndex(0);
  }, [setPalette, tempId]);

  const handleSaveLite = useCallback(() => {
    if (!palette) return;
    setCreationStatus("SUBMITTED");

    const sortedPalette = paletteSortOrder.map((index) => palette[index]);
  }, [name, palette, paletteSortOrder, photo]);

  const handleSavePalette = useCallback(async () => {
    handleSaveLite();
  }, [handleSaveLite, mode]);

  const handlePaletteChange = (paletteIndex: number) => {
    setPalette(structuredClone(generatedPalettes[paletteIndex]));
    setSelectedPaletteIndex(paletteIndex);
    resetSortOrder();
  };

  const handleTryAgain = useCallback(() => {
    setCreationStatus("INITIAL");
    setPalette(null);
    setErrorMessage(null);
    setPhoto(null);
    setName("");
  }, [setPalette, setPhoto]);

  const nameLabel =
    name.length > 0 ? `Name: ${name.length} / ${MAX_NAME_LENGTH}` : "Name";

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
      <Container useSingleColumnDisplay={useSingleColumnDisplay}>
        {/* 
          When mode === 'lite' && useSingleColumnDisplay ? null
          LeftColumn becomes empty. No GeneratedPalettes are shown
          and the TextField is moved to the right column.
          Therefore, hide it.
        */}
        {mode === "lite" && useSingleColumnDisplay ? null : (
          <LeftColumn useSingleColumnDisplay={useSingleColumnDisplay}>
            {mode === "full" && (
              <SectionWrapper>
                <Typography sx={labelStyles}>Starter Palettes</Typography>
                <SelectGeneratedPalette
                  handlePaletteChange={handlePaletteChange}
                  generatedPalettes={generatedPalettes}
                />
              </SectionWrapper>
            )}
            {!useSingleColumnDisplay && (
              <>
                <SectionWrapper>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    label={nameLabel}
                    placeholder="Name your palette"
                    value={name}
                    onChange={handleNameChange}
                  />
                </SectionWrapper>

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
                      disabled={!name}
                      variant="contained"
                      sx={{ flexGrow: 1 }}
                      onClick={handleSavePalette}
                    >
                      Save
                    </Button>
                  </Box>
                </SectionWrapper>
              </>
            )}
          </LeftColumn>
        )}
        <RightColumn>
          <CanvasAndPalette
            photo={photo}
            palette={palette}
            selectedPaletteIndex={selectedPaletteIndex}
            updateSwatch={updateSwatch}
            paletteSortOrder={paletteSortOrder}
            setPaletteSortOrder={setPaletteSortOrder}
          />
          {useSingleColumnDisplay && (
            <>
              <SectionWrapper>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  label={nameLabel}
                  placeholder="Name your palette"
                  value={name}
                  onChange={handleNameChange}
                />
              </SectionWrapper>

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
                    disabled={!name}
                    variant="contained"
                    sx={{ flexGrow: 1 }}
                    onClick={handleSavePalette}
                  >
                    Save
                  </Button>
                </Box>
              </SectionWrapper>
            </>
          )}
        </RightColumn>
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

const LeftColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== "useSingleColumnDisplay",
})<{ useSingleColumnDisplay: boolean }>(
  ({ theme, useSingleColumnDisplay }) => ({
    ...(useSingleColumnDisplay ? {} : { flexBasis: "200px" }),
    width: "100%",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: SPACING.MEDIUM.PX,
    padding: SPACING.MEDIUM.PX,
    backgroundColor: subtleBackground(theme.palette.mode, "slightly"),
  })
);
const RightColumn = styled(Box)(() => ({
  flexGrow: 1,
  gap: SPACING.MEDIUM.PX,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
}));

const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== "useSingleColumnDisplay",
})<{ useSingleColumnDisplay: boolean }>(({ useSingleColumnDisplay }) => ({
  display: "flex",
  flexDirection: useSingleColumnDisplay ? "column" : "row",
  gap: SPACING.MEDIUM.PX,
  alignItems: "flex-start",
}));

export default Create;
