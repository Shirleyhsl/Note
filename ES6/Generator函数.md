## 1. 简介

### 1.1 基本概念

对于 Generator 函数有多种理解角度 。 

1. 语法上: 首先可以把它理解成一个状态机，封装了多个内部状态。执行 Generator 函数会返回 一个遍历器对象。 也就是说， Generator 函数除了是状态机，还是一个遍历器对象生成函数 。 返回的遍历器对象可以依次遍历 Generator 函数内部的每一个状态。
2. 形式上: 是一个普通函数，但有两个特定
   + function命名与函数名之间有一个星号，星号与function和函数名之间可以有空格也可以紧挨着。
   + 函数体内部使用yield语句定义不同的内部状态；

对于Generator函数的调用：

1. Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行， 返回的也不是函数运行结果 ， 而是一个指向内部状态的指针对象， 也就是遍历器对象 （Iterator Object）。
2. 下一步 ， 必须调用遍历器对象的 next 方法 ， 使得指针移向下一个状态。也就是说， 每次调用 next 方法，内部指针就从函数头部或上一 次停下来的地方开始执行 ， 直到遇到下一条yield 语句（或 return 语句）为止 。 换言之， Generator 函数是分段执行的 ， yield 语句是暂停执行的标记 ， 而 next 方法可以恢复执行 。每次调用遍历器对象的 next 方法，就会返回 一个有着 value 和 done 两个属性的对象 。（value：当前内部状态的值，是yield语句后面那个表达式的值，done表示是否遍历结束）。

### 1.2 yield表达式

由于 Generator 函数返回的遍历器对象只有调用 next 方法才会遍历下一个内部状态，所以其实提供了 一种可以暂停执行的函数 。 yield 语句就是暂停标志 。

#### 1.2.1 执行逻辑

遍历器对象的 next 方法的运行逻辑如下 。

1.  遇到 yield 语句就暂停执行后面的操作， 并将紧跟在 yield 后的表达式的值作为返回的对象的 value 属性值 。
2. 下一次调用 next 方法时再继续往下执行，直到遇到下一条 yield 语句。
3. 如果没有再遇到新的 yield 语句，就一直运行到函数结束，直到 return 语句为止，井将 return 语句后面的表达式的值作为返回对象的 value 属性值 。
4. 如果该函数没有 return 语句，则返回对象的 value 属性值为 undefined。

#### 1.2.2 与return的区别

相似之处：都能返回紧跟在语句后面的表达式的值。

区别之处：

1. 每次遇到yield函数暂停执行，下一次会从该位置继续向后执行，而return语句不具备位置记忆的功能
2. 一个函数只能执行一次return语句，但是可以执行多次yield语句。
3. 正常函数只能返回一个值，因为只能执行一次return语句，Generator函数可以返回一系列的值，因为可以有任意多条yield语句。

#### 1.2.3 注意点

1. Generator 函数可以不用 yield 语句，这时就变成了 一个单纯的暂缓执行函数。

   ```js
   function* f () { 
   	console.log('执行了')
   }
   var generator = f();
   setTimeout(function() {
       generator.next()
   }, 2000)
   ```

   

2. yield 表达式只能用在 Generator 函数里面，用在其他地方都会报错。

   ```js
   var arr= [1, [[2, 3], 4], [5 , 6]]; 
   var flat = function* (a) { 
   	a.forEach(function (item) { 
   		if (typeof item !=='number'){ 
   			yield* flat (item); 
   		} else { 
   			yield item; 
           }
       })
   }
   
   for (var f of flat(arr)) { 
   	console.log(f) ; 
   }
   ```

   上面的代码也会产生句法错误，因为 forEach 方法的参数是一个普通函数，但是在里面使用了 yield 表达式。可以将forEach 改为for循环即可正确输出。

