import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../lib/mongodb";
const DEFAULT_START_COINS = process.env.START_COINS;

const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
const checkDoubleHit = (hit: Gamehit[], value: Fruit) => {
    if (value === 'cherry') {
        hit.push("two_cherries")
    } else if (value === 'apple') {
        hit.push("two_apples")
    } else if (value === 'banana') {
        hit.push("two_bananas")
    }
}

const checkResult = (reels: Fruit[][]) => {
    let hit: Gamehit[] = [];
    for (var i = 0; i < reels[0].length; i++) {
        const reel0Value = reels[0][i] as Fruit;
        const reel1Value = reels[1][i] as Fruit;
        const reel2Value = reels[2][i] as Fruit;

        if (reel0Value === reel1Value && reel1Value === reel2Value) {
            if (reel0Value === 'cherry') {
                hit.push("three_cherries")
            } else if (reel0Value === 'apple') {
                hit.push("three_apples")
            } else if (reel0Value === 'banana') {
                hit.push("three_bananas")
            }
        } else if (reel0Value === reel1Value) {
            checkDoubleHit(hit, reel0Value)
        } else if (reel0Value === reel2Value) {
            checkDoubleHit(hit, reel0Value)
        } else if (reel1Value === reel0Value) {
            checkDoubleHit(hit, reel1Value)
        } else if (reel1Value === reel2Value) {
            checkDoubleHit(hit, reel1Value)
        } else if (reel2Value === reel1Value) {
            checkDoubleHit(hit, reel2Value)
        } else if (reel2Value === reel2Value) {
            checkDoubleHit(hit, reel2Value)
        }
    }
    return hit
}

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { user, reels } = _req.body;
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);
        /* Check user email in database */
        const userDB = await db.collection("users").findOne<User>({ email: user.email })
        if (!userDB) {
            return res.status(400).json({ status: 'error', error: 'User not found' });
        }

        if (userDB.coins === 0) {
            return res.status(400).json({ error: "Not enought coins" })
        }

        try {
            reels.forEach((reel: string[]) => {
                shuffleArray(reel)
            })
            const hits = checkResult(reels);
            const newCoinsValue = userDB.coins ? userDB.coins - 1 : DEFAULT_START_COINS;
            const newvalues = { $set: { coins: newCoinsValue } };
            await db.collection("users").updateOne({ email: user.email }, newvalues)
            return res.status(200).json({ hits, reels, newCoinsValue })
        } catch (error) {
            console.error(error)
        }

    } catch (error) {
        console.error("BE ERROR: ", error)
        return res.status(500).json({ error: "An error ocurred" })
    }

}