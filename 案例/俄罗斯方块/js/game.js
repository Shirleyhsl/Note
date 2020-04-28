let Game = function () {

    let nextData = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    let gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    let nextDivs = []
    let gameDivs = []
    let nextDiv, gameDiv, scoreDiv, timeDiv, finalResultDiv
    let cur // 当前大方块 (4*4)
    let next // 下一个大方块 (4*4)
    let score = 0

    /**
     * 初始化div, 将container元素进行切割成一个个小方块，每个小方块元素保存在divs中，数据保存在data中
     * @param {*} container 页面上的div元素
     * @param {*} data 数据矩阵
     * @param {*} divs 保存小方块的矩阵
     */
    let initDiv = function (container, data, divs) {
        for (let i = 0, rows = data.length; i < rows; i++) {
            let div = []
            for (let j = 0, cols = data[i].length; j < cols; j++) {
                let newNode = document.createElement('div');
                newNode.className = 'none';
                newNode.style.top = (i * 20) + 'px'
                newNode.style.left = (j * 20) + 'px'
                container.appendChild(newNode);
                div.push(newNode)
            }
            divs.push(div)
        }
    }

    /**
     * 刷新container
     * @param {*} divs 保存小方块元素的矩阵
     * @param {*} data 保存小方块数据的矩阵
     */
    let refreshDiv = function (divs, data) {
        for (let i = 0, rows = data.length; i < rows; i++) {
            for (let j = 0, cols = data[i].length; j < cols; j++) {
                if (data[i][j] === 0) {
                    divs[i][j].className = 'none'
                }
                if (data[i][j] === 1) {
                    divs[i][j].className = 'done'
                }
                if (data[i][j] === 2) {
                    divs[i][j].className = 'current'
                }
            }
        }
    }

    /**
     * 清除gameData中cur所占合法区域的数据
     */
    let clearData = function () {
        for (let i = 0, rows = cur.data.length; i < rows; i++) {
            for (let j = 0, cols = cur.data[i].length; j < cols; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0
                }
            }

        }
    }

    /**
     * 设置gameData中正在下落的大方块合法区域的数据
     */
    let setData = function () {
        for (let i = 0, rows = cur.data.length; i < rows; i++) {
            for (let j = 0, cols = cur.data[i].length; j < cols; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j]
                }
            }

        }
    }

    /**
     * 检测小方块是否合法
     * @param {*} pos 大方块原点位置
     * @param {*} x 小方块的x坐标值
     * @param {*} y 小方块的y坐标值
     */
    let check = function (pos, x, y) {
        if (pos.x + x < 0) return false
        if (pos.x + x >= gameData.length) return false
        if (pos.y + y >= gameData[0].length) return false
        if (pos.y + y < 0) return false
        // 此处原来有小方块
        if (gameData[pos.x + x][pos.y + y] === 1) return false
        return true
    }

    /**
     * 检测某一区域是否合法
     * @param {*} pos 原点（该区域左上角点）
     * @param {*} data 该区域的数组
     */
    let isValid = function (pos, data) {
        for (let i = 0, rows = data.length; i < rows; i++) {
            for (let j = 0, cols = data[0].length; j < cols; j++) {
                if (data[i][j] != 0) {
                    if (!check(pos, i, j)) {
                        return false
                    }
                }
            }
        }
        return true
    }

    /**
     * 大方块下落
     * 先检测是否可以继续下落
     */
    let down = function () {
        if (cur.canDown(isValid)) {
            clearData()
            cur.down()
            setData()
            refreshDiv(gameDivs, gameData)
            return true
        } else {
            return false
        }
    }

    /**
     * 大方块左移
     * 先检测是否可以继续左移
     */
    let left = function () {
        if (cur.canLeft(isValid)) {
            clearData()
            cur.left()
            setData()
            refreshDiv(gameDivs, gameData)
        }
    }


    /**
     * 大方块右移
     * 先检测是否可以继续右移
     */
    let right = function () {
        if (cur.canRight(isValid)) {
            clearData()
            cur.right()
            setData()
            refreshDiv(gameDivs, gameData)
        }
    }

    /**
     * 大方块旋转
     * 先检测是否可以继续旋转
     */
    let rotate = function () {
        if (cur.canRotate(isValid)) {
            clearData()
            cur.rotate()
            setData()
            refreshDiv(gameDivs, gameData)
        }
    }

    /**
     * 方块移动到底部时，固定方块
     * @param {*} doms 
     */
    let fixed = function () {
        for (let i = 0; i < cur.data.length; i++) {
            for (let j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    if (gameData[cur.origin.x + i][cur.origin.y + j] === 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1
                    }
                }

            }
        }
        refreshDiv(gameDivs, gameData)
    }

    /**
     * 进入下一个大方块以及更新下一个大方块
     * @param {*} type 
     * @param {*} dir 
     */
    let performNext = function (type, dir) {
        cur = next
        setData()
        next = SquareFactory.prototype.make(type, dir)
        refreshDiv(gameDivs, gameData)
        refreshDiv(nextDivs, next.data)
    }

    /**
     * 消行
     */
    let checkClear = function () {
        let lines = 0
        for (let i = gameData.length - 1; i >= 0; i--) {
            let clear = true
            for (let j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] !== 1) {
                    clear = false
                    break
                }
            }

            if (clear) {
                lines++
                for (let m = i; m > 0; m--) {
                    for (let n = 0; n < gameData[0].length; n++) {
                        gameData[m][n] = gameData[m - 1][n]

                    }
                }
                for (let n = 0; n < gameData[0].length; n++) {
                    gameData[0][n] = 0
                }
                i++
            }
        }
        return lines
    }

    /**
     *检查游戏结束
     */
    let checkGameOver = function () {
        for (let i = 0; i < gameData[0].length; i++) {
            if (gameData[1][i] == 1) {
                return true
            }
        }
        return false
    }

    /**
     * 时间
     * @param {时间} time 
     */
    let setTime = function (time) {
        timeDiv.innerHTML = time
    }

    /**
     * 得分
     * @param {消除的行数} lines 
     */
    let setScore = function (lines) {
        switch (lines) {
            case 1:
                score += 10
                break;
            case 2:
                score += 25
                break;
            case 3:
                score += 45
                break;
            case 4:
                score += 60
                break;
            default:
                break;
        }

        scoreDiv.innerHTML = score
    }

    /**
     * 游戏结束
     */
    let gameOver = function () {
        console.log('结束')
        if (score >= 100) {
            finalResultDiv.innerHTML = `得分${score}，恭喜你，挑战成功`
        } else {
            finalResultDiv.innerHTML = `得分${score}，再接再厉哦！`
        }
        finalResultDiv.style.display = 'block'
    }

    /**
     * 增加游戏感干扰
     * @param {新增的行的数组} lines 
     */
    addTailLines = function (lines) {
        for (let i = 0; i < gameData.length - lines.length; i++) {
            gameData[i] = gameData[i + lines.length]
        }
        for (let i = 0; i < lines.length; i++) {
            gameData[gameData.length - lines.length + i] = lines[i]
        }
        cur.origin.x = cur.origin.x - lines.length
        if (cur.origin.x < 0) {
            cur.origin.x = 0
        }
        refreshDiv(gameDivs, gameData)
    }


    let init = function (doms, type, dir) {
        gameDiv = doms.gameDiv
        nextDiv = doms.nextDiv
        timeDiv = doms.timeDiv
        scoreDiv = doms.scoreDiv
        finalResultDiv = doms.finalResultDiv

        next = SquareFactory.prototype.make(type, dir)
        initDiv(gameDiv, gameData, gameDivs)
        initDiv(nextDiv, next.data, nextDivs)
        refreshDiv(nextDivs, next.data)
    }
    // 导出API
    this.init = init
    this.down = down
    this.left = left
    this.right = right
    this.rotate = rotate
    this.fall = function () {
        while (down()) {

        }
    }
    this.fixed = fixed
    this.performNext = performNext
    this.checkClear = checkClear
    this.checkGameOver = checkGameOver
    this.setTime = setTime
    this.setScore = setScore
    this.gameOver = gameOver
    this.addTailLines = addTailLines
}