3.  yield 表达式如果用在另一个表达式之中，必须放在圆括号里面。

   ```js
   function* demo() { 
   	console.log('Hello' + yield); 			// SyntaxError 
   	console.log('Hello' + yield 123); 		// SyntaxError 
       
   	console.log('Hello' + (yield)); 		// {value: undefined, done: false} 
   	console.log('Hello' + (yield 123)); 	// {value: 123, done: false} 
   }	
   ```

4. yield 表达式用作函数参数或放在赋值表达式的右边，可以不加括号。

   ```js
   function* demo() { 
   	foo(yield 'a', yield 'b'); 	 // OK 
   	let input = yield; 			// OK 
   }
   ```

   

### 1.3 与Iterator接口的关系

在Iterator章节说过，任意一个对象的 Symbol.iterator 方法等于该对象的遍历器对象生成函数，调用该函数会返回该对象的一个遍历器对象。

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的Symbol.iterator 属性，从而使得该对象具有 Iterator 接口 。

```js
var myiterable = {} ; 
myiterable[Symbol.iterator] = function* () { 
    yield 1 ; 
    yield 2 ; 
    yield 3 ; 
}
[...myiterable]  	// [1, 2, 3]
```

上面的代码中， Generator 函数赋值给 Symbol.iterator 属性，从而使得 myiterable对象具有了 Iterator 接口，可以被 ... 运算符遍历。



## 2. next方法的参数

yield 语句本身没有返回值，或者说总是**返回 undefined** （就是如果赋值的话是undefined，next()得到的结果还是后面表达式的值）。 next 方法可以带有一个参数，该参数会被当作上一条 yield 语句的返回值 。

1. 案例一

   ```js
   function* f() {
       for (var i = 0; true; i++) {
           var reset = yield i;
           if (reset) i = -1;
       }
   }
   var g = f(); 
   g.next()		// 0
   g.next()		// 1
   g.next(true)	// 0
   ```

   上面的代码先定义了 一个可以无限运行的 Generator 函数 f ，如果 next 方法没有参数，每次运行到 yield 语句时，变量 reset 的值总是 undefined 。当 next 方法带有一个参数 true时，当前的变量 reset 就被重置为这个参数（即 true ），因而 i 会等于-1 ，下一轮循环就从 -1 开始递增。

2. 案例二

   ```js
   function* foo (x) { 
   	var y = 2 * (yield (x + 1)); 
   	var z = yield (y / 3) ; 
   	return (x + y + z); 
   }
   var a = foo(5); 
   a.next() 		// Object{value:6, done : false} 
   a.next() 		// Object{value : NaN , done : false} 
   a.next() 		// Object{value : NaN, done : true} 
   
   var b = foo(5) ; 
   b.next() 		// { value : 6, done:false} 
   b.next(12) 		// { value : 8, done : false }
   b.next(13) 		// { value : 42 , done : true }
   ```

   上面的代码中，第二次运行 next 方法的时候不带参数，导致 y 的值等于 2 *undefined （即NaN ），除以 3 以后还是 NaN ，因此返回对象的 value 属性也等于 NaN 。 第三次运行 Next方法的时候不带参数 ， 所以 z 等于 undefined ，返回对象的 value 属性等于 5 + NaN + undefined, 即  NaN 。

   如果向next 方法提供参数，返回结果就完全不一样了。上面的代码第一次调用 b 的next方法时，返回 6；第二次调用 next 方法，将上一次 yield 语句的值设为12 ，因此 y等于 24，返回 y / 3 的值 8； 第三次调用 next 方法，将上一次 yield 语句的值设为 13 ，因此 z 等于 13 ，这时 x 等于 5 , y 等于 24 ，所以 return 语句的值等于 42。

   > 由 于 next 方法的参数表示上一条 yield 语句的返回值 ， 所以第一次使用 next 方法时传递参数是无效的 。 

