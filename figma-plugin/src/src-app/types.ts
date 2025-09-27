import { z } from "zod";

export const zodGeneratedPalette = z.object({
  color: z
    .string()
    .length(7)
    .regex(/^#[0-9A-Fa-f]{6}$/),
  percentLocation: z.tuple([z.number(), z.number()]),
});

export type TGeneratedSwatch = z.infer<typeof zodGeneratedPalette>;

export type TGeneratedPalette = TGeneratedSwatch[];

export const zodGeneratePaletteResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    palettes: z.array(z.array(zodGeneratedPalette)),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
]);

export type TGeneratePaletteResponse = z.infer<
  typeof zodGeneratePaletteResponse
>;
