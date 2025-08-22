import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3000

const frontendDist = path.join(__dirname, 'dist')
const indexHtml = fs.readFileSync(
  path.join(frontendDist, 'index.html'),
  'utf-8'
)

app.use(express.static(frontendDist))

const DATABASE = {
  one: { title: 'Foo One' },
  two: { title: 'Foo Two' },
}

const mockFetchFromDB = (key) => {
  return (
    DATABASE[key] || {
      title: 'Default Title',
    }
  )
}

const fetchFromDB = async (id) => {
  console.log('fetching', id)
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
  const parts = req.path.split('/') // ["", "palette", UUID]

  if (parts[1] !== 'palette') {
    res.send(indexHtml)
    return
  }

  const data = await fetchFromDB(parts[2])

  if (data === null) {
    res.send(indexHtml)
    return
  }

  let ogInjectedHTML = indexHtml
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${data.name}" />`
    )
    .replace(
      /<title>.*<\/title>/,
      `<title>Photo Palette - ${data.name}</title>`
    )
  res.send(ogInjectedHTML)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
