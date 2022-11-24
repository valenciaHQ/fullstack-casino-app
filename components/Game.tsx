import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCoins, UserState } from "../reducer/userSlice";
import { GameState, setGameResult } from "../reducer/gameSlice";
import { useAppDispatch } from "../store";
import api from "../utils/api";
import Loading from "./Loading";
import { getToast } from "../utils";

const Game = () => {
    const dispatch = useAppDispatch()
    const user = useSelector((state: { user: UserState }) => state.user.authUser)
    const { reels, lastResult } = useSelector((state: { game: GameState }) => state.game)
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState<ToastType | null>(null)

    useEffect(() => {
        if (notification) {
            getToast(notification.type, notification.message)
        }
    }, [notification])

    //Spin action
    const spin = async () => {
        setLoading(true)
        try {
            const response = await api.post("/api/game/spin", { reels, user });
            dispatch(setGameResult({ reels: response.data.reels, hits: response.data.hits, createdAt: new Date().getTime() }))
            dispatch(setCoins(response.data.coins))
        } catch (error) {
            setNotification({ type: 'error', message: "An error ocurred doing spin" })
        } finally {
            setLoading(false)
        }
    }
    return loading ? <Loading /> : <div className="flex justify-center items-center my-10">
        {reels.map((reel, ri) =>
            <div key={ri} className="flex x flex-col">
                {reel.map((item, i) => {
                    return <div key={i} className={`flex px-4 border-2 border-black`}>{item}</div>
                })}
            </div>
        )}
        <div className="ml-4">
            <p>{`${user?.coins} coins remains`}</p>
            <p>{`Last game: ${lastResult}`}</p>
            <button className="rounded-lg text-lg hover:opacity-80 underline" onClick={spin}>Try your luck!</button>
        </div>

    </div>
}

export default Game;