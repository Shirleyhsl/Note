/**
 * 状态模式：当一个对象内部的状态发生改变时，会导致其行为发生变化，这看起来像是改变的对象
 * zhuang
 */
var MarryState = function () {
    //内部状态私有变量
    let _currentState = {};
    let states = {
        'jump': function () {
            console.log('jump');
        },
        'move': function () {
            console.log('move');
        },
        'shoot': function () {
            console.log('shoot');
        },
        'squat': function () {
            console.log('squrt');
        }
    };
    let Action = {
        //改变状态
        changeState: function () {
            let args = [...arguments];
            _currentState = {};
            args.forEach(type => {
                _currentState[type] = true;
            });
            return this;
        },
        //执行动作
        goes: function () {
            console.log('触发一次动作');
            for (let key in _currentState) {
                states[key] && states[key]();
            }
            return this;
        }
    }
    return {
        change: Action.changeState,
        goes: Action.goes
    }
}
//调用1
MarryState()
    .change('jump', 'shoot')
    .goes()
    .goes()
    .change('shoot')
    .goes()
//调用2
let marry = new MarryState();
marry
    .change('squat')
    .goes()