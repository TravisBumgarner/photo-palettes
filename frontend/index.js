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

// Serve static assets first
app.use('/assets', express.static(path.join(frontendDist, 'assets')))
app.use('/static', express.static(frontendDist)) // serve everything in dist, including og.png and favicon.png

const IS_PRODUCTION = false // switch this manually. I don't want index.js to have a fancy setup.

const base_url = IS_PRODUCTION
  ? 'https://photo-palettes-backend-e167a56444f0.herokuapp.com'
  : 'http://localhost:8000'

const fetchFromDB = async (id) => {
  const response = await fetch(`${base_url}/palettes/id/${id}`)
  const data = await response.json()

  if (data.success) {
    return {
      name: data.palette.name,
      photoUrl: data.palette.ogPhotoUrl,
      colors: data.palette.colors.map((color) => color.hex),
    }
  }
  return null
}

const BASE_TITLE = 'Photo Palettes'
const BASE_DESCRIPTION = 'Find color inspiration in the everyday.'
const BASE_IMAGE = 'https://photopalettes.com/static/og2.png' // I have no idea what the fuck is caching og.png but it's serving as an index.html file.
const BASE_URL = 'https://photopalettes.com'

// Match only non file routes.
app.get(/^\/(?!.*\.[a-zA-Z0-9]+$).*/, async (req, res) => {
  try {
    const parts = req.path.split('/') // For a hit - ["", "palette", UUID]
    let ogTitle = BASE_TITLE
    let ogImage = BASE_IMAGE
    let ogDescription = BASE_DESCRIPTION
    let ogUrl = BASE_URL

    if (parts[1] === 'palette') {
      const data = await fetchFromDB(parts[2])

      if (data && data.name) {
        ogTitle = `${BASE_TITLE} - ${data.name}`
      }

      if (data && data.photoUrl) {
        ogImage = data.photoUrl
      }

      if (data && data.colors) {
        ogDescription = `${data.colors.join(' ')}\n${ogDescription}`
      }

      ogUrl = `${BASE_URL}/palette/${parts[2]}`
    }

    console.log('setting ogurk', ogUrl)
    res.render('index', { ogTitle, ogImage, ogDescription, ogUrl })
  } catch (error) {
    Sentry.captureException(error)
    res.render('index', {
      ogTitle: BASE_TITLE,
      ogImage: BASE_IMAGE,
      ogDescription: BASE_DESCRIPTION,
      ogUrl: BASE_URL,
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
