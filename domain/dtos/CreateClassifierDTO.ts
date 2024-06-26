export class CreateClassifierDTO {
    id: string
    name: string
    description: string
    type: string
    size: number
    format: string
    status: string
    path: string
    isPublic: boolean
    owners: string[]

    constructor({ id, name, description, type, size, format, status, path, isPublic, owners }: CreateClassifierDTO){
        this.id = id
        this.name = name
        this.description = description
        this.type = type
        this.size = size
        this.format = format
        this.status = status
        this.path = path
        this.isPublic = isPublic
        this.owners = owners
    }
}