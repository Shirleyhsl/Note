const express = require('express')
const path = require('path')
const router = require('./router.js')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()

// 开放静态资源
app.use('/public', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 配置express-art-template
app.engine('html', require('express-art-template'))

// 配置body-parse parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

app.use(session({
    // 配置加密字符串，它会在原有加密的基础上和这个字符串拼接起来加密, 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'keyboard cat', 
    resave: false,
    // 无论是否使用Session，都会默认直接给你分配一把钥匙
    saveUninitialized: false
}))

app.use(router)

app.listen(3000, ()=>{
    console.log('running...')
})