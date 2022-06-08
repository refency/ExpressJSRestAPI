import userService from '../services/userService.js'
import blogService from '../services/blogService.js';

class apiController {
    async login(req, res, next) {
        try {
            const { login, password } = req.body;

            const userData = await userService.login(login, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async registration(req, res, next) {
        try {
            const { login, password } = req.body;

            const userData = await userService.registration(login, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            const token = await userService.logout(refreshToken);

            res.clearCookie('refreshToken');

            return res.json(token)
        } catch (err) {
            next(err)
        }
    }

    async refreshToken(req, res, next) {
        try {
            await this.updateToken(req);

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async blogUpload(req, res, next) {
        try {
            await this.updateToken(req);

            const file = await blogService.save(refreshToken, req.body.message_text, req.files)

            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async blogDelete (req, res, next) {
        try {
            await this.updateToken(req);

            const file = await blogService.delete(req)

            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async blogUpdate (req, res, next) {
        try {
            await this.updateToken(req);

            const file = await blogService.update(req);

            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async getUsers(req, res, next) {
        try {
            await this.updateToken(req);

            const users = await userService.getAll();

            return res.json(users)
        } catch (err) {
            next(err)
        }
    }

    async userUpdate (req, res, next) {
        try {
            await this.updateToken(req);

            const user = await userService.update(req);

            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    async userDelete (req, res, next) {
        try {
            await this.updateToken(req);

            const user = await userService.delete(req)

            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async updateToken (req) {
        const { refreshToken } = req.cookies;

        const userData = await userService.refresh(refreshToken)

        res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })
    }
}

export default new apiController();
