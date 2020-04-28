## 1. 简介

ES6定义类的方法

```js
class Point { 
	constructor(x, y) { 
		this.x = x; 
		this.y = y; 
	}
	toString () { 
		return '('+ this.x + ',' + this.y + ')'; 
	}
}
```

上面的代码定义了 一个“类”。

- 类的数据类型就是函数，类本身就指向构造函数 。

  ```js
  typeof Point // "function" 
  Point === Point.prototype.constructor // true 
  ```

- 类中包含一个 constructor 方法，这就是构造方法，而 this 关键字则代表实例对象。

- prototype 对象的 constructor 属性直接指向“类”本身。

  ```js
  Point.prototype.constructor === Point // true
  ```

- 类的所有方法都定义在类的 prototype 属性上。

  ```js
  // 等同于
  Point.prototype = { 
  	constructor () {} , 
  	toString () {}
  }
  ```

- 在类的实例上调用方法，其实就是调用原型上的方法。

  ```js
  class B {} 
  let b = new B(); 
  b.constructor === B.prototype.constructor // true 
  ```

- 由于类的方法（除 constructor 以外〉都定义在 prototype 对象上，所以类的新方法可以添加在 prototype 对象上。 Object.assign 方法可以很方便地一次向类添加多个方法。

  ```js
  class Point { 
  	constructor() { 
  		// ...
      }
  }
  Object.assign(Point.prototype, {
      toString()
  })
  ```

- 类的内部定义的所有方法都是不可枚举的（ non-enumerable ）, 这一点与ES5的行为不一致。

  ```js
  Object.keys(Point.prototype) 
  // []
  Object.getOwnPropertyNames(Point.prototype) 
  // ["constructor", "toString"] 
  ```

## 2. 严格模式

类和模块的内部默认使用严格模式 ，所以不需要使用 use strict 指定运行模式。只要将代码写在类或模块之中，那么就只有严格模式可用。



## 3. constructor 方法

 constructor 方法是类的默认方法，通过 new 命令生成对象实例时自动调用该方法。 

- 一个类必须有 constructor 方法，如果没有显式定义， 一个空的 constructor 方法会被默认添加。

  ```js
  class Point { 
  }
  // 等价于
  class Point { 
      constructor() {}
  }
  ```

- constructor 方法默认返回实例对象（即 this ），不过完全可以指定返回另外一个对象。

  ```js
  class Foo { 
  	constructor () { 
  		return Object.create(null); 
  	}
  }
  new Foo() instanceof Foo		// false
  ```

  上面的代码中， constructor 函数返回 一个全新的对象，结果导致实例对象不是 Foo 类的实例。

- 类必须使用 new 来调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new 也可以执行。

## 4. 类的实例对象

- 生成实例对象使用new 命令。如果忘记加上 new ，像函数那样调用 Class 将会报错。

- 实例的属性除非显式定义在其本身（即 this 对象) 上，否则都是定义在原型（即 Class ）上。

  ```js
  class Point { 
  	constructor(x, y) { 
  		this.x = x; 
  		this.y = y; 
  	}
  	toString () { 
  		return '('+ this.x + ',' + this.y + ')'; 
  	}
  }
  var point = new Point(2, 3) ; 
  point.toString() 					// (2, 3) 
  
  point.hasOwnProperty('x') 			// true 
  point.hasOwnProperty('y') 			// true 
  point.hasOwnProperty('toString') 	 // false 
  point.__proto__.hasOwnProperty ('toString') // true 
  ```

  上面的代码中， x 和 y 都是实例对象 point 自身的属性（因为定义在 this 变量上）。而 toString是原型对象的属性（因为定义在 Point类上）。这些都与 ES5 的行为保持一致。

- 与 ES5一样，类的所有实例共享一个原型对象。

  ```js
  var pl = new Point(2, 3); 
  var p2 = new Point(3, 2); 
  pl.__proto__ === p2.__proto__ === Point.prototype	// true
  ```

  

## 5. Class 表达式