3. 案例三

   ```js
   function* dataConsumer() { 
       console.log ('Started') ; 
       console.log(`1. ${yield}`);
       console.log(`2. ${yield}`) 
       return 'result'; 
   }
   let genObj = dataConsumer() ; 
   genObj.next(); 		// Started
   genObj.next('a')	// 1. a
   genObj.next('b')	// 1. b
   ```

   

   

## 3. for...of循环

for ... of 循环可以自动遍历 Generator 函数生成的 Iterator 对象，且此时不再需要调用 next 方法。一旦 next 方法的 返回 对象的 done 属性为 true, for ... of 循环就会终止，且不包含该返回对象。

```js
function *foo() { 
    yield 1 ; 
    yield 2 ; 
    yield 3 ; 
    return 4; 
}
for (let v of foo ()) { 
	console.log(v); 
}
// 1 2 3
```

除了 for ... of 循环 ，扩展运算符（...）、解构赋值和 Array.from 方法内部调用的都是遍历器接口。这意味着 ，它们都可以将 Generator 函数返回的 Iterator 对象作为参数。

```js
function* numbers () { 
    yield 1 
    yield 2 
    return 3 
    yield 4 
}
// 扩展运算符
[...numbers()] 		// [1 , 2] 

// Array.from 方法
Array.from(numbers()) // [1 , 2] 

// 解构赋位
let [x , y] =numbers(); // 1, 2

// for...of 循环
for (let n of numbers()) { 
	console.log(n) 
}
// 1  2
```



遍历任意对象

```js
function* objectEntries() { 
    let propKeys = Object.keys(this) 
	for (let key of propKeys) { 
		yield [key, this[key]]; 
    }
}
let jane = { first : 'Jane', last : 'Doe'}; 
jane[Symbol.iterator] = objectEntries; 
for (let [key, value] of jane) { 
	console.log(key, '->', value) ;
}

```



## 4. Generator.prototype.throw() 

Generator 函数返回的遍历器对象都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获 。throw 方法可以接受一个参数，该参数会被 catch 语句接收，建议抛出 Error 对象的实例。

1. Generator 函数内部部署了 try ... catch 代码块，外部也部署了 try ... catch 代码块

   第一次错误会被内部捕获，第二次会被外部捕获，之后代码将终止后面的语句不会被执行

   ```js
   var g = function* () {
       try {
           yield;
       } catch (e) {
           console.log('内部捕获', e);
       }
   }
   var i = g();
   i.next();
   
   try {
       i.throw('a');
       i.throw('b');
       i.throw('c');
   } catch (e) {
       console.log('外部捕获', e);
   }
   // 内部捕获 a
   // 外部捕获 b
   ```

   

2. Generator 函数内部没有部署 try ... catch 代码块，外部部署了 try ... catch 代码块

   ```js
   var g = function* () {
       while(true) {
           yield;
           console.log('内部捕获', e);
       }
   }
   var i = g();
   i.next();
   
   try {
       i.throw('a');
       i.throw('b');
       i.throw('c');
   } catch (e) {
       console.log('外部捕获', e);
   }
   // 外部捕获 a
   ```

   上面的代码中，遍历器函数 q 内部没有部署 try ... catch 代码块，所以抛出的错误直接被外部 catch 代码块捕获。

3. 内外都没有部署try...catch

   ```js
   var gen= function* gen() { 
   	yield console.log('hello') ; 
   	yield console.log('world') ; 
   }
   var g = gen() ; 
   g.next() ; 
   g.throw() ; 
   
   // hello 
   // Uncaught undefined 
   ```

   上面的代码中， g.throw 抛出错误以后，没有任何 try ... catch 代码块可以捕获这个错误，导致程序报错，中断执行 。

4. throw 方法被捕获以后会附带执行下一条 yield 表达式，即附带执行一次 next 方法 。只要 Generator 函数内部部署了 try ... catch 代码块 ，那么遍历器的 throw 方法抛出的错误便不会影响下一次遍历 。

   ```js
   var gen = function* gen() { 
   try { 
   	yield console.log('a'); 
   } catch {e) { 
   	//
   }
   
   yield console.log('b'); 
   yield console.log('c'); 
   
   var g = gen(); 
   g.next()		// a 
   g.throw() 		// b
   g.next() 		// c 
   ```

   

