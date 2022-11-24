import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

// This look for countries matching by codes separated by comma
// As is it in https://restcountries.com/#api-endpoints-v3-list-of-codes
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