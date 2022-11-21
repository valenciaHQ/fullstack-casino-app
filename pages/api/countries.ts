import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${_req.query.codes}`)
        return res.status(200).json(response.data)
    } catch (error) {
        console.error("BE ERROR: ", error)
        return res.status(500).json({ error: "An error ocurred" })
    }

}