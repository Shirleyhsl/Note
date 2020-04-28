let Local = function () {
    // 游戏对象
    let game = new Game()
    let INTERVAL = 200
    let timer = null
    let timeCount = 0
    let time = 0
    let bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 38) { // to up
                game.rotate()
            } else if (e.keyCode == 39) { // to right
                game.right()
            } else if (e.keyCode == 37) { // to left 
                game.left()
            } else if (e.keyCode == 40) { // to down
                game.down()
            } else if (e.keyCode == 32) { // to fall
                game.fall()
            }
        }
    }

    let start = function () {
        let doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            finalResultDiv: document.getElementById('local_finalResult')
        }
        game.init(doms, generateType(), generateDir())
        bindKeyEvent()
        game.performNext(generateType(), generateDir())
        timer = setInterval(() => {
            timeCount++
            if (timeCount === 5) {
                timeCount = 0
                time++
                game.setTime(time)
                if (time % 10 === 0) {
                    game.addTailLines(generateBottomLine(1))
                }
            }
            if (!game.down()) {
                // 方块停下后固定
                game.fixed()
                // 凑成一行后，消行
                let lines = game.checkClear()
                if (lines) {
                    game.setScore(lines)
                }
                if (game.checkGameOver()) {
                    stop()
                } else {
                    game.performNext(generateType(), generateDir())
                }
            }
        }, INTERVAL);

    }
    // 随机生成一个方块种类
    let generateType = function () {
        return Math.ceil(Math.random() * 7) - 1
    }

    // 随机生成一个旋转的次数
    let generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1
    }

    // 随机生成干扰行
    let generateBottomLine = function (lineNum) {
        let lines = []
        for (let i = 0; i < lineNum; i++) {
            let line = []
            for (let j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1)

            }
            lines.push(line)
        }
        return lines
    }
    // 游戏结束
    let stop = function () {
        if (timer) {
            clearInterval(timer)
            timer = null
            document.onkeydown = null
        }
        game.gameOver()

        console.log('游戏结束');
    }


    this.start = start
}