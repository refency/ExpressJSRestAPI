import apiError from "../exceptions/apiError.js";
import tokenService from '../../server/services/tokenService.js'

export default function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) return next(apiError.UnauthorizedError());

        const accessToken = authorizationHeader.split(' ')[1];

        if (!accessToken) return next(apiError.UnauthorizedError());

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData) return next(apiError.UnauthorizedError());

        req.user = userData;
        next();
    } catch (err) {
        return next(apiError.UnauthorizedError());
    }
};
