import axios from "axios"
import { toast } from "react-toastify"

export const getToast = (type: 'error' | 'success' | 'info',
    message: string) => {
    switch (type) {
        case 'error':
            return toast.error(message)
        case 'info':
            return toast.info(message)
        case 'success':
            return toast.success(message)
        default: return toast.info(message)
    }
}

export const rules: { [key in Gamehit]: number } = {
    'three_cherries': 50,
    'two_cherries': 40,
    'three_apples': 20,
    'two_apples': 10,
    'three_bananas': 15,
    'two_bananas': 50,
}