- 与函数一样， Class 也可以使用表达式的形式定义。

  ```js
  const MyClass = class Me { 
      getClassName() { 
      	return Me.name ; 
      }
  }
  let inst = new MyClass(); 
  inst.getClassName()  //Me 
  Me.name 			// ReferenceError : Me is not defined 
  ```

  上面的代码使用表达式定义了 一个类。需要注意的是，这个类的名字是 MyClass 而不是Me, Me 只在 Class 的内部代码可用，指代当前类。

  Me 只在 Class 内部有定义, 如果 Class 内部没有用到，那么可以省略 Me，也就是可以写成下面的形式。

  ```js
  const MyClass = class{}；
  ```

- 采用 Class 表达式，可以写出立即执行的 Class 。

  ```js
  let person = new class { 
  	constructor(name) { 
  		this.name = name; 
      }
  	sayName() { 
  		console.log(this.name) ; 
      }
  ｝（'张三'）；
  person.sayName() ; // "张三"
  ```

## 6. 不存在变量提升

类不存在变量提升（ hoist ），这一点与 ES5 完全不同。

```js
new Foo(); 		// ReferenceError 
class Foo {} 
```



## 7. 私有方法

私有方法是常见需求，但 ES6 不提供，只能通过变通方法来模拟实现 。

1. 一种做法是在命名上加以区别

   ```js
   class Widget { 
   	// 公有方法
   	foo (baz) { 
   		this.bar(baz); 
       }
   	// 私有方法
   	_bar(baz) { 
   		return this.snaf = baz; 
       }
       // ...
   }
   ```

   上面的代码中， bar 方法前面的下画线表示这是一个只限于内部使用的私有方法 。 但是，这种命名是不保险的，在类的外部依然可以调用这个方法。

2. 另 一种方法是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的 。

   ```js
   class Widget { 
   	foo (baz) { 
   		bar.call(this, baz); 
       }
   	// ...
   }
   
   function bar(baz) { 
   	return this.snaf = baz; 
   }
   ```

   上面的代码中，foo 是公有方法, 内部调用了bar.call(this, baz)。 这使得 bar 实际上成为了当前模块的私有方法。

3. 还有一种方法是利用 Symbol 值的唯一性将私有方法的名字命名为一个 Symbol 值 。

   ```js
   const bar = Symbol ('bar'); 
   const snaf = Symbol ('snaf'); 
   export default class myClass{ 
   	// 公有方法
   	foo(baz) { 
   		this[bar](baz);
       }
   	// 私有方法
   	[bar](baz) { 
   		return this[snaf] = baz; 
       }
       // ...
   };
   ```

   上面的代码中，bar 和 snaf 都是 Symbol 值，导致第三方无法获取到它们，因此达到了私有方法和私有属性的效果。

   

## 8. 私有属性

与私有方法一样， ES6 不支持私有属性。目前，有一个提案组github.com/tc39 /proposal-class-fields#private-fields ）为 class 加了私有属性。方法是在属性名之前，使用＃来表示。

```js
class Point { 
	#x; 
	constructor (x = 0) { 
		#x = +x; 	// 写成 this.#x 亦可
    }
	get x() { return #x } 
	set x(value) { #x =+value } 
}
```



## 9. this 的指向

类的方法内部如果含有 this ，它将默认指向类的实例 。 

- 但是，必须非常小心， 一旦单独使用该方法，很可能会报错。

  ```js
  class Logger { 
  	printName(name = 'there' ){ 
  		this.print(`Hello ${name}`);
  	}
  	print(text) { 
  		console.log(text); 
      }
  }
  const logger = new Logger();
  const {printName} = logger
  printName()  	// TypeError: Cannot read property 'print' of undefined 
  ```

  上面的代码中， printName 方法中的 this 默认指向 Logger 类的实例。但是，如果将这个方法提取出来单独使用， this 会指向该方法运行时所在的环境，因为找不到 print 方法而导致报错。

