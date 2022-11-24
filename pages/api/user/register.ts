/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt"

// Register a new user into the database
// Hash the password using bcrypt lib
export default async (_req: NextApiRequest,
    res: NextApiResponse) => {
    try {
        const user = _req.body
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const exists = await db.collection("users").findOne<User>({ email: user.email })

        if (Boolean(exists)) {
            return res.status(409).json({ result: "User already exists" });
        }

        // Just in case DB is hacked=
        const hashedPassword = bcrypt.hashSync(user.password, 12);
        await db
            .collection("users")
            .insertOne({ ...user, password: hashedPassword })
        return res.status(209).json({ result: "User created" });
    } catch (e) {
        return res.status(500).json({ result: "Something happened" });
    }
};