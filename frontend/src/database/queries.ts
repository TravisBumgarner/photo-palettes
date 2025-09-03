import database from './database'

import { type TemporaryPalette } from './types'

export const createTemporaryPalette = async (
  palette: TemporaryPalette
): Promise<void> => {
  await database.temporaryPalettes.add(palette)
}

export const getTemporaryPalettes = async (): Promise<TemporaryPalette[]> => {
  return await database.temporaryPalettes.toArray()
}

export const getTemporaryPalette = async (
  tempId: string
): Promise<TemporaryPalette | undefined> => {
  return await database.temporaryPalettes.where('tempId').equals(tempId).first()
}

export const deleteTemporaryPalette = async (
  tempId: string
): Promise<number> => {
  return await database.temporaryPalettes
    .where('tempId')
    .equals(tempId)
    .delete()
}
