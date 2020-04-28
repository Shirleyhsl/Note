## 1. 总结

1. 如果函数被new 修饰 

   - this绑定的是新创建的对象。 

     ```js
     var bar = new foo();    // 函数foo中的this就是一个叫foo的新创建的对象 , 然后将这个对象赋给bar
     ```

   - 特别注意 : 如果原函数返回一个对象类型，那么将无法返回新对象,你将丢失绑定this的新对象，例: 

     ```js
     function foo(){
         this.a = 10;
         return new String("捣蛋鬼");
     }
     var obj = new foo();
     console.log(obj.a);       // undefined
     console.log(obj);         // "捣蛋鬼"
     ```

2. 如果函数是使用call,apply,bind来调用的 

   - this绑定的是 call,apply,bind 的第一个参数. 

     ```js
     foo.call(obj)		// foo 中的 this 就是 obj , 这样的绑定方式叫 显性绑定
     ```

   - 不管我们给函数bind几次，fn中的this永远由**第一次bind**决定

     ```js
     let a = {}
     let fn = function () { console.log(this) }
     fn.bind().bind(a)() 			// => ?
     
     // window 不管给函数bind几次，fn中的this永远由第一次bind决定。
     ```

3. 如果函数是在某个 上下文对象 下被调用 

   - this绑定的是那个上下文对象 。上下文取函数的直接上级，即紧挨着的那个，或者说对象链的最后一个。 

     ```js
     var obj = { foo : foo }; 
     obj.foo();					// foo 中的 this 就是 obj. 这样的绑定方式叫 隐性绑定
     ```

4. 如果都不是，即使用默认绑定 

   -  this 就是 window.(严格模式下默认绑定到undefined)

     ```js
     function foo(){...} 
     foo()					// 这样的绑定方式叫 默认绑定 
     ```

5. 箭头函数 

   - 箭头函数其实是没有this的，箭头函数中的this只取决包裹箭头函数的第一个普通函数的this。箭头函数的this一旦被绑定，就不会再被任何方式所改变。 

6. 即使函数

   即时函数会开辟一块独立的临时私有作用域，此时this指向的是全局对象。 





## 2. 绑定优先级

`new 绑定 > 显示绑定 > 隐式绑定 > 默认绑定 `



## 3. 介绍

什么是this ？在讨论this绑定前，我们得先搞清楚this代表什么。

-  this是JavaScript的关键字之一。它是对象自动生成的一个内部对象，只能在对象内部使用。随着函数使用场合的不同，this的值会发生变化。
- this指向什么，完全取决于 **什么地方以什么方式调用**，而不是 创建时。 