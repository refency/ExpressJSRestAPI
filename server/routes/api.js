import Router from 'express';
import api from '../controllers/api.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router()

router.post('/signin', api.login, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/signin/new_token', api.refreshToken, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/signup', api.registration, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/blog/upload', authMiddleware, api.blogUpload, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.get('/logout', authMiddleware, api.logout, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.delete('/users', authMiddleware, api.getUsers, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.put('/user/update/:id', authMiddleware, api.userUpdate, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.delete('/user/delete/:id', authMiddleware, api.userDelete, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.put('/blog/update/:id', authMiddleware, api.blogUpdate, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.delete('/blog/delete/:id', authMiddleware, api.blogDelete, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

export default router;
