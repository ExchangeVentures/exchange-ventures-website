import express from 'express'
import strategy from './api/strategy.js'

const app = express()
app.use(express.json())
app.post('/api/strategy', strategy)

const PORT = process.env.PORT || 3001
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Strategy API listening on 127.0.0.1:${PORT}`)
})
