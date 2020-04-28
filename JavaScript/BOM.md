## 1. window

window是BOM的核心对象，既表示浏览器窗口，也表示全局对象。作为浏览器窗口时，能读取浏览器信息，解析URL。显示对话框等 



### 1.1 事件循环

js的单线程，只有一个主线程负责解释执行js代码。由于单线程原因，同一时间只能处理一个任务，其余的任务需要排队等候并且只能按顺序来，中间不能插队。所以一旦有一个任务很长，后面的任务都会推迟执行。 

- 这些任务分为同步任务和异步任务，**同步任务会率先被执行，而异步任务会先到任务队列中排队**。 
  - 同步任务 

    同步任务都在主线程中执行，发出调用后，调用者被阻塞，直到调用完成，才能得到预期效果 

  - 异步任务

    一旦执行栈中的所有同步任务执行完毕（此时JS引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。 

- js通过事件循环机制高效的处理多个任务，是通过任务队列机制来协调的。 

- 任务分类 

  - 宏任务（macro task）：每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。浏览器为了能够使得JS内部(macro)task与DOM任务能够有序的执行，会在一个(macro)task执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染。script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境) 
  - 微任务（micro task）： 当前 task 执行结束后立即执行的任务。 也就是说，在当前task任务后，下一个task之前，在渲染之前。 所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染。 在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）。microtask主要包含：Promise.then，MutaionObserver，process.nextTick。 

- 运行机制 

  - 执行一个宏任务（栈中没有就从事件队列中获取）
  - 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
  - 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
  - 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
  - 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取） 

- Promise和async中的立即执行 

  - Promise中的异步体现在then和catch中，所以写在Promise中的代码是被当做同步任务立即执行的。
  - 而在async/await中，在await出现之前，其中的代码也是立即执行的。
  - 实际上await是一个让出线程的标志。await后面的表达式会先执行一遍，将await后面的代码加入到microtask中，然后就会跳出整个async函数来执行后面的代码。 



### 1.2 定时器

```js
console.log(1);
setTimeout(() => {
    console.log(2)
}, 0);
console.log(3);
执行结果：1 3 2
```

- 理解定时器机理：
  - 定时器创建是异步任务，过了指定的延迟时间后，异步任务会被放入任务队列中，即使延迟时间是0ms，也会先到任务队列中，等主线程空闲的时候，才会从任务队列中读取任务，因此定时器会在另外两条语句执行完后再被调用。
  - 定时器的延迟时间是无法保证的，前面的任务被阻塞了，并不会影响异步任务被添加到任务队列中，这就有可能出现两个异步任务挨个执行，并没有达到预期的时间间隔。 
- 定时器回调函数是在分线程执行的吗？
  - 在主线程执行的，JS是单线程的
- 定时器如何实现的？
  - 事件循环模型

### 1.3 对话框

- 对话框的外观不能由css控制，由操作系统或浏览器决定，所以不同浏览器的样式不统一
- 不能给对话框添加自定义事件，这就不能完成一些定制需求
- 当调用对话框时会**产生任务阻塞，这意味代码会停止运行**，只有关闭对话框才能让代码恢复运行。
- 对话框只能显示纯文本，不能显示HTMl元素，也不能由css控制样式。 



## 2. Location 

Location对象不仅能获取当前窗口的文档（也就是页面）的URL，还能让窗口刷新当前文档或载入新文档。在window和Document对象中，有一个location属性，引用Location对象 

- location.protocol, location.host, location.hostname, location.port, location.pathname, location.search, location.hash, location.href 这些属性可读可写，重新赋值就会修改url 
- 获取URL的参数时，需要进行解码 `parsed[key] = decodeURIComponent(value); `
- 加载新文档
  - location.assign(新的URL): 此方法加载的新文档会被添加到浏览器历史记录中 
  - location.replace(新的URL): 此方法加载的新文档会在历史记录中替换原文档 
  - location.reload()：可以接受true/false; true: 强制刷新，也就是向服务器请求回传最新的文档，false：会以最有效的方式加载文档，如果文档还是新鲜的，那么就从浏览器历史记录中读取缓存，否则执行强制刷新。 

## 3. Navigator

获取浏览器相关信息，例如名称、版本、渲染引擎所处的操作系统等。不同的浏览器中的Navigator会包括不同的属性。 

共有属性：

- appName：浏览器名称
- appVersion：浏览器版本
- platform：浏览器所处的操作系统或硬件平台
- userAgent：浏览器的用户代理信息，包括了appVersion 属性内的值。 

其中一些兼容性一般的属性：

- connection、cookieEnabled、onLine、geolocation、plugins 

## 4. History

保存当前窗口在浏览器中的历史记录，历史记录由很多页的文档组成，缓存这各个文档的状态。虽然可以操作历史记录，但是出于隐私方面的考虑，不允许访问历史记录中文档的真实URL。

在web的开发过程中，为了更好的用户体验，一般会进行局部刷新。这时，当用户点击后退按钮的时候，看不到上一次局部刷新前的数据。此时可以用pushState和popState来自定义历史记录的数据。 



## 5. 显示器的分辨率 

```js
var ratio = window.devicePixelRatio;
console.log(screen.width * ratio+"x" + screen.height*ratio);
```





## 6. 引擎执行代码的顺序

- 先执行初始化代码
  - 设定定时器
  - 绑定事件监听
  - 发送ajax请求
- 然后执行回调函数



## 7. 宿主对象

宿主对象：宿主环境（如浏览器）定义的对象，用于完善 ESMAScript的执行环境，例如Document、location和Navigator。 

原生对象：ESMAScript规范定义的对象，所以内置对象都是原生对象，例如Array（数组）、Date、RegExp等。





