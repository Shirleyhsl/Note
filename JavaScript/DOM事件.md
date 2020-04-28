## 1. 事件定义

事件并不是代码世界里的专用词，它仅仅是由简单的：监听、变化、通知 三要素组成在前端世界中，事件可以定义为：代码监听（用户），（用户）操作产生变化、（程序员）得到通知。 

## 2. 实现监听

1. DOM level 0 事件监听方法：onclick

   ```js
   button.onclick = function(){}
   ```

   这种方法可以用作简单的监听。存在一个很大的问题。那就是如果一个元素绑定事件时，会覆盖掉前面已经绑定好的事件。 

2. DOM level 2 事件监听方法 : addEventListener

   ```js
   button.addEventListener('click', function(){}, false) 
   ```

   这种方法和level 0的绑定方法是一致 ，但监听事件每次都会生产一个全新的匿名函数，和前面的函数完全不同，不会覆盖掉前面已经绑定好的时间。 

   第三个参数指定事件是否在捕获或冒泡阶段执行。

   - true - 事件在捕获阶段执行
   - false-默认，事件在冒泡阶段执行 

3. button.attachEvent() : 低版本的IE事件 

4. 兼容性代码 

   ```js
   function addEventListener(element, type, fn) {
     if (element.addEventListener) {
       element.addEventListener(type, fn, false);
     } else if (element.attachEvent){
       element.attachEvent('on' + type,fn);
     } else {
       element['on'+type] = fn;
     }
   }
   
   
   function removeEventListener(element, type, fn) {
     if (element.removeEventListener) {
       element.removeEventListener(type, fn, false);
     } else if (element.detachEvent) {
       element.detachEvent('on' + type, fn);
     } else {
       element['on'+type] = null;
     }
   }
   ```

   

## 3. 事件三个阶段

### 3.1 三个阶段

1. 捕获阶段
2. 当前目标阶段
3. 冒泡阶段 ：事件开始由最具体的元素接受，然后逐级向上传播 

### 3.2 查看当前的阶段

`事件对象.eventPhase`属性可以查看事件触发时所处的阶段





## 4. 事件委托

利用事件冒泡的原理，让自己的所触发的事件，让他的父元素代替执行！ 



## 5. 事件对象

### 5.1 获取事件源

```js
event = event.target || event.srcElement
```

### 5.2 阻止事件冒泡

- 标准方式 event.stopPropagation();
- IE低版本 event.cancelBubble = true;     // 标准中已废弃 

### 5.3 阻止默认事件

- 标准方式：event.preventDefault() 
- IE低版本：event.returnValue = false; 



## 6. 常用的鼠标和键盘事件 

- onmouseup 鼠标按键放开时触发
- onmousedown 鼠标按键按下触发
- onmousemover 鼠标移动触发
- onkeyup 键盘按键按下触发
- onkeydown 键盘按键抬起触发 





## 7. target和currentTarget 

target始终指向事件目标（触发的对象），而currentTarget指向正在处理当前事件的对象（绑定事件的对象）。

例如给按钮的父节点添加事件，点击按钮触发事件时， target指向按钮，currentTarget指向父节点。 





























