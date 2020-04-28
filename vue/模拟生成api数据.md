# 模拟生成api数据
## 在线生成
* 在项目开发过程中，后端的接口往往是较晚才会出来，于是前端的许多开发都要等到接口才能进行。这就影响前端开发的进度，显得十分被动。所以前端人员需要制造一些模式数据来测试后端的接口，有没有现成的插件呢？这里介绍一款非常强大的插件Mock.js，可以非常方便的模拟后端的数据，也可以轻松的实现增删改查这些操作。所以前端的开发时，只需要和后端提前对接好接口文档就可以进行开发。
* [mock.js官网](http://mockjs.com/)
### CDN导入的方式
* 导入`mockjs`以及请求的`axios`
    ```js
     <script src="https://cdn.bootcss.com/Mock.js/1.0.1-beta3/mock-min.js"></script>
     <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
    ```
* 配置mock的接口
    * 随机生成的方式
      ```js
        Mock.mock('http://127.0.0.0:5050/BrandCase/getList', {
            "list|5-10": [{
                'id|+1': 0,
                'name': '@cname', //中文名称
                'ctime': '@date("yyyy-MM-dd")', //日期 
             }]
         })
       ```
    * 固定生成的方式
      ```js
        var arr = [
            { name: '香奈儿', ctime: new Date(),id: 1},
            { name: '小CK', ctime: new Date(),id: 2},
            { name: 'HM', ctime: new Date(), id: 3 },
            { name: 'YSL', ctime: new Date(), id: 4}
            ]
        Mock.mock('http://127.0.0.0:5050/BrandCase/getList', {
            "list": arr
        })
       ```  
    * 模拟增加数据的方式
    ```js
        Mock.mock('http://127.0.0.0:5050/BrandCase/add', 'post', function (options) {
            var data = JSON.parse(options.body);
            var id = parseInt(arr[arr.length-1].id)+1;
            arr.push({id:id,name:data.name,ctime:data.ctime})
            return arr;
        })     
    ```
    * 模拟删除数据的方式
    ```js
        Mock.mock('http://127.0.0.0:5050/BrandCase/delete', 'post', function (options) {
            var data = JSON.parse(options.body);
            var id = parseInt(data.id);
            var index;
            for (var i in arr) {
                if (arr[i].id === id) { 
                    index = i
                    break;
                }
            }
            arr.splice(index, 1)
            return arr; 
        });
    ```
* 请求数据
    * 配置根路径：`axios.defaults.baseURL='http://127.0.0.0:5050'`
    * 获取数据
    ```js
        axios.get('/BrandCase/getList').then(function (response) {
            console.log(response)
            _this.list = response.data.list;
        }).catch(function (error) {
            console.log(error);
        });
    ```
     * 增加数据
    ```js
        axios.post('/BrandCase/add',{name:_this.name,ctime:new Date()}).then(function (response) {
            console.log(response)
            _this.list = response.data.list;
        }).catch(function (error) {
            console.log(error);
        });
    ```
     * 删除数据
    ```js
        axios.post('/BrandCase/delete',{id:id}).then(function (response) {
            console.log(response)
            _this.list = response.data.list;
        }).catch(function (error) {
            console.log(error);
        });
    ```
    
### npm的方式
* 步骤：
    * 下载mockjs
        * 全局安装：`npm i -g mockjs` 
        * 本地安装：`npm i --save mockjs` 
    * 创建Mock.js,用于生产模拟api
        * 具体的匹配规则：在[官网的示例](http://mockjs.com/examples.html)部分讲的很清楚 
      ```js
        import Mock from 'mockjs'
         //模拟后台
         Mock.mock('data/test', {
             "user|5-10": [{
             'name': '@cname',   //中文名称
             'age|1-100': 100,   //100以内随机整数
             'birthday': '@date("yyyy-MM-dd")',  //日期
             'city': '@city(true)'   //中国城市
             }]
        });
        ```
    * 发送ajax请求
       ```js
        import axios from 'axios'
        import './Mock.js'
        axios.get('/data/index')
             .then(function (response) {
             console.log(response)
         })
            .catch(function (error) {
             console.log(error);
         });
        ```
 
 ## 本地生成
 * json-server
 * 安装： 全局安装：`cnpm install -g json-server` 
 * 在项目根目录下创建`db.json`文件，里面写了请求结果的json数据
 * 启动json-server：`json-server db.json` 
 ### 测试接口的软件
    * postman
        
       