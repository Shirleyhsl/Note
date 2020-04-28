/**
 * 商品促销
 */
let PriceStrategy = function () {
    let stragtegy = {
          //100反30
        return30: function (price) {
            return +price + parseInt(price / 100) * 30;
        },
         //100反50
        return50: function (price) {
            return +price + parseInt(price / 100) * 50;
        },
         //打9折
        precent90: function (price) {
            return price * 100 * 90 / 10000;
        },
         //打8折
        precent80: function (price) {
            return price * 100 * 80 / 10000;
        },
        //打5折
        precent50: function (price) {
            return price * 100 * 50 / 10000;
        }
    }
    return function (type, price) {
        return stragtegy[type] && stragtegy[type](price);
    }
}();

let price = PriceStrategy('precent50', 100);
console.log(price);

/**
 * 表单验证
 */
let InputStrategy = function () { 
    let strategy = {
        //是否为空
        notNull : function (value) {
            return /\s+/.test(value)?'请输入内容':'';
        },
        //是否是一个数字
        number: function (value) {
            return /^[0-9]+(\.[0-9]+)?$/.test(value)?'':'请输入数字';
        },
        //是否是本地号码
        phone: function (value) {
            return /^\d{3}\-\d{8}$|^\d{4}\-\d{7}$/.test(value) ? '' : '请输入正确格式的电话号码';
        }
    }
    return {
        'check': function (type, value) {
            value = value.replace(/^\s+|\s+$/g,'');
            strategy[type] ? strategy[type](value):'没有改类型的检测方法'
        },
        'addStrategy': function (type, fn) {
            strategy[type] = fn;
        }
    }
 }();

 