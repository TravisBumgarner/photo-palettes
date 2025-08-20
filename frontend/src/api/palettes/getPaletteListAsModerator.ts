import { z } from "zod";
import config from "../../config";
import { getToken } from "../../services/supabase/utils";
import { type EModerationStatus, zodPalette } from "../../types";

const zodResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    palettes: z.array(zodPalette),
    total: z.number(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
]);

export const getListAsModerator = async ({
  status,
  size,
  offset,
}: {
  status: EModerationStatus;
  size: number;
  offset: number;
}) => {
  const token = await getToken();

  const response = await fetch(
    `${config.apiUrl}/palettes/moderator?status=${status}&size=${size}&status=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await response.json();
  return zodResponse.parse(json);
};
