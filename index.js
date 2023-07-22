import express from 'express';
import cors from 'cors';

const app = express()
const port = 3000

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    data: [],
  })
})

app.get('/relay', (req, res) => {
  console.log('Request Params =>', req.query)
  const name = req.query.name || 'Unknown'
  res.json({
    status: 'success',
    params: req.query,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})