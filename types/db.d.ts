type User = {
    id: string,
    name: string,
    image?: string,
    email: string
}

type Session = {
    user: User
}