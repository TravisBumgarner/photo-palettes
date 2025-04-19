import { z } from 'zod'
import syncParamsJson from './sync_params.json'

const syncParamsSchema = z.object({
  supportedImageTypes: z.array(z.string()),
})

const syncParams = syncParamsSchema.parse(syncParamsJson.frontend)
export default syncParams
