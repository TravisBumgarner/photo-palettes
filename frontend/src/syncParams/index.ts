import { z } from 'zod'
import syncParamsJson from './sync_params.json'

// Note - Get the json from the shared folder by running `make sync-shared` in the root.

const syncParamsSchema = z.object({
  supportedImageTypes: z.array(z.string()),
})

const syncParams = syncParamsSchema.parse(syncParamsJson.frontend)
export default syncParams
