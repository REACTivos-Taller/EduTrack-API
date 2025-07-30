import { Request, Response, Router } from 'express'
import axios from 'axios'
import cron from 'node-cron'

const router = Router()

router.get('', async (req: Request, res: Response) => {
  const verificationToken = req.headers['x-api-key']
  if (verificationToken !== process.env.EDUTRACK_KEY) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  return res.status(200).json({ message: 'Trigger executed.' })
})

cron.schedule('*/14 * * * *', async () => {
  try {
    await axios.get(`${process.env.EDUTRACK_API}/v1/trigger`, {
      headers: { 'x-api-key': process.env.EDUTRACK_KEY },
    })
    console.log(`Server  | Keeping alive.`)
  } catch (error) {
    console.error(`Server  | Error keeping alive: ${error}`)
  }
})

export default router
