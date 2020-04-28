let Square = function () {
    // 方块数据 4*4
    this.data = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // 原点 大方块的左上角坐标
    this.origin = {
        x: 0,
        y: 0
    }

    // 方向
    this.dir = 0
}

Square.prototype.canDown = function (isValid) {
    let pos = {}
    pos.x = this.origin.x + 1
    pos.y = this.origin.y
    return isValid(pos, this.data)
}
Square.prototype.canLeft = function (isValid) {
    let pos = {}
    pos.x = this.origin.x
    pos.y = this.origin.y - 1
    return isValid(pos, this.data)
}
Square.prototype.canRight = function (isValid) {
    let pos = {}
    pos.x = this.origin.x
    pos.y = this.origin.y + 1
    return isValid(pos, this.data)
}
Square.prototype.canRotate = function (isValid) {
    let d = (this.dir + 1) % 4
    let test = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[0].length; j++) {
            test[i][j] = this.rotates[d][i][j]
        }
    }
    return isValid(this.origin, test)
}

Square.prototype.down = function () {
    this.origin.x += 1
}
Square.prototype.left = function () {
    this.origin.y -= 1
}
Square.prototype.right = function () {
    this.origin.y += 1
}

Square.prototype.rotate = function (num) {
    if(!num) num = 1
    this.dir = (this.dir + num) % 4
    for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[0].length; j++) {
            this.data[i][j] = this.rotates[this.dir][i][j]
        }
    }

}

