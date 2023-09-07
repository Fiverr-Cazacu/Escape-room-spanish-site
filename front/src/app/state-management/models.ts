export interface Room {
    _id?: string | undefined,
    name: string | undefined,
    description: string | undefined,
    questions: { statement: string, clue: string, answer: string}[]
}

export interface Session {
    _id?: string | undefined,
    roomId?: string | undefined,
    teams?: [],
    duration: number
}