- 一个比较简单的解决方法是，在构造方法中绑定 this ，这样就不会找不到 print 方法了 。

  ```js
  class Logger { 
  	constructor () { 
  		this.printName = this.printName.bind(this) ; 
      }
      // ...
  }
  ```

- 另 一种解决方法是使用箭头函数。

  ```js
  class Logger { 
      constructor () { 
          this.printName = (name = 'there') =>{
              this.print(`Hello ${name}`);
          }
      }
      // ...
  }
  
  // 或者
  class Logger { 
     printName = (name = 'there') => {
        this.print(`Hello ${name}`);
     }
      // ...
  }
  ```

- 还有一种解决方法是使用 Proxy ，在获取方法的时候自动绑定 this 。

  ```js
  function selfish (target) { 
  	const cache = new WeakMap() ; 
  	const handler = { 
  		get(target, key) { 
  			const value = Reflect.get(target, key); 
  			if (typeof value !== 'function') { 
  				return value; 
               }
  			if (!cache.has(value)) { 
  				cache.set(value, value.bind(target));
              }
              return cache.get(value); 
          }
      }
      const proxy ＝new Proxy(target, handler); 
  	return proxy; 
  }
  const logger = selfish(new Logger ()); 
  ```

  

## 10. name 属性

本质上，由于 ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被 Class继承，包括 name 属性。

```js
class Point {} 
Point.name // "Point"
```

name 属性总是返回紧跟在 class 关键字后面的类名。

## 11. Class 的职值函数(getter)和存值函数(setter)

与 ES5 一样，在“类”的内部可以使用 get 和 set 关键字对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```js
class MyClass { 
	constructor() { }
	get prop() { 
		return 'getter'
    }
	set prop(value) { 
		console.log ('setter :' + value); 
    }
}
let inst= new MyClass(); 
inst.prop = 123;  			// setter: 123 
inst.prop 				   // getter
```

存值函数和取值函数是设置在属性的 Descriptor 对象上的 。

```js
class CustomHTMLElement { 
	constructor(element) { 
		this.element = element; 
    }
	get html() { 
		return this.element.innerHTML ; 
    }
	set html(value) { 
		this.element.innerHTML = value ; 
    }
}
var descriptor= Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, "html");
"get" in descriptor 		// true 
"set" in descriptor 		// true 
```

## 12. Class的Generator方法

如果某个方法之前加上星号(*)，就表示该方法是一个 Generator 函数。

```js
class Foo { 
	constructor(...args) { 
		this.args = args; 
    }
    *[Symbol.iterator](){ 
		for (let arg of this.args) { 
			yield arg ; 
        }
    }
}
for (let x of new Foo ('h' , 'i')){ 
	console.log(x) ; 
}
// h
// i
```

上面的代码中， Foo 类的 Symbol.iterator 方法前有一个星号，表示该方法是一个Generator 函数 。 Symbol.iterator 方法返回一个 Foo 类的默认遍历器， for ... of 循环会自动调用这个遍历器。



## 13.  Class 的静态方法

类相当于实例的原型，所有在类中定义的方法都会被实例继承。如果在一个方法前加上static 关键字，就表示该方法是静态方法。

- 静态方法不会被实例继承

  ```js
  class Foo { 
  	static classMethod() { 
  		return 'hello';
      }
  }
  
  Foo.classMethod() 		// 'hello'
  
  var foo = new Foo(); 
  foo.classMethod ()		// TypeError: foo.classMethod is not a function 
  ```

- 父类的静态方法可以被子类继承。

  ```js
  class Foo { 
  	static classMethod () { 
  		return 'hello';
      }
  }
  
  class Bar extends Foo { 
  }
  Bar.classMethod()		 // 'hello'
  ```

- 静态方法也可以从 super 对象上调用。

  ```js
  class Foo { 
  	static classMethod () { 
  		return 'hello';
      }
  }
  class Bar extends Foo { 
  	static classMethod() { 
  		return super.classMethod() + ', too';
      }
  }
  
  Bar.classMethod() 		// "hello, too"
  ```



## 14. Class的静态属性和实例属性

### 14.1 Class 的实例属性

