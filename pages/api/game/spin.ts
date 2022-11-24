import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../lib/mongodb";
const DEFAULT_START_COINS = process.env.START_COINS;

//Mix values by reel. It change values positions randomly
const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
//Check what kind of double hit is
const checkDoubleHit = (hit: Gamehit[], value: Fruit) => {
    if (value === 'cherry') {
        hit.push("two_cherries")
    } else if (value === 'apple') {
        hit.push("two_apples")
    } else if (value === 'banana') {
        hit.push("two_bananas")
    }
}

// Analize reel mix and fill hits array with matches.
const checkResult = (reels: Fruit[][]) => {
    let hits: Gamehit[] = [];
    for (var i = 0; i < reels[0].length; i++) {
        const reel0Value = reels[0][i] as Fruit;
        const reel1Value = reels[1][i] as Fruit;
        const reel2Value = reels[2][i] as Fruit;

        if (reel0Value === reel1Value && reel1Value === reel2Value) {
            if (reel0Value === 'cherry') {
                hits.push("three_cherries")
            } else if (reel0Value === 'apple') {
                hits.push("three_apples")
            } else if (reel0Value === 'banana') {
                hits.push("three_bananas")
            }
        } else if (reel0Value === reel1Value) {
            checkDoubleHit(hits, reel0Value)
        } else if (reel0Value === reel2Value) {
            checkDoubleHit(hits, reel0Value)
        } else if (reel1Value === reel0Value) {
            checkDoubleHit(hits, reel1Value)
        } else if (reel1Value === reel2Value) {
            checkDoubleHit(hits, reel1Value)
        } else if (reel2Value === reel1Value) {
            checkDoubleHit(hits, reel2Value)
        } else if (reel2Value === reel2Value) {
            checkDoubleHit(hits, reel2Value)
        }
    }
    return hits
}

// This Process a spin action
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

        //User has enought coins to play?
        if (userDB.coins === 0) {
            return res.status(400).json({ error: "Not enought coins" })
        }

        try {
            reels.forEach((reel: string[]) => {
                shuffleArray(reel)
            })
            const hits = checkResult(reels);
            //Substract 1 from existing user coins
            const newCoinsValue = userDB.coins ? userDB.coins - 1 : DEFAULT_START_COINS;
            const newvalues = { $set: { coins: newCoinsValue } };
            await db.collection("users").updateOne({ email: user.email }, newvalues)

            //If success returns hits, reels and new coins value.
            return res.status(200).json({ hits, reels, coins: newCoinsValue })
        } catch (error) {
            console.error(error)
        }

    } catch (error) {
        console.error("BE ERROR: ", error)
        return res.status(500).json({ error: "An error ocurred" })
    }

}