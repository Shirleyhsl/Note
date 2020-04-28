# 商城项目
## 制作app组件
1. 完成Header区域，使用了`Mint-UI`的`header`组件
2. 制作底部的Tabber区域，使用的是MUI的Tabber.html
    + 在制作购物车小图标的时候操作会多一些
        * 基本图标可以直接在`icon.html`中复制类名，就可以显示对应的图标
        * 还有些图标在`icon-extra.html`中
            + 把扩展图标的`icon-extra.css`样式和font的`icon-extra.ttf`文件都拷贝到项目中
            + 样式：`<span class="mui-icon mui-icon-extra mui-icon-extra-cart">`
3. 要在中间区域放置一个router-view 来展示匹配到的组件

## 改造tabber为router-link
* 设置路由环境
* 点击tabbar中的路有链接展示对应组件

## 制作首页轮播图 
* 用了`Mint-UI`的`Swipe`组件
    * 默认导入的是没有高度，需要在css中设置高度
* 获取轮播图数据：
1. 使用vue-resuorce
2. 使用vue-resuorece的this.$http.get 获取数据
3. 将获取到数据保存到data上
4. 使用v-for循环渲染每个item

## 改造6宫格样式
使用了`MUI`的`grid-default.html`

## 新闻资讯 页面 制作 
1. 添加新闻资讯的vue模块
2. 绘制界面，使用mui中的`media-list`
3. 使用vue-resource获取数据
4. 渲染真实数据

##实现新闻资讯列表 点击跳转到新闻详情
1. 把列表中的每一项改造为 router-link ,同时在跳转时提供唯一的id标识符
2. 创建新闻详情的组件页面 NewsInfo.vue
3. 在路由模块中，将新闻详情的路由地址和组件页面对应起来

##图片分享区域
* 制作顶部导航栏
    1. 使用了MUI的一个JS组件`tab-top-webview-main.html`
        * 导入 `import mui from "../../src/lib/MUI/js/mui.min.js" `后发现会报错，因为webpack打包生成的bundle.js在严格模式下进行，而mui中有非严格模式的代码。解决方法：去除bundle.js的严格模式执行。过程如下：
        * [修改严格模式的说明](https://www.npmjs.com/package/babel-plugin-transform-strict-mode) 
        ①`npm install --save-dev babel-plugin-transform-strict-mode`
        ②`.babelrc`文件中加入
        ```js
        {
            "plugins": ["transform-strict-mode"]
        }
        ```
        (如果还不行试试.babelrc文件中加入配置`"ignore": ["./src/lib/MUI/js/mui.min.js"]`
    2. 导入MUI后即滑动组件后，发生类名冲突，底部的菜单栏不能点击了。
        * 解决方法，改底部菜单栏的类名，重新写之前的样式。
* 制作图片列表区域的懒加载和缩略图
    1. 在`Mint-ui`官网文档中找到`lazyload` 导入包，html，css模块代码。
        * 导包不能按需导入，要全局导入整个mint-ui包，因为懒加载图片显示不出来
         `import MintUI from 'mint-ui'`;
          `Vue.use(MintUI);` 
          `import 'mint-ui/lib/style.css'`才会生效
    2. 缩略图制作，需要导入`Vue-preview`包。
        * npm装包 `npm i vue-preview -S`
        * 导包 `import VuePreview from 'vue-preview'`
        * 在页面上插入html，jq代码块。可以去[vue-preview github](https://www.npmjs.com/package/vue-preview)看怎么使用。
        ```js
            //导入
            import VuePreview from 'vue-preview'
            Vue.use(VuePreview)
            //组件
            <template>
                <vue-preview :slides="slide1" @close="handleClose"></vue-preview>
            </template>
            export default {
                data () {
                    return {
                        slide1: [
                        {
                            src: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_b.jpg',
                            msrc: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg',
                            alt: 'picture2',
                            title: 'Image Caption 2',
                            w: 1200,
                            h: 900
                        }]
                    }
                },
                methods: {
                    handleClose () {}
                }
            }
        ```
##商品列表

##编程式导航
* 除了使用<router-link>进行跳转之外，还可以使用js进行跳转，即编程式导航。 
* 在注册完组件后，给需要跳转的元素绑定点击事件，在`methods`里定义一个事件，然后方法内部写`this.$router.push('/home/goodlist/'+id);`重定向路由。
##加入购物车
* 绘制小球
* 添加动画
* 小球运动到购物车图标的距离计算
    ```js
        //获取小球的位置
        const ballPosition = this.$refs.ball.getBoundingClientRect();
        //获取购物车数量徽标的位置
        const badgePostion = document.getElementById('cartbadge').getBoundingClientRect();
        //计算需要移动的距离
        const xDist = badgePostion.left-ballPosition.left;
        const yDist = badgePostion.top-ballPosition.top;
        el.style.transform = `translate(${xDist}px,${yDist}210px)`;
      ```
##配置vuex （管理数据）
1.装包->导入包->实例化vuex对象->挂载到vue中
2.实例化
      2.1 对象中的state相当于组件中的data，存储数据
      2.2 如果在组建中想要访问数据，通过this.$store.state.***
      2.3 在子组件中如果想要修改store中的数据，要调用mutation提供的方法，才能操作对应的数据，不推荐直接操作state中的数据因为万一导致了数据的混乱不能快速定位到出错的原因
      2.4 如果子组件想调用mutation的方法，只能能调用this.$store.commit('方法名')操作
      2.5 如果store中的state上的数据，需要对外提供数据时，需要做一层封装，那么，推荐使用getters，如果需要使用getters，则用 this.$store.getters.***
## 使用ngrok将本地地址映射成公网地址
* 下载ngrok
* 打开ngrok输入`ngrok http 80`