1. 旧写法：写在constructor中

   ```js
   class ReactCounter extends React.Component { 
   	constructor(props) { 
   		super(props) ; 
   		this.state = { 
   			count: 0 
           }
       }
   }
   ```

2. 新写法：用等式写入类的定义之中

   ```js
   class MyClass { 
   	myProp = 42 ; 
   	constructor() { 
   		console.log(this.myProp) ; // 42 
       }
   }
   
   class ReactCounter extends React.Component { 
   	state = { 
   		count: 0 
   	}
   }
   ```



### 14.2 Class 的静态属性

静态属性指的是 Class 本身的属性，即 Class.propname ，而不是定义在实例对象(this)上的属性。

1. 旧写法：在类外定义

   ```js
   class Foo { 
   }
   Foo.prop = 1; 
   Foo.prop 		// 1
   ```

2. 新写法：Class 的静态属性只要在上面的实例属性写法前面加上 static 关键字就可以了。

   ```js
   class MyClass { 
   	static myStaticProp = 42 ; 
   	constructor () { 
   		console.log(MyClass.myStaticProp) ; 
       }
   }
   let a = new MyClass()			// 42 
   console.log(a.myStaticProp);	// undefined
   ```

3. 以下两种写法都无效

   ```js
   class Foo { 
   	// 写法一
   	prop: 2 
   	// 写法二
   	static prop : 2 
   }
   Foo.prop // undefined 
   ```



## 15 new.target 属性

### 15.1 funtion中的new.target

new 是从构造函数生成实例的命令。 ES6 为 new 命令引入了 new.target 属性，（在构造函数中）返回 new 命令所作用的构造函数 。 如果构造函数不是通过 new 命令调用的，那么new.target 会返回 undefined ，因此这个属性可用于确定构造函数是怎么调用的 。

```js
function Person (name) { 
    if (new.target !== undefined) { 
    	this.name = name; 
    } else { 
    	throw new Error('必须使用 new 生成实例')；
    }
}
// 另一种写法
function Person (name) { 
	if (new.target === Person) { 
		this.name = name; 
	} else { 
    	throw new Error('必须使用 new 生成实例')；
    }
}
var person = new Person('张三')；				// 正确
var notAPerson = Person.call(person, '张三'）；	// 错误
```



### 15.2 class中的new.target

Class 内部调用 new.target ，返回当前 Class 。

```js
class Rectangle { 
	constructor (length, width) { 
		console.log(new.target === Rectangle) ; 
		this.length = length; 
		this.width = width ; 
    }
}
var obj = new Rectangle(3, 4); 	// 输出 true
```

需要注意的是，子类继承父类时 new.target 会返回子类。

```js
class Square extends Rectangle { 
	constructor(length) { 
		super(length, length) ; 
    }
}
var obj = new Square(3) ; 			// 输出 false
上面的代码中，new.target会返回子类。
```

利用这个特点，可以写出不能独立使用而必须继承后才能使用的类。

```js
class Shape { 
	constructor () { 
		if (new.target === Shape) { 
			throw new Error （'本类不能实例化'）；
        }
    }
}
class Rectangle extends Shape { 
	constructor(length, width) { 
        super() ; 
    }
}
var x = new Shape(); 			// 报错
var y = new Rectangle(3, 4); 	// 正确
```

上面的代码中， Shape 类不能被实例化，只能用于继承。
注意，在函数外部，使用 new.target 会报错。



## 16. Class 的继承

### 16.1 继承的方式

Class 可以通过 extends 关键字实现继承。

```js
class Point {
}
class ColorPoint extends Point { 
}
```

在子类的构造函数中，只有调用 super 之后才可以使用 this关键字 ，否则会报错 。这是因为子类实例的构建是基于对父类实例加工，只有 super 方法才能返回父类实例。

```js
class Point { 
	constructor (x, y) { 
         this.x = x ; 
		this.y = y; 
    }
}
class ColorPoint extends Point { 
	constructor(x, y, color) { 
        this.color = color; 		// ReferenceError 
        super(x, y) ; 
        this.color = color ；		// 正确
    }
}
```



