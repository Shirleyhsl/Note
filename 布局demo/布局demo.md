<!-- TOC -->

- [页面布局](#页面布局)
    - [两端宽度固定，中间自适应](#两端宽度固定中间自适应)
- [form表单](#form表单)
    - [input中加入搜索按钮](#input中加入搜索按钮)
- [图片](#图片)
    - [图片的基线问题](#图片的基线问题)
- [文本](#文本)
    - [文本溢出](#文本溢出)
    - [多行文本溢出](#多行文本溢出)

<!-- /TOC -->
## 页面布局
### 两端宽度固定，中间自适应
```html
<div class="container">
    <div class="left">左边</div>
    <div class="mid">中间</div>
    <div class="right">右边</div>
</div>
```

- flex布局
    ```css
    .container{
        width:100%;
        display: flex
    }
    .left{
        width:100px;
    }
    .mid{
        flex:1;

    }
    .right{
        width:50px;
    }
    ```

- 定位 + margin
    ```css
    .container{
        width:100%;
        position: relative;
    }
    .left{
        width:100px;
        position: absolute;
        left: 0;
        top: 0;
    }
    .mid{
        margin: 0 50px 0 100px;

    }
    .right{
        width:50px;
        position: absolute;
        right: 0;
        top: 0;
    }
    ```

- 定位 + padding（中间与左右两边重叠，然后设置padding）
    ```css
    .container{
            width:100%;
            position: relative;
        }
        .left{
            width:100px;
            position: absolute;
            left: 0;
            top: 0;
            background-color: teal
        }
        .mid{
            width: 100%;
            padding: 0 50px 0 100px;
            background-color: orangered

        }
        .right{
            width:50px;
            position: absolute;
            right: 0;
            top: 0;
            background-color: violet
        }
    ```

## form表单
### input中加入搜索按钮

![search.png](.\images\search.png)
思路：
- 利用元素的伪类实现，设置伪类背景图片位搜索的图标，设置伪类和背景图片的宽高为页面上搜索图标的宽高。
- 将伪类设置为绝对定位到input表单内
- 为input表单添加适当的padding-left
    ```html
    <form action="" class="searchBox">
        <input type="text" class="search" placeholder="请输入需要搜索的商品">
    </form>
    ```
    ```css
    .searchBox{
        width:100%;
        height: 50px;
        background-color: teal;
        padding-left:10px;
        position: relative;
    }
    .search{
        width:400px;
        margin: 5px;
        height: 40px;
        border-radius: 20px;
        padding-left: 40px;
        color: #666
    }
    .searchBox::before{
        position: absolute;
        left:15px;
        top:8px;
        content: "";
        width:35px;
        height:35px;
        background: url('./search.png') no-repeat;
        background-size: 35px 35px;
    }
    ```

## 图片
### 图片的基线问题
- 设置为块元素
- 将字体大小设置为0
- vertical-align: bottom


## 文本
### 文本溢出
```css
.inaline{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 适配Opera */
    -o-text-overflow: ellipsis;
    /* 适配FireFox 但需要配套对应的xml和js文件，也可以通过JS进行控制 */
    -moz-binding: url("moz-text-overflow.xml#XBLDocument");
}
```
### 多行文本溢出
- 使用于WebKit浏览器或移动端的页面
    ```css
    .box {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }
    ```
- 兼容性代码
    ```css
    /* 比较靠谱简单的做法就是设置相对定位的容器高度，用包含省略号(…)的元素模拟实现； */
    p {
        position:relative;
        line-height:1.4em;
        /* 3 times the line-height to show 3 lines */
        height:4.2em;
        overflow:hidden;
    }
    p::after {
        content:"...";
        font-weight:bold;
        position:absolute;
        bottom:0;
        right:0;
        padding:0 20px 1px 45px;
        background:url(/newimg88/2014/09/ellipsis_bg.png) repeat-y;
    }
    ```
    - height高度真好是line-height的3倍；
    - 结束的省略好用了半透明的png做了减淡的效果，或者设置背景颜色；
    - IE6-7不显示content内容，所以要兼容IE6-7可以是在内容中加入一个标签，比如用<span class="line-clamp">...</span>去模拟；
    - 要支持IE8，需要将::after替换成:after；
