import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { setAuth, UserState } from "../reducer/userSlice"
import { useAppDispatch } from "../store"

const Navbar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const user = useSelector((state: { user: UserState }) => state.user.authUser)

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user, router])


    const handleLogoff = () => {
        localStorage.setItem("access_token", "");
        dispatch(setAuth({ user: null }))
        setTimeout(() => {
            router.push('/home')
        }, 500)
    }

    return <nav className="flex justify-center p-8 bg-white">
        <h2 className="">Welcome</h2>
        <p className="ml-2 px-2 bg-teal-200 rounded-lg">{user?.name || "User"}!</p>
        <div className="ml-auto hover:opacity-30 cursor-pointer" onClick={handleLogoff}>Log out</div>
    </nav>
}

export default React.memo(Navbar)