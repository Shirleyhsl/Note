/**
 * @param {*} options 
 * 构造函数入口
 * 主要调用函数执行数据劫持监听，模板编译，和双向数据绑定
 */
function myVue(options = {}) {
    this.$options = options;
    var data = this._data = this.$options.data;
    observe(data);
    //将data直接绑定在实例上，而不是_data上
    for (let key in data) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get() {
                return this._data[key]
            },
            set(newVal) {
                this._data[key] = newVal;
            }
        })
    }
    compile(options.el,this)
}

//vm.$options
function observe(data) {
    if (typeof data !== 'object') return;
    return new Observe(data);
}
/**
 * @param {*} data 
 * 功能：数据监视
 * 要点
 * ① 如果data是对象，用Object.defineProperty劫持data中的每一个key，监听key的get和set方法。
 * ② 如果是set的话，还要递归劫持新的值的属性
 */
//观察对象给对象增加objectDefineProperty
function Observe(data) {
    //这里写主要逻辑
    let dep = new Dep();
    for (key in data) {
        let val = data[key];
        observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return val;
            },
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                //newVal可能是对象，同样需要检测
                observe(newVal);
                // dep.notify();
            }
        })
    }
}

/**
 * 模板编译
 * @param {*} el 元素
 * @param {*} vm 实例
 * 功能：将页面上的{{}}内的数据替换成实例data中挂载的对应数据
 * 要点：
 * ① 获取页面的挂载元素el
 * ② 创建一个碎片节点，将el的孩子都放入碎片节点中
 * ③ 对碎片节点的每一个后代节点进行递归遍历，用正则表达式的分组去搜索{{}}内的数据，然后在el中遍历出改数据的值，并赋值对对应的改节点上。
 * ④ 将碎片插入到el中
 */
function compile(el, vm) {
    vm.$el = document.querySelector(el);
    let fragment = document.createDocumentFragment();
    while (child = vm.$el.firstChild) {
        //将app的内容移到内存中
        fragment.appendChild(child);
    }
    replace(fragment)
    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(function (node) {
            let text = node.textContent;
            let reg = /\{\{([\w|.]*)\}\}/g;
            if (node.nodeType === 3 && reg.test(text)) {
                let arr = RegExp.$1.split('.');
                let val = vm;
                arr.forEach(function (k) {
                    val = val[k];
                })
                new Watcher(vm, RegExp.$1, function (newVal) { //函数接收新值
                    node.textContent = text.replace(reg, newVal);
                })
                node.textContent = text.replace(reg, val);
            }
            if (node.childNodes) {
                replace(node)
            }
        })
    }

    vm.$el.appendChild(fragment);
}


//发布订阅模式 订阅-->发布
function Dep() {
    this.subs = [];
}
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
}
Dep.prototype.notify = function (sub) {
    this.subs.forEach(sub => sub.update());
}

function Watcher(vm, exp, fn) {
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    Dep.target = this;
    let val = vm;
    let arr = exp.split('.');
    arr.forEach(function (k) {
        val = val[k];
    });
    Dep.target = null;
}
Watcher.prototype.update = function () {
    let val = this.vm;
    let arr = this.exp.split('.');
    arr.forEach(function (k) {
        val = val[k];
    });
    this.fn(val);
}