> 不要混淆遍历器对象的 throw 方法和全局的 throw 命令。 全局的throw只能被函数体外的 catch 语句捕获 。

## 5. Generator.prototype.return() 

Generator 函数返回的遍历器对象还有一个 return 方法，可以返回给定的值，并终结Generator 函数的遍历。如果 return 方法调用时不提供参数，则返回值的 vaule 属性为 undefined 。

```js
function* gen() { 
    yield 1; 
    yield 2; 
    yield 3; 
}
var g = gen(); 
g.next() 
g.return('foo') 
g.next() 

// {value: 1, done: false}
// { value:'foo'， done : true}
// { value: undefined, done : true}
```

如果 Generator 函数内部有 try ... finally 代码块，那么 return 方法会推迟到 finally代码块执行完再执行。

```js
function* numbers () { 
    yield l; 
    try { 
    	yield 2; 
        yield 3 ; 
	} finally { 
		yield 4; 
		yield 5; 
    }
	yield 6; 
}
var g =numbers();
g.next()		// {value: 1, done: false}
g.next()		// {value: 2, done: false}
g.return(7)		// {value: 4, done: false}
g.next()		// {value: 5, done: false}
g.next()		// {value: 7, done: true}
```

## 6. yield*表达式

如果在 Generator 函数内部调用另一个 Generator 函数，默认情况下是没有效果的。

```js
function* foo () { 
    yield 'a'; 
    yield 'b';
}
function* bar() { 
    yield 'x'; 
    foo(); 
    yield 'y'; 
}
for (let v of bar()) { 
	console.log(v);
}

// x
// y
```

这时就需要用到 yield*语句，用来在一个 Generator 函数里面执行另 一个 Generator 函数。

1. 从语法角度看，如果 yield 命令后面跟的是一个遍历器对象，那么需要在 yield 命令后面加上星号，表明返回的是一个遍历器对象。这被称为 yield 叫语句。

   ```js
   function* inner() {
   	yield 'hello !';
   }
   function* outer1 () { 
       yield 'open'; 
   	yield inner(); 
   	yield 'close'; 
   }
   var gen = outer1() 
   gen.next().value 		// 'open' 
   gen.next().value		// 返回一个边历器对象
   gen.next().value 		// 'close'
   
   function* outer2 () { 
   	yield 'open'; 
   	yield* inner(); 
   	yield 'close'; 
   }
   var gen = outer2() 
   gen.next().value 		// 'open' 
   gen.next().value		// 'hello !'
   gen.next().value 		// 'close'
   ```

2. yield*后面的 Generator 函数（没有 return 语句时）等同于在 Generator 函数内部部署一个 for ... of 循环。

   ```js
   function* concat(iter1) { 
       yield* iter1; 
   }
   // 等同于
   function* concat(iter1) { 
   	for(var value of iter1) { 
   		yield value ; 
       }
   }
   
   ```

3. 在有 return i吾句时则需要用 var value = yield* iterator 的形式获取 return 语句的值。

   ```js
   function * foo () { 
   	yield 2 ; 
   	yield 3 ; 
   	return 'foo'；
   }
   function *bar () { 
   	yield 1; 
   	var v = yield *foo(); 
   	console.log ("v: "+ v ) ; 
   	yield 4; 
   }
   var it = bar() ; 
   it.next() 		// {value: 1, done : false}
   it.next() 		// {value: 2, done: false}
   it.next() 		// {value: 3 , done : false}
   it.next(); 		// "v: foo"
   it.next() 		// {value: 4, done : false}
   it.next() 		// {value: undefined, done : true}
   ```

   

