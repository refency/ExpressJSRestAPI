import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import tokenService  from './tokenService';
import userDTO from '../dtos/userDTO';
import apiError from '../exceptions/apiError';

import User from '../../models/user.js';
import Token from '../../models/token.js';

class apiService {
    async login (login, password) {
        const user = await User.findOne({ login: login })
        if (!user) throw apiError.BadRequest('Incorrect login')

        const isPasswordsEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordsEqual) throw apiError.BadRequest(`Passwords don't match`)

        const userDto = new userDTO(user);
        const tokens = await tokenService.generate({...userDto});
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async registration (login, password) {
        let registeredUser = await User.findOne({ login: login })

        if (registeredUser) throw apiError.BadRequest(`User with login: ${registeredUser.login} is already registered!`)

        if (!login.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+|([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/)) {
            throw apiError.BadRequest('Login must be email or phone number!')
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            throw apiError.BadRequest('Password is too weak, it must have: 8 or more symbols and have at least one letter of upper and lower case')
        }

        const user = await User.create({
            login: login,
            password: await bcrypt.hash(password, 3)
        })

        const userDto = new userDTO(user)
        const tokens = await tokenService.generate({...userDto})
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async logout (refreshToken) {
        if (!refreshToken) return 'User is already logout!'

        const token = await tokenService.delete(refreshToken);
        
        return token;
    }

    async refresh (refreshToken) {
        if (!refreshToken) throw apiError.UnauthorizedError();

        const userData = await tokenService.validateRefreshToken(refreshToken);
        const token = await tokenService.find(refreshToken);

        if (!userData || !token) throw apiError.UnauthorizedError();

        const user = await User.findOne({ where: { login: userData.login } })
        const userDto = new userDTO(user);
        const tokens = await tokenService.generate({...userDto});
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async update (req) {
        const { id } = req.params
        if (!id) throw apiError.BadRequest('Id does not specified')

        const { refreshToken } = req.cookies
        const user = await this.info(refreshToken)

        if (user.id != id) throw apiError.BadRequest('You do not have access to this user')

        await User.findOneAndUpdate({
            id: id
        }, {
            login: req.body.login,
            password: await bcrypt.hash(req.body.password, 3)
        })

        return 'User was been updated'
    }

    async delete (req) {
        const { id } = req.params
        if (!id) throw apiError.BadRequest('Id does not specified')

        const { refreshToken } = req.cookies
        const user = await this.info(refreshToken)

        if (user.id != id) throw apiError.BadRequest('You do not have access to this blog')

        await User.findByIdAndRemove(id);

        await Token.findByIdAndRemove({ where: { userId: id } })
        
        return `User by id: ${id} was been deleted`
    }

    async getAll () {
        const users = await User.findAll()

        return users
    }

    async info (refreshToken) {
        const userData = await tokenService.validateRefreshToken(refreshToken);

        const user = await User.findOne({ login: userData.login })

        return user
    }
}

export default new apiService();
