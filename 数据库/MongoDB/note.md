## 连接数据库
### 1. 创建数据目录
MongoDB将数据目录存储在`db`目录下。但是这个数据目录不会主动创建，我们在安装完成后需要创建它。请注意，数据目录应该放在根目录下(如： C:\ 或者 D:\ 等 )。
* 在D盘中创建data\db文件夹

### 2. 运行MongoDB服务器
为了从命令提示符下运行MongoDB服务器，你必须从MongoDB目录的bin目录中执行mongod.exe文件。或者将MongoDB目录的bin目录添加到系统环境中。
```shell
D:\>mongod --dbpath d:\data\db
// 或者可以省略路径
D:\>mongod
```

### 3. 连接MongoDB
重新打开一个命令窗口运行`mongo.exe`或者`mongo`命令即可连接上 MongoDB，该命令默认连接本机的MongoDB服务
```shell
D:\>mongo.exe
D:\>mongo
```

## 基本操作
### 1. 查看显示所有的数据库
```shell
> show dbs
```
### 2.切换到指定的数据库
如果没有该数据库会被新建
```shell
> use 数据库名称
```

### 3.查看当前操作的数据库
```shell
> db
```

### 4.插入数据
将数字 10 插入到 runoob 集合的 x 字段中。
```shell
> db.runoob.insert({x:10})
```

### 4.查看
查看runoob集合中的数据
```shell
> db.runoob.find()
```
