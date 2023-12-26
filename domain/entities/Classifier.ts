export enum STATUS {
    READY = 'ready',
    INPROGRESS = 'inProgress',
    FAILED = 'failed'
}

export class ClassifierDTO {
    id: string
    name: string
    size: number
    format: string
    type: string
    status: string
    path: string
    isPublic: boolean
    owners: string[]
    accuracy?: number
    rating?: number

    constructor({ id, name, size, format, accuracy, type, status, rating, path, isPublic, owners }: ClassifierDTO){
        this.id = id
        this.name = name
        this.size = size
        this.format = format
        this.accuracy = accuracy
        this.type = type
        this.status = status
        this.rating = rating
        this.path = path
        this.isPublic = isPublic
        this.owners = owners
    }
}