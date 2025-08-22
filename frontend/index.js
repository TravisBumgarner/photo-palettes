import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: 'https://09e385e8da03f5dbbdbf102e7ae6b53a@o196886.ingest.us.sentry.io/4509889456766977',

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3000

const frontendDist = path.join(__dirname, 'dist')
app.set('view engine', 'ejs')
app.set('views', frontendDist)

app.use('/public', express.static(path.join(frontendDist, 'public')))

const fetchFromDB = async (id) => {
  const response = await fetch(
    `https://photo-palettes-backend-e167a56444f0.herokuapp.com/palettes/id/${id}`
  )
  const data = await response.json()
  if (data.success) {
    return {
      name: data.palette.name,
      ogPhotoUrl: data.palette.ogPhotoUrl,
    }
  }
  return null
}

app.get(/.*/, async (req, res) => {
  try {
    const parts = req.path.split('/') // For a hit - ["", "palette", UUID]
    let ogTitle = 'Photo Palettes'
    let ogImage = '/static/og.png'

    if (parts[1] === 'palette') {
      const data = await fetchFromDB(parts[2])
      if (data && data.name) {
        ogTitle = data.name
      }

      if (data && data.ogPhotoUrl) {
        ogImage = data.ogPhotoUrl
      }
    }

    res.render('index', { ogTitle, ogImage })
  } catch (error) {
    Sentry.captureException(error)
    res.render('index', {
      ogTitle: 'Photo Palettes',
      ogImage: '/static/og.png',
    })
  }
})

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app)

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500
  res.end(res.sentry + '\n')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
