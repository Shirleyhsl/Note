# 笔记
* 视频来源[最全的vue.js视频【黑马程序员】](https://www.bilibili.com/video/av36650577/)

## nrm的安装与使用
* 作用：提供了一些最常用的NPM包镜像地址，能够让我们快速的切换安装包时候的服务器地址
* 什么是镜像：原来包一开始是存在国外的NPM服务器上，由于网络原因，经常访问不到，这时候，我们可以在国内，创建一个和官网完全一样的NPM服务器。数据都是从这里拿过来的。除此之外，使用方式完全一样
* 安装
    * 运行`npm i nrm -g`全局安装`nrm`包
    * 使用`nrm list`查看当前所有可用的镜像地址以及当前使用的镜像源地址
    * 使用`nrm use npm`或`nrm use taobao`切换不同的镜像源地址

##  为什么使用webpack
### 在网页中会使用哪些静态资源
* JS
    * .js .jsx .coffee .ts
* css
    * .css .less .sass .scss
* Image
    * .jpg  .png .gif  .bmp  .svg
* 字体文件
    * .svg  .ttf .eot   .woff  .woff2
* 模板文件
    * .ejs  .jade

### 网页中引入静态资源的问题？
* 网页加载速度慢，因为要发起很多二次请求
* 要处理错综复杂的依赖关系

### 如何解决上述两个问题
* 合并、压缩、精灵图、图片的base64编码
* 可以使用requireJs，也可以使用webpack解决各个包之间的关系

### 什么是webpack
* webpack是前端自动化构建工具,它是基于Node.js开发出来的一个前端工具

### 如何完美解决
* 使用gulp
* 使用webpack
* 借助于webpack这个前端自动化构建工具，可以完美实现资源合并、打包、压缩、混淆等情况
* [webpack官网](https://www.webpackjs.com/)

## webpack安装
* 全局安装：`npm i webpack -g`
* 本地安装：`npm i webpack --save`

## webpack项目基本代码
* 建各文件夹目录
* 使用 `npm init -y` 初始化生成 `package.json`配置文件
* 安装第三方依赖包，如`npm install jquery -s`
* 在`main.js`引入包以及书写js代码
    * `import $ from 'jquery'`
* 因为不能识别es6(import)语法 所以需要借助webpack，使用webpack
    * 编译打包：`webpack ./src/main.js -o ./dist/bundle.js`
    * `index.html`中引入`bundle.js` ,然后右击在浏览器中运行
### webpack.config.js配置
* `改进1`:因为这样打包编译命令每次还要写路径，所以可以新建`webpack.config.js`配置打包路径,配置之后使用`webpack`命令就可以打包
    ```js
    const path = require('path');
    module.exports = {
        entry: './src/main.js',
        output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
        }
    };
    ```
* 输入webpack命令执行的时候的流程：
    * 首先，webapck发现我们并没有通过命令的形式，给它指定入口和出口
    * webpack就会去项目的根目录找`webpack.config.js`的配置文件
    * 找到配置文件后，webpack会去解析执行文件，解析执行后就得到了配置文件中导出的配置对象
    * 当webpack拿到配置对象后，就拿到了指定的入口和出口，然后进行打包
    
### webpack-server配置
* `改进2`:每改动一次需要输入命令webpack重新编译生成`bundle.js`，想要保存时自动打包编译需要配置`webpack-server`
1. 本地安装 `npm install webpack webpack-cli webpack-dev-server --save-dev` (webpack4需要安装webpack-cli)
2. 在`package.json`中配置 `"dev":"webpack-dev-server --open --port 3000 --contentBase src --hot"`
    * --open 运行8可以自动打开浏览器
	* --host 192.168.10.1 修改默认打开的IP地址
	* --port 3000 修改端口
	* --contentBase src 指定默认进入src文件夹
	* --hot代码的热更新，特别是改动少的时候会提高性能
3. 修改index.html文件中bundle.js的引用为根目录,因为打包生成的文件会托管到内存，加快效率，所以需要读取根目录下的这个bundle.js文件。
4. 此时就可以在控制台输入`npm run dev `运行项目

## 安装第三方loader——样式loader
* 可以直接在index.html页面通过link的方式引入.css文件，但是这样会发起二次请求，不推荐。
* 在webpack项目中默认只能处理js文件，无法解析.css等样式文件的，需要安装loader进行配置
### 处理.css文件
* 样式模块的loader包括`style-loader` `css-loader`
    1. 安装loader模块: `npm i style-loader css-loader -save-dev`
    2. 配置规则：在`webpack.config.js`文件中新增一个配置节点叫做module,它是一个对象
    ```js
    module:{
        rules:[//存放了所有的第三方模块的匹配规则
            //配置处理以.css结尾的第三方loader规则
            {test:/\.css$/,use:['style-loader','css-loader']},
        ]
    }
    ```
    3. 在main.js中采用import的形式导入文件
### 处理.sass文件
* 样式模块的loader包括`style-loader` `css-loader` `sass-loader`
    1. 安装sass：`cnpm i node-sass --save-dev`
	2. 安装loader模块: `cnpm i style-loader sass-loader --save-dev`
    3. 在`webpack.config.js`的匹配规则中加入匹配规则
    ```js
     {test:/\.sass$/,use:['style-loader','css-loader','sass.loader']},
    ```
    3. 在main.js中采用import的形式导入文件
### 处理.less文件
* 样式模块的loader包括`style-loader` `css-loader` `less-loader`
    1. 安装sass：`cnpm i less --save-dev`
	2. 安装loader模块: `cnpm i style-loader less-loader --save-dev`
    3. 在`webpack.config.js`的匹配规则中加入匹配规则
    ```js
     {test:/\.sass$/,use:['style-loader','css-loader','less.loader']},
    ```
    3. 在main.js中采用import的形式导入文件

## 安装第三方loader——处理字体
* 处理字体需要包括`url-loader`
	1. 安装loader模块: `cnpm i url-loader --save-dev`
    2. 在`webpack.config.js`的匹配规则中加入匹配规则
    ```js
     { test: /\.(ttf|svg|woff|eot|woff2)$/, use:'url-loader'},
    ```
    
## 安装第三方loader——图片
* webpack默认情况下无法处理文件中的URL地址，不管是图片还是字体库，只要是URL地址，都处理不了。
    1. 安装 `cnpm i url-loader -D`
	2. 在`webpack.config.js`的匹配规则中加入匹配规则
    ```js
     {test:/\.(jpg|png|jpeg|bmp)$/,use:'url-loader'},
    ```
* 【优化】参数配置
    * 以这种方式解析到网页中的图片的格式的base64格式，如果我们只想将小图片转换成base64的格式，就需要进行参数配置
	* 在配置规则后面加参数`?limit=1000` 表示只有1000字节以下的图片会使用base64编码
    * 不是采用base64编码的图片会默认进行重命名（为了防止图片重名），如果不想要重命名，保持图片原名称就需要加参数`name={name}.{ext}` (多个参数采用&连接符连接)
	* 当采用第二步的这种做法使得图片保持原名称后，会产生一个问题，两张名字相同的不同图片即使在不同的文件夹导入到网页中，网页中的这两张图片都会被解析成这两张中后导入的图片（webpack打包时会将所有的图片放入根路径，这样两张图片重名了，就会覆盖），解决的办法可以给图片名称前加一个hash值(hash默认32会，可以截取32位中的任意前几位)`name=[hash:8]{name}.{ext} `(多个参数采用&连接符连接)

### webpack处理第三方文件类型的过程
* 如果发现要处理的文件不是js文件，就会去配置文件中，查找有没有对应的第三方loader的匹配规则
* 如果找到对应的规则，就会调用对应的loader处理这种文件类型
* 调用loader的时候，是从后往前调用
* 当最后一个loader调用完毕，会把处理结果直接交给webpack进行打包合并，最终输出到bundle.js中

### Bable
* 在webpack中默认只能处理一部分ES6语法，需要借助第三方loader帮助解析语法，第三方loader把高级的语法转为低级语法之后，会把结果交给webpack打包给bundle.js。通过`Bable`可以帮助将高级语法解析为低级语法
* 视频教程中的webpack版本和babel版本都比较低，在安装的过程中出现了很多问题，新版本的依赖的包不太一样
    * babel舍弃了以前的 babel-- 的命名方式，改成了@babel/-
    * stage-× 已经被弃用，要把babel-preset-stage-0 卸载，然后修改.babelrc文件
* 以下是babel 7.x结合webpack4.x的方法
* 配置
    1. 本地安装依赖包：
        * `@babel/plugin-proposal-class-properties`
        * `@babel/plugin-transform-runtime`
        * `@babel/core`
        * `@babel/preset-env`
        * `@babel/runtime`
        * `babel-loader`
    2. 打开webpack配置文件，在module节点下rules数组中，添加一个新的匹配规则：
    ```js
    {test:/\.js$/,use:'babel-loader', exclude:'/node_modules/'} 
    ```
    * 注意在配置babel的规则时，必须排除node_modules目录,通过exclude选项。因为不排除的话，babel会把node_modules中过的所有第三方JS文件都打包编译，这样会非常消耗CPU，同时打包速度非常慢，而且node_modules下的js文件被打包之后无法正常运行
	3. 在项目根目录中，新建一个叫做`.babelrc`的babel配置文件，属于JSON格式，必须符合JSON语法规范，比如不能写注释，字符串必须双引号
    ```js
    {
        "presets": ["@babel/preset-env"],
        "plugins": [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties"
        ]
    }
    ```