4. 实际上 ，任何数据结构只要有 Iterator 接口，就可以被 yield＊遍历 。

   ```js
   let read = (function* () { 
       yield 'hello'; 
       yield* 'hello'; 
   })(); 
   
   read.next().value // "hello"
   read.next().value // "h"
   ```



## 7. 作为对象属性的 Generator 函数

如果一个对象的属性是 Generator 函数，那么可以简写成下面的形式。

```js
let obj = { 
    *myGeneratorMethod() { 
        ...
    }
}
```

## 8. Generator 函数 this

Generator 函数总是返回 一个遍历器， ES6 规定这个遍历器是 Generator  函数的实例 ，它也继承了 Generator 函数的 prototype 对象上的方法。

```js
function* g() {} 
g.prototype.hello = function () { 
    return 'hi !'; 
}
let obj = g() ; 
obj instanceof g 	 // true 
obj.hello() 		// 'hi !'
```

如果把 Generator 函数 当作普通的构造函数，则并不会生效，因为Generator 函数返回的总是遍历器对象，而不是 this 对象。

```js
function* g() { 
	this.a = 11 ;
}
let obj = g();
obj.a		// undefined
```

Generator 函数也不能跟new 命令一起用，否则会报错。

```js
function* F() { 
	yield this.x = 2 ; 
	yield this.y = 3 ; 
}
new F() 	// TypeError: F is not a constructor 
```

如何让 Generator 函数返回 一个正常的对象实例，既可以用 next 方法，又可以获得正常的 this 呢？

- 首先，生成一个空对象；
- 使用 call 方法绑定 Generator 函数内部的this ；
- 调用构造函数后，这个空对象就是 Generator 函数的实例对象了。

```js
function* F() { 
	this.a = 1; 
	yield this.b = 2 ; 
     yield this.c = 3 ; 
}
var obj= {}; 
var f = F.call(obj) ; 
f.next(); 		//Object {value : 2 , done : false} 
f.next(); 		//Object {value: 3 , done: false} 
f.next(); 		// Object {value: undefined, done: true} 
obj.a 			// 1 
obj.b 			// 2 
obj.c 			// 3 

上面的代码中，首先是 F 内部的 this 对象绑定 obj 对象，然后调用它，返回 一个 Iterator 对象。这个对象执行 3 次 next 方法（因为 F 内部有两个 yield 表达式），完成 F 内部所有代码的运行。这时，所有内部属性都绑定在 obj 对象上了，因此 obj 对象也就成了 F 的实例。
```

上面的代码执行的是遍历器对象 f ，但是生成的对象实例是 obj ，有没有办法将这两个对象统一呢？

- 一个方法就是将 obj 换成 F.prototype 。

  ```js
  var f = F.call(F.prototype) ; 
  ```

将 F 改成构造函数，就可以对它执行 new 命令了。

```js
function* gen() { 
	this.a = 1; 
	yield this.b = 2 ; 
     yield this.c = 3 ; 
}
function F ( ) { 
	return gen.call(gen.prototype ); 
}
var f = new F () ; 
f.next(); 		// Object {value : 2 , done : false} 
f.next(); 		// Object {value: 3 , done: false} 
f.next(); 		// Object {value: undefined, done: true} 
obj.a 			// 1 
obj.b 			// 2 
obj.c 			// 3 
```

## 9. 应用

### 9.1 异步操作的同步化表达

1. 处理异步操作，改写回调函数

   Generator 函数的暂停执行效果，意味着可以把异步操作写在 yield 语句里面，等到调用next 方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在 yield 语句下面，反正要等到调用 next 方法时再执行。

   ```js
   function* loadUI() ( 
   	showLoadingScreen(); 
   	yield loadUIDataAsynchronously(); 
   	hideLoadingScreen(); 
   }
   var loader = loadUI()
   // 加载UI
   loader.next()
   // 卸载UI
   loader.next()
   ```

   上面的代码中，第一次调用 loadUI 函数时，该函数不会执行，仅返回一个遍历器。下一次对该遍历器调用 next 方法，则会显示 Loading 界面（ showLoadingScreen ），并且异步加载数据（ loadUIDataAsynchronously )。等到数据加载完成，再一次使用next 方法，则会隐藏 Loading 界面 。可以看到，这种写法的好处是所有 Loading 界面的逻辑，都被封装在一个函数，按部就班非常清晰。

