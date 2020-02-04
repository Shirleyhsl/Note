<!-- TOC -->

- [像素](#像素)
    - [逻辑像素/css像素](#逻辑像素css像素)
    - [css像素](#css像素)
    - [dpr(devicePixelRatio)](#dprdevicepixelratio)
- [viewport(视口)](#viewport视口)
    - [布局视口(Layout Viewport)](#布局视口layout-viewport)
    - [视觉视口(Visual Viewport)](#视觉视口visual-viewport)
    - [理想视口(ideal viewport)](#理想视口ideal-viewport)
    - [视口的设置](#视口的设置)
- [终端交互优化](#终端交互优化)
    - [Tap(300ms延迟)](#tap300ms延迟)
    - [touch](#touch)

<!-- /TOC -->
## 像素
### 逻辑像素/css像素
是为web开发者创造的，在CSS和javascript中使用的一个抽象的层（如px）。每一个CSS声明和几乎所有的javascript属性都使用CSS像素，因此实际上从来用不上设备像素，唯一的例外是screen.width/height
### css像素
设备像素(device independent pixels): 设备屏幕的物理像素，任何设备的物理像素的数量都是固定的（如dp）
### dpr(devicePixelRatio) 
设备像素缩放比 `dpr = 设备像素/CSS像素的比值`
- 计算公式：
```math
1px = (dpr)^2*dp
```
- 获取：`window.devicePixelRatio`

## viewport(视口)

- 移动端的视口分为`布局视口（Layout Viewport）`、`视觉视口（Visual Viewport）`和`理想视口（ideal viewport）`

### 布局视口(Layout Viewport)

- 一般移动设备的浏览器都默认设置了一个 viewport 元标签，定义一个虚拟的布局视口（layout viewport），用于解决早期的页面在手机上显示的问题。iOS, Android 基本都将这个视口分辨率设置为 980px，所以 PC上的网页基本能在手机上呈现，只不过元素看上去很小，一般默认可以通过手动缩放网页。
![layoutView.png](.\images\layoutView.png)
- 影响：页面的css会根据这个值进行适应，影响最终页面的呈现
- 获取布局视口的宽高
    ```js
    document.documentElement.clientWidth(height)
    ```
- 更改布局视口：通过viewport的width值修改
    ```html
    <meta name="viewport" content="width=400">
    ```
- 案例：当页面不设置meta的viewport属性且设置320px*568px的元素时，元素在iphone5的设备中只占约1/3。因为页面默认的度量Viewport属性值为980px。
### 视觉视口(Visual Viewport)

- 视觉视口是用户当前看到的区域，用户可以通过缩放操作视觉视口，同时不会影响布局视口。
![VisualView.png.png](.\images\VisualView.png)

### 理想视口(ideal viewport)
- 理想视口的值其实就是屏幕分辨率的值，它对应的像素叫做设备逻辑像素

### 视口的设置
我们可以使用视口元标签（viewport meta 标签）来进行布局视口的设置。
```html
<meta name="viewport"
    content="width=device-width,initial-scale=1.0,maximum-scale=1, user-scalable = no">
```

## 终端交互优化
### Tap(300ms延迟)
- 来源：移动设备访问web页面都是pc上的页面。在默认的viewpoint（980px）的页面往往都是需要“双击”或“捏开”放大页面。为了确认用户是双击还是单击。safari需要300ms的延迟来判断。而后的iphone也一直沿用这样的设计，后来Android也采用了这种方案
- 解决：使用Tap事件代替click事件
    - 在touchstart/touchend时记录时间、手指位置，在touchend时进行比较，如果手指位置为同一位置（或允许移动一个非常小的位移值）且时间间隔比较短（一般认为300ms），且过程中未曾触发过touchmove，即可认为触发了手持设备上的“click”，一般称为“tap”
- 透传问题
    - 在元素上有一层蒙版，点击时希望蒙版消失。但实际上利用click点击蒙版时，下面的元素的click事件会被触发。原因点击时蒙层消失但点击事件有300ms的延迟，被底下的元素接收了click事件。
- 透传问题解决方案
    - 使用动画效果，过渡300ms的延迟
    - 中间层dom元素的加入，让中间层接收这个“穿透”事件，稍后隐藏
    - “上下”都使用tap，原理上解决tap穿透事件
    - 改用Fastclick的库（通过最新的zepto库已经fixed掉这个bug了）

### touch



    

