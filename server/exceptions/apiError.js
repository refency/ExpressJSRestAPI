export default class apiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError () {
        return new apiError(401, `User doesn't authorized`);
    }

    static BadRequest (message, errors = []) {
        return new apiError(400, message, errors); 
    }
}
