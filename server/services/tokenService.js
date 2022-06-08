import jwt from 'jsonwebtoken';

import Token from '../../models/token.js'

class TokenService {
    async generate (payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '1d' })

        return { accessToken, refreshToken }
    }

    async save (userId, refreshToken) {
        const tokenData = await Token.findOne({ userId })

        if (tokenData) {
            return tokenData.updateOne({ refreshToken })
        }

        const token = await Token.create({ 
            userId: userId,
            refreshToken: refreshToken
        })

        return token
    }

    async delete (refreshToken) {
        const tokenData = await Token.updateOne(
            { refreshToken: refreshToken },
            { refreshToken: '' }
        )

        return tokenData
    }

    validateAccessToken (token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

            return userData
        } catch (err) {
            return null
        }
    }

    async validateRefreshToken (token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_SECRET_KEY);

            return userData
        } catch (err) {
            return null
        }
    }

    async find (refreshToken) {
        const tokenData = await Token.findOne({ refreshToken: refreshToken })

        return tokenData
    }
}

export default new TokenService();
