const express = require('express')
const router = express.Router()
const User = require('./models/user')
const md5 = require('blueimp-md5')

// 主页
router.get('/', (req, res) => {
    res.render('index.html', {
        user: req.session.user
    })
})

// 注册
router.get('/register', (req, res) => {
    res.render('register.html')
})

// 提交注册
router.post('/register', async function (req, res) {
    // 在数据库中查找邮箱或昵称是否已存在
    console.log('点击注册')
    let body = req.body
    try {
        if (await User.findOne({
                email: body.email
            })) {
            console.log('邮箱已存在')
            return res.status(200).json({
                err_code: 1,
                message: '邮箱已存在'
            })
        }

        if (await User.findOne({
                nickname: body.nickname
            })) {
            console.log('昵称已存在')
            return res.status(200).json({
                err_code: 2,
                message: '昵称已存在'
            })
        }

        body.password = md5(md5(body.password))

        new User(body).save((err, user) => {
            if (err) {
                res.status(500).json({
                    err_code: 500,
                    message: err.message
                })
            }
            req.session.user = user
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    } catch (err) {
        res.status(500).json({
            err_code: 500,
            message: err.message
        })
    }
})

// 登录
router.get('/login', (req, res) => {
    res.render('login.html')
})

// 提交登录
router.post('/login', function (req, res) {
    let body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'invalid'
            })
        }
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.get('/logout', (req, res) => {
    req.session.user = null
    res.redirect('/')
})


module.exports = router