### 16.2 继承的实质

ES5 的继承实质是先创造子类的实例对象 this ， 然后再将父类的方法添加到 this 上面(Parent.apply(this))。 

ES6 的继承机制完全不同，实质是先创造父类的实例对象 this（所以必须先调用 super 方法）， 然后再用子类的构造函数修改 this 。



### 16.3 Object.getPrototypeOf() 

Object.getPrototypeOf 方法可以用来从子类上获取父类。因此，可以使用这个方法判断一个类是否继承了另一个类。

```JS
Object.getPrototypeOf(ColorPoint) === Point		// true
```



### 16.4 super 关键字

1. 子类必须在 constructor 方法中调用 super 方法， 否则新建实例时会报错。如果子类没有定义 constructor 方法，那么这个方法会被默认添加。

   ```js
   class Point { /* . . . */ } 
   
   // 正确
   class ColorPoint extends Point {
   	 constructor() {
            super()			
        }
   }
   
   // 正确
   class ColorPoint extends Point { }	
   // 等价于
   class ColorPoint extends Point { 
       constructor(...args) { 
       	super(...args)
       }
   }
   
   // 错误
   class ColorPoint extends Point { 
       constructor() { }
   }
   let cp = new ColorPoint(); 			// ReferenceError
   ```

2. super关键字可作为函数使用，也可作为对象使用

   +  super 作为函数：

     + 只能在子类的构造函数中使用，用在其他地方就会报错。 
     + 作为函数时代表父类的构造函数。返回的是子类 的实例，即 super 内部的 this指的是子类，因此 super() 在子类的构造函数中调用相当于 `Parent.prototype.constructor.call(this）` 。

     ```js
     class A { 
     	constructor () { 
     		console.log(new.target.name); 	// new.target指向当前正在执行的函数
         }
     }
     class B extends A {
     	 constructor() {
              super()			
          }
     }
     new A () 		// A 
     new B() 		// B 
     ```

   + super 作为对象：

     + 在普通方法中指向父类的原型对象。

     + 由于 super 指向父类的原型对象，所以定义在父类实例上的方法或属性是无法通过super 调用的 。

     + 通过 super 调用父类的方法时， super 会绑定子类的 this 。

     + 由于绑定子类的 this ，因此如果通过 super 对某个属性赋值，这时 super 就是 this , 赋值的属性会变成子类实例的属性。

       ```js
       class A {
           constructor() {
               this.age = 12; 
           }
           print() {
               console.log(this.x); 	// 被子类调用时，this指向调用的子类
           }
       }
       class B extends A {
           constructor() {
               super();
               super.x = 4; 			// 相当于 this.x = 4
               super.print();			// 4	相当于调用  A.prototype.print() 
               console.log(super.x) 	 // 3	
           }
           get m() {
               return super.age;
           }
       }
       A.prototype.x = 3; 
       let b = new B();		// 4   3
       console.log(b.m);		// undefined  [age是父类A实例的属性，因此super.age就引用不到它]
       ```

     + 在静态方法中指向父类

       ```js
       class Parent {
           // 绑定在类上的方法
           static myMethod(msg) {
               console.log('static ', msg);
           }
       	// 绑定在实例上的方法
           myMethod(msg) {
               console.log('instance ', msg);
           }
       }
       class Child extends Parent {
           static myMethod(msg) {
               super.myMethod(msg);
           }
           myMethod(msg) {
               super.myMethod(msg);
           }
       }
       Child.myMethod(1); //static 1 
       
       var child = new Child();
       child.myMethod(2); // instance 2 
       ```

   + 由于对象总是继承其他对象的，所以可以在任意一个对象中使用 super 关键字。

     ```js
     var obj = { 
     	toString() { 
     		return "MyObject : " + super.toString(); 
         }
     }
     obj.toString(); 		// MyObject: [object Object] 
     ```

     

### 16.5 原型链关系

- 类的 \_\_proto\_\_ 属性表示构造函数的继承，总是指向父类。

