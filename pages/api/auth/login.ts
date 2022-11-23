import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* JWT secret key */
const KEY = process.env.JWT_KEY;

async function Login(_req: NextApiRequest,
    res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);
        const { email, password } = _req.body;
        /* Any how email or password is blank */
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                error: 'Request missing username or password',
            });
        }

        /* Check user email in database */
        const user = await db.collection("users").findOne<User>({ email })
        if (!user) {
            return res.status(400).json({ status: 'error', error: 'User not found' });
        }

        const pwdMatch = await bcrypt.compare(password, user.password);
        /* User matched */
        if (pwdMatch) {
            /* Create JWT Payload */
            const payload = {
                email: user.email,
                password: user.password,
            };
            /* Sign token */
            try {
                const token = jwt.sign(
                    payload,
                    KEY || "",
                    {
                        expiresIn: 31556926, // 1 year in seconds
                    },
                );
                return res.status(200).json({
                    token: 'Bearer ' + token,
                    user
                });
            } catch (error) {
                throw new Error()
            }

        } else {
            /* Send error with message */
            return res
                .status(400)
                .json({ status: 'error', error: 'Password incorrect' });
        }

    } catch (e) {
        console.error(e)
        return res.status(500).json({ result: "Something happened" });
    }
}

export default Login
