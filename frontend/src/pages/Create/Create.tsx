"use client";

import { Box, Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { createPalette } from "../../api/palettes/createPalette";
import { generatePalette } from "../../api/palettes/generatePalette";
import { logger } from "../../services/logging";
import useGlobalStore from "../../store";
import { SPACING } from "../../styles/styleConsts";
import { type TGeneratedPalette } from "../../types";
import Loading from "../../sharedComponents/Loading";
import Message from "../../sharedComponents/Message";
import CanvasAndPalette from "./components/CanvasAndPalette";
import Dropzone from "./components/Dropzone";
import { sharedCSS } from "./components/shared";
import PageWrapper from "../../styles/shared/PageWrapper";
import { resizeImage } from "../../utils/resizeImage";
import { useNavigate } from "react-router-dom";

type UploadStatus =
  | "INITIAL"
  | "UPLOADING"
  | "UPLOADED"
  | "ERROR"
  | "SUBMITTING"
  | "SUBMITTED";

const MAX_NAME_LENGTH = 50;

const Create = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("INITIAL");
  const [photo, setPhoto] = useState<Blob | null>(null);
  const navigate = useNavigate();
  const [paletteId, setPaletteId] = useState<string | null>(null);
  const setActiveModal = useGlobalStore((state) => state.setActiveModal);
  const [name, setName] = useState("");
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null);

  const updateSwatch = useCallback((index: number, color: string) => {
    setPalette((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      updated[index].color = color;
      return updated;
    });
  }, []);
  const generatePaletteMutation = useMutation({
    mutationFn: generatePalette,
    onSuccess: () => {
      setUploadStatus("UPLOADED");
    },
    onError: () => {
      logger.error("Error generating palette");
      setUploadStatus("ERROR");
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadStatus("UPLOADING");
      const photo = acceptedFiles[0];
      const resizedPhoto = await resizeImage(photo);
      setPhoto(resizedPhoto);
      const response = await generatePaletteMutation.mutateAsync(resizedPhoto);
      if (response.success) {
        setPalette(response.palette);
        setPaletteId(response.paletteId);
        setUploadStatus("UPLOADED");
      } else {
        setUploadStatus("ERROR");
      }
    },
    [generatePaletteMutation, setPalette, setPaletteId]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value.slice(0, MAX_NAME_LENGTH));
    },
    []
  );

  const handleClearPalette = useCallback(() => {
    setPalette(null);
    setUploadStatus("INITIAL");
    setPhoto(null);
    setName("");
  }, [setPalette]);

  const createPaletteMutation = useMutation({
    mutationFn: createPalette,
    onSuccess: () => {
      setUploadStatus("UPLOADED");
    },
    onError: () => {
      logger.error("Error saving palette");
      setUploadStatus("ERROR");
    },
  });

  const handleSavePalette = useCallback(async () => {
    if (!paletteId || !palette) return;
    setUploadStatus("SUBMITTING");

    const response = await createPaletteMutation.mutateAsync({
      palette,
      paletteId,
      name,
    });

    if (response.success) {
      setActiveModal({
        id: "ConfirmationModal",
        confirmationCallback: () => {
          navigate(`/palette/${paletteId}`);
        },
        title: "Thanks for your submission!",
        body: "Once it is approved, it will be added to the site.",
      });
      setUploadStatus("SUBMITTED");
    } else {
      setUploadStatus("ERROR");
    }
  }, [
    paletteId,
    createPaletteMutation,
    setActiveModal,
    name,
    palette,
    navigate,
  ]);

  const handleTryAgain = useCallback(() => {
    setUploadStatus("INITIAL");
    setPalette(null);
    setPhoto(null);
  }, [setPalette, setPhoto]);

  const nameLabel =
    name.length > 0 ? `Name: ${name.length} / ${MAX_NAME_LENGTH}` : "Name";

  return (
    <PageWrapper width="full">
      {/* <PageTitle marginBottom text="Create" /> */}
      {uploadStatus === "INITIAL" && <Dropzone onDrop={onDrop} />}
      {(uploadStatus === "UPLOADING" || uploadStatus === "SUBMITTED") && (
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
      )}
      {uploadStatus === "ERROR" && (
        <Message
          message="Error generating palette"
          color="error"
          callback={handleTryAgain}
          callbackText="Try again"
        />
      )}
      {(uploadStatus === "UPLOADED" || uploadStatus === "SUBMITTING") && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: SPACING.SMALL.PX,
          }}
        >
          <CanvasAndPalette
            photo={photo}
            palette={palette}
            updateSwatch={updateSwatch}
          />
          <TextField
            variant="outlined"
            fullWidth
            label={nameLabel}
            placeholder="Name your palette"
            value={name}
            onChange={handleNameChange}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={handleClearPalette}>
              Clear Palette
            </Button>
            <Button
              disabled={!name || uploadStatus === "SUBMITTING"}
              variant="contained"
              onClick={handleSavePalette}
            >
              Save Palette
            </Button>
          </Box>
        </Box>
      )}
    </PageWrapper>
  );
};

export default Create;