2. AJAX 是典型的异步操作，通过 Generator 函数部署 AJAX 操作，可以用同步的方式表达 。

   ```js
   function* main () { 
       var result= yield request ("http://some.url"); 
       var resp= JSON.parse(result); 
       console.log(resp.value) ; 
   }
   
   function request(url) { 
       makeAjaxCall(url, function(response) { 
      		it.next(response); 
   	});
   }
   
   var it = main(); 
   it.next() ; 
       
   makeAjaxCall 函数中的 next 方法必须加上 response 参数，因为 yield 语句构成的表达式本身是没有值的，总是等于 undefined 。
   ```

3. 通过 Generator 函数逐行读取文本文件

   ```js
   function＊ numbers() { 
   	let file= new FileReader ("numbers.txt" ); 
   	try { 
   		while (!file.eof) { 
   			yield parseint(file.readLine(), 10); 
           }
       } finally { 
   		file.close(); 
       }
   }
   ```

   

### 9.2 控制流管理

如果有一个多步操作非常耗时，采用回调函数可能会写成下面这样 。

```js
stepl (function (valuel) { 
    step2 (valuel, function (value2) { 
        step3 (value2 , function (value3) { 
            step4 (value 3 , function (value4) { 
            	// Do something with value4 
			}); 
		}); 
    }); 
}) ; 
```

采用 Promise 改写上面的代码如下。

```js
Promise.resolve(step1) 
	.then(step2) 
	.then(step3) 
	.then(step4) 
	.then(function (value4) { 
		// Do something with value4 
	}, function (error){ 
		// Handle any error from stepl through step4 
	}) 
	.done(); 
```

上面的代码己经把回调函数改成了直线执行的形式，但是加入了大量 Promi se 的语法。Generator 函数可以进一步改善代码运行流程。

```js
function* longRunningTask(valuel) { 
    try { 
    	var value2 =yield stepl(valuel) ; 
    	var value3 =yield step2 (value2) ; 
    	var value4 =yield step3(value3) ; 
    	var values= yield step4(value4) ; 
    	// Do something with value4 
	} catch (e) { 
		// Handle any error from stepl through step4 
    }
}
function scheduler(task) { 
	var taskObj = task.next(task.value); 
	// 如采 Generator 函数未结束，就继续调用
	if (!taskObj.done) { 
		task.value= taskObj.value 
		scheduler(task) ; 
    }
}
scheduler(longRunningTask(initialValue)) ; 

上面scheduler函数只适合同步操作，即所有的 task 都必须是同步的，不能有异步操作。 因为这里的代码一得到返回值就继续往下执行，没有判断异步操作何时完成。
```

用 for ... of 循环自动依次执行 yield 命令的特性，提供一种更一般的控制流管理的方法。

```js
let steps= [steplFunc, step2Func, step3Func]; 

function *iterateSteps(steps) { 
	for (var i=0; i< steps.length; i++) { 
		var step = steps[i]; 
		yield step(); 
    }
}
```

### 9.3 部署 Iterator 接口

利用 Generator 函数可以在任意对象上部署 Iterator 接口。

```js
function* iterEntries (obj) { 
	let keys= Object .keys(obj ); 
	for (let i=O; i < keys. length; i++) { 
        let key= keys[i]; 
        yield [key, obj [key]];
    }
}

let myObj = { foo: 3 , bar: 7 }; 
for (let [key, value] of iterEntries(myObj)) { 
	console.log(key, value) ; 
}

// foo 3 
// bar 7 
```



