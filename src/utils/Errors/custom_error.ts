class custom_errors extends Error {
    status = 500

    constructor(message: string, status: number) {
        super(message)

        this.status = status
        this.message = message
    }
}

export default custom_errors
