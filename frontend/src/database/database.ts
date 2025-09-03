import Dexie, { type Table } from 'dexie'

import { type TemporaryPalette } from './types'

class MySubClassedDexie extends Dexie {
  temporaryPalettes!: Table<TemporaryPalette>

  constructor() {
    super('photo-palettes')
    this.version(1).stores({
      temporaryPalettes: 'tempId',
    })
  }
}

const db = new MySubClassedDexie()

export default db