- 子类 prototype 属性的 \_\_proto\_\_  属性表示方法的继承，总是指向父类的prototype 属性。

  ```js
  class A { 
  }
  class B extends A {
  }
  B.__proto__ === A 						// true 
  B.prototype.__proto__ === A.prototype 	 // true 
  ```

  原因：类在继承的过程中，实现如下

  ```js
  Object.setPrototypeOf(B.prototype, A.prototype) ; 
  Object.setPrototypeOf(B, A); 
  ```

  而Object.setPrototypeOf 的实现如下：

  ```js
  Object.setPrototypeOf = function (obj, proto) { 
  	obj.__proto__ = proto ; 
  	return obj; 
  }
  ```

  这两条继承链可以这样理解 ： 作为一个对象，子类（ B ）的原型 （\_\_proto\_\_ 属性）是父类（ A ）；作为一个构造函数，子类（ B ）的原型（ prototype 属性）是父类的实例 。

### 16.6 extends 的继承目标

```js
class B extends A { }
```

以上继承机制中，只要A是一个有 prototype 属性的函数，就能被B继承。由于函数都有prototype 属性（除了 Function.prototype 函数），因此 A 可以是任意函数。

下面，讨论 3 种特殊情况。

1. A是Object 类

   这种情况下B其实就是构造函数 Object 的复制， B 的实例就是 Object 的实例。

   ```js
   class B extends Object { }
   B.__proto__=== Object 							// true 
   B.prototype.__proto__ === Object.prototype 		 // true 
   ```

   

2. 不存在任何继承

    A 作为一个基类（即不存在任何继承）就是一个普通函数 ，所以直接继承 Function.prototype 。但是，A 调用后返回一个空对象(即 Object 实例)，所以A.prototype. \_\_proto\_\_ 指向构造函数(Object)的prototype属性。

   ```js
   class A { }
   A.__proto__ === Function.prototype 			// true 
   A.prototype.__proto__ === Object.prototype	 // true 
   ```

3. A是null

   A 也是一个普通函数 ，所以 直接继承 Function 。prototype 。但是， A 调用后返回的对象不继承任何方法，所以它的 \_\_proto\_\_ 指向Function.prototype 。

   ```js
   class B extends null {}
   A.__proto__ === Function.prototype 			// true 
   A.prototype.__proto__ === undefined 		// true
   ```



子类实例的 \_\_proto\_\_ 属性的 \_\_proto\_\_ 属性指向父类实例的 \_\_proto\_\_ 属性。

```js
var p1 = new Point(2, 3); 
var p2 = new ColorPoint(2, 3, 'red'); 
p2.__proto__.__proto__ === pl.__proto__ 	// true 
```



### 16.7 原生构造函数的继承

原生构造函数是指语言内置的构造函数，通常用来生成数据结构。 ECMAScript的原生构造函数大致有下面这些。

- Boolean() 
- Number() 
- String() 
- Array() 
- Date() 
- Function() 
- RegExp() 
- Error() 
- Object() 

ES5中，这些原生构造函数是无法继承的。以下代码也无法继承Array。因为子类无法获得原生构造函数的内部属性，通过Array.apply （ ）或者分配给原型对象都不行。

原因：ES5 先新建子类的实例对象 this ，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数 。

```js
function MyArray() { 
	Array.apply(this, arguments); 
}

MyArray.prototype = Object.create(Array.prototype, { 
	constructor : { 
		value: MyArray, 
		writable : true, 
		configurable : true , 
		enumerable: true 
    }
})

var color = new MyArray();
color[0] = 'A';
color.length 	// 0
```

ES6 允许继承原生构造函数定义子类。因为 ES6 先新建父类的实例对象 this ，然后再用子类的构造函数修饰 this，使得父类的所有行为都可以继承 。

```js
class MyArray extends Array { 
	constructor(...args) { 
		super (...args) ; 
    }
}
var arr = new MyArray() ; 
arr[0] = 12; 
arr.length // 1 
```

