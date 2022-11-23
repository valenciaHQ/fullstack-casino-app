type Country = {
    name: {
        common
    },
    timezones: string[],
    capital: string[]
}

type User = {
    name: string;
    email: string;
    password: string;
    coins: number | undefined;
}

type ToastType = {
    type: 'error' | 'success' | 'info',
    message: string
}

type ResponseError = {
    response: {
        data: {
            error: string
        }
    }
}

type Gamehit =
    'three_cherries' |
    'two_cherries' |
    'three_apples' |
    'two_apples' |
    'three_bananas' |
    'two_bananas'

type Fruit = 'cherry' | 'lemon' | 'apple' | 'banana'

type GameResult = {
    reels: Fruit[][],
    hits: GameHit[],
    createdAt: number
}