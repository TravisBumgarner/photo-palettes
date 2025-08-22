import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3000

const frontendDist = path.join(__dirname, 'dist')
app.set('view engine', 'ejs')
app.set('views', frontendDist)

app.use('/public', express.static(path.join(frontendDist, 'public')))

const fetchFromDB = async (id) => {
  const response = await fetch(`http://localhost:8000/palettes/id/${id}`)
  const data = await response.json()
  if (data.success) {
    return {
      name: data.palette.name,
    }
  }
  return null
}

app.get(/.*/, async (req, res) => {
  try {
    const parts = req.path.split('/') // For a hit - ["", "palette", UUID]
    let ogTitle = 'Photo Palettes'
    let pageTitle = 'Photo Palettes'

    if (parts[1] === 'palette') {
      const data = await fetchFromDB(parts[2])
      if (data && data.name) {
        ogTitle = data.name
        pageTitle = `Photo Palette - ${data.name}`
      }
    }

    res.render('index', { ogTitle, pageTitle })
  } catch {
    res.render('index', {
      ogTitle: 'Photo Palettes',
      pageTitle: 'Photo Palettes',
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
