let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog')

const db = mongoose.connection

db.on('connected', function (err) {
    if (err) {
        console.log('连接数据库失败：' + err);
    } else {
        console.log('连接数据库成功！');
    }
})

let Schema = mongoose.Schema
var userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    nickname: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    creat_time: {
        type: Date,
        // 不要写Date.now(), 否则在new Schema的时候自动就会被执行
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '../public/img/avatar-max-img.png'
    },
    intro: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        enum: [0, 1, -1],
        default: -1
    },
    birthday: {
        type: Date
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)