import apiError from '../exceptions/apiError';
import ApiService from './userService.js'

import Blog from '../../models/blog.js'

class BlogService {
    async save (token, text, file) {
        if (file) file = file.message_media

        const user = await ApiService.info(token)

        const blog = await Blog.create({
            messageText: text,
            messageMedia: file.data,
            userId: user.id
        })

        return blog
    }

    async update (req) {
        const { id } = req.params
        if (!id) throw apiError.BadRequest('Id does not specified')

        const { refreshToken } = req.cookies
        const user = await ApiService.info(refreshToken)

        const blog = await Blog.findById(id)

        if (user.id != blog.userId) throw apiError.BadRequest('You do not have access to this blog')

        if (req.files.message_media) req.files = req.files.message_media

        await Blog.findOneAndUpdate({
            id: blog.id
        }, {
            messageText: req.body.message_text,
            messageMedia: req.files.data,
            userId: user.id
        })

        return 'Blog was been updated'
    }

    async delete (req) {
        const { id } = req.params
        if (!id) throw apiError.BadRequest('Id does not specified')

        const blog = await Blog.findById(id)
        if (!blog) throw apiError.BadRequest(`File by id: ${id} does not exist`)

        const { refreshToken } = req.cookies
        const user = await ApiService.info(refreshToken)
        if (user.id != blog.userId) throw apiError.BadRequest('You do not have access to this blog')

        await Blog.findByIdAndRemove(id);

        return `Blog by id: ${id} was been deleted`
    }
}

export default new BlogService();
