## BaseCloud-V3 是什么？

`base-cloud-v3`基于`uni-cloud-router`拓展了枚举数据懒加载和类mysql语法的数据库操作能力，内置了常用的拦截器（中间件）模块。
它运行在服务端，可以让熟悉`mysql`的开发者基于类mysql语法，更为友好的编写MongoDb数据库操作代码。这里有两个示例来看看它做了什么：

```javascript
const { Controller } = require("base-cloud-v3");

module.exports = class BookController extends Controller {
	
	constructor(ctx) {
		super(ctx, "baker_book");//当前controller绑定数据表baker_book
	}
	
	//对数据表baker_book基础的保存、修改功能，保存时创建数字自增的_id（兼容高并发场景）
	async save() {
		let start = 1000; //起始ID
		return await this.table.saveAutoId(this.ctx.data, start );
	}
	
	//对数据表baker_book基础的列表查询，并关联了baker_category分类表，查询书籍对应的分类名。
	async list(){
		return await this.table.list({
			select : "name as bookName,author",
			where : {status : 1},
			join : {
				select : "name as categoryId,type",
				from : "baker_category as bc",
				on : "bc._id = categoryId"
			},
			orderBy : "sort asc,createTime desc"
		})
	}
	
}
```

## 都使用类Mysql语法，与clientDb有什么不同？

|base-cloud-v3	|clientDB	|
|--	|--	|
|运行在服务端	|运行在客户端	|
|不需要配置数据库权限	|需配置数据库权限	|
|传统服务端开发思维习惯	|大前端开发思维习惯	|
|学习成本相对较低	|学习成本相对较高	|

> 二者并无绝对的优劣之分，建议开发者深入学习研究后选择使用。

## 云函数基础目录

本项目已内置`uni-cloud-router`，基于`uni-cloud-router`拓展了更丰富的能力，在阅读本项目文档之前，请确保您已对[uni-cloud-router](https://uniapp.dcloud.io/uniCloud/uni-cloud-router)有所了解，如果还没有，那你可得抓紧了。

```javascript
├── package.json
├── index.js // 云函数入口文件
├── config.js // 用于配置应用根目录、拦截器等
├── controller // 用于解析用户的输入，处理后返回相应的结果
|   ├── user.js
├── service (可选) //用于编写业务逻辑层，建议使用
|   ├── user.js
├── enums (可选) //用于编写枚举数据，建议使用
|   ├── UserGender.js
```

### 一、接管云函数

新建云函数`api`后，将以下代码直接复制到`index.js`文件中，让`Router`接管云函数，此处可引入一个配置文件，配置全局的拦截器。

```javascript
'use strict';
const { Router } = require('base-cloud-v3') ;
//引入配置文件，配置拦截器
const config = require('./config.js');
const router = new Router(config);

exports.main = async (event, context) => {
    return router.serve(event, context)
};
```


### 二、修改配置文件

在云函数根目录下，创建`config.js`作为配置文件，将以下代码复制到`config.js`中：

```javascript
const { LoginInter, PermissionInter, ResponseInter} = require("base-cloud-v3");
const uniID = require("uni-id");
module.exports = {
	baseDir: __dirname, // 项目根目录
	middleware: [
		[
			LoginInter({uniID}), // token校验拦截器
			{
				name: "LoginInter", 
				enable: true,
				ignore: []
			}
		],
		[
			PermissionInter(), // 权限校验拦截器
			{
				name: "PermissionInter",
				enable: true,
				ignore: []
			}
		],
		[
			ResponseInter(), // 响应结果统一处理拦截器
			{
				name: "ResponseInter",
				enable: true,
				ignore: []
			}
		]
	]
};

```

上述代码共配置了三个拦截器，用于登录验证、权限验证、默认响应结果等统一拦截处理，不需要的拦截器，可将其`enable`属性设置为`false`。

### 三、引入公共模块

在上面两步中，我们使用了`base-cloud-v3`、`uni-id`两个公共模块，故而为云函数绑定公共模块依赖，对云函数根目录右键选择`管理公共模块依赖`菜单，勾选`base-cloud-v3`、`uni-id`后更新依赖。

### 四、创建Controller

#### 1.创建基础Controller

在云函数根目录下创建`controller`文件夹，创建`goods.js`，编写一个Controller类，只需要继承自`Controller`即可，同时在构造函数中，为当前controller绑定一个数据表，示例如下：

```javascript
const { Controller } = require("base-cloud-v3");

module.exports = class GoodsController extends Controller {
	
	constructor(ctx) {
		//将该controller绑定数据表"base_goods"
		super(ctx, "base_goods");
	}
	
	async list(){
		
	}
	
};

```

此处创建了一个专用于操作`base_goods`数据表的controller，可通过`api/goods/list`访问`list()`方法。其中`api`为当前云函数名称，`goods`为当前controller文件的文件名，`list`为list()函数名。

#### 2.创建自动化Controller

步骤同上，将创建的controller继承对象由`Controller`改为`BaseController`后将开启`13个`操作当前数据表的增删改查接口。
需要注意的是，此时将直接暴露所有操作数据库的接口，实际业务中应在`第二步`中开启权限校验拦截器`PermissionInter`，将对应接口只开放给具有权限的用户。

```javascript
const { BaseController } = require("base-cloud-v3");

module.exports = class GoodsController extends BaseController {
	
	constructor(ctx) {
		//1. 将该controller绑定数据表"base_goods"
		//2. 指定当前数据表中表示用户ID的字段名为userId（不指定时默认为uid）
		super(ctx, "base_goods" , "userId");
	}
	
};

```

15个操作数据库函数清单如下，其中最后6个与用户相关的接口，需要在`第二步`中开启登录校验拦截器使用：

|函数名	|必填参数	|说明	|
|--	|--	|--	|
|info()	|_id	|根据`_id`查询一条数据。	|
|save()	|--	|保存、更新前端传入的数据到数据表，以`_id`字段为标识，数据库中不存在保存，存在则更新。	|
|saveBySort()	|--	|同上，客户端未定义`sort`字段时自动生成排序。	|
|list()	|--	|可选参数较多，详见下方说明。根据前端传入的参数查询列表数据，默认最多查询1000条。	|
|listBySort()	|--	|同上，按`sort`字段排序。	|
|page()	|--	|可选参数较多，详见下方说明。根据前端传入的参数查询分页列表数据。	|
|remove()	|_id	|根据`_id`删除一条数据。	|
|batchRemove()	|where	|根据前端传入的where条件批量删除数据。	|
|clear()	|--	|清空数据表所有数据。	|
|infoByUid()	|_id	|根据`_id`查询一条属于当前用户的数据。	|
|saveByUid()	|--	|基本逻辑同`save()`方法，保存时自动插入当前用户ID字段值，更新时会校验更新的数据是否属于当前用户。	|
|listByUid()	|--	|同`list()`方法，但仅返回属于当前用户的数据列表。	|
|pageByUid()	|--	|同`page()`方法，但仅返回属于当前用户的分页数据。	|
|removeByUid()	|_id	|同`remove()`方法，但是删除的数据不属于当前用户则无法删除。	|
|batchRemoveByUid()	|where	|同`batchRemove()`方法，但只会批量删除属于当前用户的数据。	|

例如：前端调用`api/goods/info`则直接会访问`goods.js > info()`。

### 五、操作数据库

在已绑定数据表的controller的函数中，可直接使用以下方法来操作数据库。

#### 1.1 保存、更新数据

传入即将入库的json数据作为参数，以`_id`字段为标识，若数据库中不存在则保存，存在则更新，同时会自动插入`createTime`、`updateTime`两个字段，记录创建时间和更新时间。

```javascript
let data = {a:1} ; //保存入库的数据，未定义时使用this.ctx.data
let saveData = { status : 1 } ; //保存时自动插入的数据
let updateData = { count : 1000 } ; //更新时自动插入的数据
let appendData = {saveData , updateData} ; //额外追加的数据
await this.table.save(data , appendData );
```

#### 1.2 更新数据

含有`_id`的数据入库时，执行更新一条数据的操作。

```javascript
let data = {_id:"xxxx" , name : "王小二"} ; //入库的数据必须含有_id字段，未定义data时将使用this.ctx.data
await this.table.update(data);
```

#### 1.3 更新并返回当前这条数据

含有`_id`的数据入库时，执行更新一条数据的操作，然后返回数据库中更新后的数据，原子性操作。

```javascript
let data = {_id:"xxxx" , name : "王小二"} ; //入库的数据必须含有_id字段
let returnData = true ; //更新后返回被更新的这条完整的数据
let dataInDb = await this.table.update(data , returnData);
console.log(dataInDb);
```


#### 1.3 插入数据

直接向数据表内插入一条或多条数据，并在插入完成后向原始数据中注入对应的已入库数据的`_id`字段。

```javascript
//1.插入一条数据
let data = {name : "王小二"} ; //入库的数据必须含有_id字段，未定义data时将使用this.ctx.data
let count = await this.table.add(data);
//count:1 插入数据的条数
//data:{ _id : "xxxxxxx" , name : "王小二"} //data中已注入入库的_id字段

//2.插入多条数据
let data = [ {name : "王小二"} , {name : "王大力"} ] ;
let count = await this.table.add(data);
//count:2 插入数据的条数
//data:[ { _id : "xxxxxxx1" ,name : "王小二"} , { _id : "xxxxxxx2" ,name : "王大力"} ]  //data中已注入入库的_id字段
```



#### 2. 原子性自增id数据保存

`saveAutoId()`方法可在保存数据时生成原子性自增ID，支持高并发业务场景，需要注意的是，使用该方法，需要提前在云控制台创建好`base_auto_number`数据表（腾讯云，阿里云会自动创建）。
同时，将产生额外的空间费用，根据目前腾讯云的计费标准计算，每插入`100w`条数据，大约增加`13.00`元的费用成本。

```javascript
let data = {a:1} ; //保存入库的数据，未定义时使用this.ctx.data
let start = 1000 ; //自增起始ID，未定义时默认1，仅插入第一条数据时有效。
await this.table.saveAutoId(data , start);

//追加额外数据时
let data = {a:1} ; //保存入库的数据，未定义时使用this.ctx.data
let start = 1000 ; //自增起始ID，未定义时默认1，仅插入第一条数据时有效。
let saveData = { status : 1 } ; //保存时自动插入的数据
let updateData = { count : 1000 } ; //更新时自动插入的数据
let appendData = {saveData , updateData , start } ; //额外追加的数据
await this.table.saveAutoId(data , appendData );

```

#### 3. 查询数据列表

可关联一个或多个数据表进行查询，关联一个时`join`参数为json，关联多个时`join`参数为数组。

```javascript
await this.table.list({
	//unwind : "" ,  //接受一个拆解的数组字段名
	select : "_id,name as goodsName,userId",
	where : {
		status : 1
	},
	join : {
		select : "name as userName,mobile" ,
		from : "uni-id-users as user" , //关联uni-id-users并重命名为user，type为Object、Array时以user作为字段名
		on : "user._id = userId", //此处的user表示from中的uni-id-users
		/**
		 * type 关联数据结果的数据结构类型
		 * 可选值为：Root表示将关联数据结果合并到根节点，
		 * Object表示将关联结果取第一条数据作为json数据返回，
		 * Array表示将关联结果以数组形式返回，默认root。
		 */
		//type : "root" 
	},
	unselect: "userId",//从最终的字段中删减指定字段
	orderBy : "name asc,createTime desc" ,
	limit : 100
});
```

#### 4. 查询分页数据

可关联一个或多个数据表进行查询，关联一个时`join`参数为json，关联多个时`join`参数为数组。

```javascript
let page = await this.table.paginate({
	totalRow : true , //是否返回总页码，默认true。
	pageNumber:1 , //页码
	pageSize : 10 , //分页条数
	
	/**
	 * 动态查询条件，即前端传入查询参数不为空时追加查询条件
	 * 1. 此处追加mobile的equal条件，数据库字段名和前端传入查询参数名均为mobile，二者一致时使用字符串表示。
	 * 2. 此处追加username的equal条件，数据库字段名为username，前端传入查询参数名为name，二者不一致时使用数组表示。
	 */
	eq:["mobile", ["username","name"] ], //等于
	neq:[], //不等于
	like:[],//模糊匹配
	gt:[],//大于
	gte:[],//大于等于
	lt:[],//小于
	lte:[],//小于等于
	in:[],//在数组中
	nin:[],//不在数组中
	
	
	/**
	 * 动态范围查询条件，即前端传入查询参数不为空时追加范围查询条件
	 * 1. 此处追加createTime的>=且<=范围查询条件，数据库字段名为createTime，默认前端传入开始时间和结束时间参数名为：createTimeStart、createTimeEnd
	 * 2. 此处追加的registTime的>=且<=范围查询条件，数据库字段名为registTime，另行制定前端传入的开始时间和结束时间的参数名为：startTime、endTime
	 */
	range:["createTime", ["registTime","startTime","endTime"] ], //大于等于且小于等于
	neqRange:[], //大于且小于
	gteRange:[],//大于等于且小于
	lteRange:[],//大于且小于等于
	
	
	//unwind : "" ,  //接受一个拆解的数组字段名
	select : "_id,name as goodsName,userId",
	where : {
		status : 1
	},
	join : {
		select : "name as userName,mobile" ,
		from : "uni-id-users as user" , //关联uni-id-users并重命名为user，type为Object、Array时以user作为字段名
		on : "user._id = userId", //此处的user表示from中的uni-id-users
		//type : "root" //将关联数据结果合并到根节点，可选值为：Object表示将关联结果取第一条数据作为json数据返回，Array表示将关联结果以数组形式返回，默认root。
	},
	unselect: "userId",
	orderBy : "name asc,createTime desc" 
});
```

返回标准数据结构如下：

```javascript
{
	pageNumber : 1 , //当前页码
	pageSize : 10 , //分页条数
	list : [] , //当前页数据列表
	totalRow : 100 , //总数据条数
	totalPage : 10 , //总页码
	lastPage : false , //是否最后一页
	firstPage : true  //是否第一页
}
```

#### 5. 主键查询

接受`_id`作为参数，若不传入时，将从`this.ctx.data`中取`_id`参数，数据存在时返回`json`，不存在时返回`null`。

```javascript
let _id = "your doc _id" ;
await this.table.findById(_id);
```

另外可以传入一个`json`，定义额外参数。

```javascript
let data = await this.table.findById({
	_id : "your doc _id" , //缺省时为this.ctx.data._id
	select : "name as goodsName,userId", //选取字段
	join : {
		select : "name as userName,mobile" ,
		from : "uni-id-users as user" , //关联uni-id-users并重命名为user，type为Object、Array时以user作为字段名
		on : "user._id = userId", //此处的user表示from中的uni-id-users
		//type : "root" //将关联数据结果合并到根节点，可选值为：Object表示将关联结果取第一条数据作为json数据返回，Array表示将关联结果以数组形式返回，默认root。
	},
	unselect:"userId" //从最终选取的字段中删减指定字段
});
```

#### 6. 查询一条数据

与`findById()`不同的是，可以定义一个`where`参数作为查询筛选条件，定义`orderBy`参数作为排序条件。数据存在时返回`json`，不存在时返回`null`。

```javascript
let data = await this.table.findFirst({
	select : "name as goodsName,userId",
	where : {} ,
	join : {
		select : "name as userName,mobile" ,
		from : "uni-id-users as user" , //关联uni-id-users并重命名为user，type为Object、Array时以user作为字段名
		on : "user._id = userId", //此处的user表示from中的uni-id-users
		//type : "root" //将关联数据结果合并到根节点，可选值为：Object表示将关联结果取第一条数据作为json数据返回，Array表示将关联结果以数组形式返回，默认root。
	},
	unselect:"userId",
	orderBy : "name asc,createTime desc"
});
```

#### 7. 求和、计数查询

指定一个或多个字段进行求和，并统计总数据条数。

```javascript
let {count , nums , amount} = await this.table.sum({
	where : { status : 1 } , //指定筛选范围，未指定时将全表查询
	select : "nums,amount" , //指定求和字段，多个使用英文逗号连接
	countKey : "count" //指定总数据条数字段键名，未指定时默认：count
})

//深层键名字段需使用 as 作为别名
let {count , totalPrice , amount } = await this.table.sum({
	select : "priceData.price as totalPrice,amount" //指定求和字段，多个使用英文逗号连接，深层键名字段需使用 as 作为别名
})

```


使用`count()`方法查询指定数据的数据条数，未定义查询范围时，查询全表数据的条数。
```javascript
let totalCount = await this.table.count(); //全表数据条数

let count = await this.table.count({status : 1}); //status=1的数据的条数 
```



#### 8. 删除一条数据

使用`_id`参数删除数据，若不传入时，则取用`this.ctx.data._id`作为参数。

```javascript
let _id = "your doc _id" ;
let isSuccess = await this.table.remove(_id); //返回是否删除成功 ： true | false
```

#### 9. 批量删除数据

```javascript
let where = {} ; //筛选条件
let isSuccess = await this.table.batchRemove(where); //返回是否删除成功 ： true | false
```


#### 10. 清空数据表

清空数据表内所有数据。

```javascript
let isSuccess = await this.table.clear(); //返回是否删除成功 ： true | false
```



#### 11. 判断唯一值

在保存、新增数据时，对即将入库的数据中的指定字段，进行唯一值校验。验证通过时返回`true`，否则返回`false`。

```javascript
let isUnique = await this.table.isUnique({
	field : "name" , //唯一值校验的字段名，必填
	where:{}, //筛选条件，用于限定数据唯一性的范围，不传入时则全表唯一。
	data : { //即将保存、更新入库的数据，不传入时使用this.ctx.data作为参数
		_id : "your doc _id" , //更新时应包含更新数据的_id字段
		name : "your save name" //即将保存、更新入库的字段
	},
	required : false //设置为false，表示若data.name为空值，则跳过唯一性验证；设置为true时，若为空则抛出异常，默认true。
});
```

#### 12. 插入自增排序字段

在保存、新增数据时，若即将入库的数据中没有排序字段值，则向其中插入自增的排序值，注意此处仅插入自然排序，非原子性自增，不适用于高并发场景。

```javascript
let data = {} ; //即将入库的data数据
await this.table.setSort({
	where：{}, //可选参数，查询最大的排序值时的筛选条件
	data, //可选参数，未定义时将使用this.ctx.data作为参数
	sortKey:"number", //可选参数，排序字段名，未指定时为：sort。
	step : 1 , //可选参数，排序自增步长，默认10（方便自行调整顺序）。
	start : 1 //初始排序值，默认1
})
```

#### 13. 获取动态查询条件

根据前端传入的参数，筛选出非空的值，创建查询条件。注意：这是一个同步函数，调用时不需要`await`修饰符。

```javascript
let data = {mobile:15811111111,name:"王小二"} ; //前端传入的参数，未定义时默认使用this.ctx.data
let where = this.table.getWhere({
	where : {} , //固定静态查询条件,
	/**
	 * 动态查询条件，即前端传入查询参数不为空时追加查询条件
	 * 1. 此处追加mobile的equal条件，数据库字段名和前端传入查询参数名均为mobile，二者一致时使用字符串表示。
	 * 2. 此处追加username的equal条件，数据库字段名为username，前端传入查询参数名为name，二者不一致时使用数组表示。
	 */
	eq:["mobile", ["username","name"] ], //等于
	neq:[], //不等于
	like:[],//模糊匹配
	gt:[],//大于
	gte:[],//大于等于
	lt:[],//小于
	lte:[],//小于等于
	in:[],//在数组中
	nin:[],//不在数组中
	
	
	/**
	 * 动态范围查询条件，即前端传入查询参数不为空时追加范围查询条件
	 * 1. 此处追加createTime的>=且<=范围查询条件，数据库字段名为createTime，默认前端传入开始时间和结束时间参数名为：createTimeStart、createTimeEnd
	 * 2. 此处追加的registTime的>=且<=范围查询条件，数据库字段名为registTime，另行制定前端传入的开始时间和结束时间的参数名为：startTime、endTime
	 */
	range:["createTime", ["registTime","startTime","endTime"] ], //大于等于且小于等于
	neqRange:[], //大于且小于
	gteRange:[],//大于等于且小于
	lteRange:[],//大于且小于等于
}, data );
```

#### 14. 聚合查询

以上操作数据的接口覆盖大多数业务场景，需要编写复杂的聚合查询命令时，可创建聚合查询对象后，根据业务场景，自行编写聚合查询阶段命令。


```javascript
//创建本数据表的聚合查询对象
let agg = this.table.agg(); 

//筛选条件
agg.where({ name : "xxxx" }) ; 

//选取指定字段
agg.select("name as goodsName,price,userId");

//追加字段，详情请参考聚合查询语法：https://uniapp.dcloud.io/uniCloud/cf-database?id=addfields
agg.addFields({
	"myName" : "$name"
});

//移除指定字段
agg.unselect("price,userId");

//指定根节点的数组字段，取数组第一个元素，然后合并到根节点中。
agg.merge("userList");

//截取数组字段
agg.slice({
	"userList" : [0,2] , //从userList字段的第0个元素开始，截取2个元素。
	"orderList" : [5,10], //从orderList字段的第5个元素开始，截取10个元素。
});

//排序
agg.sort("name,createTime desc"); //根据name正序排序，name相同时根据createTime倒序排序。

//拆分数组字段，以下两种写法均可，其他传参用法参考：https://uniapp.dcloud.io/uniCloud/cf-database?id=unwind
agg.unwind("name");
agg.unwind("$name");

//限制返回数据条数
agg.limit(100);

//分页，内部整合了skip、limit
agg.page(pageNumber,pageSize); //pageNumber为页码，从1开始；pageSize为单页条数


//以下为返回聚合操作结果的函数：

//返回列表数据，为空时返回空数组 []
let list = await agg.get();

//返回一条数据，为空时返回null
let data = await agg.getFirst();

//返回分页列表数据，若为空时返回空数组 []
let pageNumber = 1 , pageSize = 10 ;
let pageList = await agg.getPage(pageNumber,pageSize);

//返回具体的数量，如：0、100
let count = await agg.getCount(); 




//以下为未封装命令，详情参考文档https://uniapp.dcloud.io/uniCloud/cf-database?id=%e8%81%9a%e5%90%88%e8%a1%a8%e8%be%be%e5%bc%8f

//https://uniapp.dcloud.io/uniCloud/cf-database?id=project
agg.project();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=bucket
agg.bucket();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=bucketauto
agg.bucketauto();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=count
agg.count();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=geonear-1
agg.geoNear();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=group
agg.group();

//复杂链表：https://uniapp.dcloud.io/uniCloud/cf-database?id=lookup
agg.lookup();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=replaceroot
agg.replaceroot();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=sample
agg.sample();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=skip
agg.skip();

//https://uniapp.dcloud.io/uniCloud/cf-database?id=sortbycount
agg.sortbycount();

```

### 六、公共方法

当多个controller需要调用同一个方法，或绑定A数据表的controller需要操作B数据表的数据时，可通过定义service来调用，同时多个不同的service之间也可以互相调用。

在云函数根目录创建`service`目录，创建`goodsService.js`文件，定义`GoodsService`继承自`Service`类，在构造函数中绑定数据表`base_goods`。

```javascript
const {Service} = require("base-cloud-v3");

module.exports = class GoodsService extends Service {

	constructor(ctx) {
		//1. 将该service绑定数据表"base_goods"
		//2. 指定当前数据表中表示用户ID的字段名为userId（不指定时默认为uid）
		super(ctx, "base_goods" , "userId");
	}
	
};

```

自`v1.2.0`起，`Service`类中已内置`info()`、`findFirst()`等基础函数，此时在任意controller、service中可以使用`await this.service.goodsService.info()`来调用`goodsService.js`中的`info()`方法，如：

```javascript
const { Controller } = require("base-cloud-v3");

module.exports = class OrderController extends Controller {
	
	constructor(ctx) {
		//绑定base_order表
		super(ctx, "base_order");
	}
	
	async saveOrder(){
		//在订单相关的controller中调用商品相关的service方法
		let goodsId = "xxx" ;
		let goods = await this.service.goodsService.info(goodsId);
	}
	
};

```

基础函数清单如下：

|函数名	|必填参数	|说明	|
|--	|--	|--	|
|info()	|_id	|根据`_id`查询一条数据。	|
|save()	|--	|保存、更新前端传入的数据到数据表，以`_id`字段为标识，数据库中不存在保存，存在则更新。	|
|add()	|--	|添加一条数据到数据表	|
|update()	|--	|更新一条数据到数据表，以`_id`字段为标识。	|
|saveBySort()	|--	|同上，客户端未定义`sort`字段时自动生成排序。	|
|list()	|--	|可选参数较多，详见下方说明。根据前端传入的参数查询列表数据，默认最多查询1000条。	|
|listBySort()	|--	|同上，按`sort`字段排序。	|
|remove()	|_id	|根据`_id`删除一条数据。	|
|batchRemove()	|where	|根据前端传入的where条件批量删除数据。	|
|clear()	|--	|清空数据表所有数据。	|

### 七、枚举数据

在云函数根目录中创建`enums`文件夹，创建`UserGender.js`，定义含有`title`、`value`、`key`字段的数组数据，其中`key`字段可根据使用场景选填。

1. `title`: 展示数据时使用，可随意变动；
2. `value`: 存入数据库时使用，通常为数字，不会变动；
3. `key`  : 编写代码时使用，通常为英文，不会变动。

```javascript
const {Enums} = require("base-cloud-v3") ;

module.exports = class UserGenderEnum extends Enums {
	
    constructor(){
		let list = [
            {title : "未知" , value : "0" , "key" : "unknow"} ,
            {title : "男" , value : "1" , "key" : "male" } ,
            {title : "女" , value : "2" , "key" : "female"} 
        ];
        super(list);
    }
	
}
```

在任意controller、service中可以直接使用枚举数据：

```javascript
const { Controller } = require("base-cloud-v3");

module.exports = class UserController extends Controller {
	
	constructor(ctx) {
		super(ctx, "uni-id-users");
	}
	
	//返回UserGender枚举数据列表
	async genders(){
		return {
			list : this.enums.UserGender.list
		};
	}
	
	async list(){
		let list = await this.table.list();
		list.forEach(item=>{
			//根据value获取对应的title，展示给前端
			item.genderName = this.enums.UserGender.title(item.gender) ;
			
			//以下示例只为说明内置方法，在此处无实际意义
			
			//直接使用key属性获取对应的value
			item.gender = this.enums.UserGender.female ; //3
			
			//根据value获取key
			item.genderKey = this.enums.UserGender.key(item.gender) ;
			
			//根据value或key获取数组下标
			item.genderIndex = this.enums.UserGender.index(item.gender) ;
			item.genderIndex = this.enums.UserGender.index(item.genderKey) ;
			
			//根据value或key获取整条枚举数据（包含title、value、key等字段）
			item.genderData = this.enums.UserGender.data(item.gender) ;
			item.genderData = this.enums.UserGender.data(item.genderKey) ;
			
		})
		return { list };
	}
	
};

```



### 八、深入学习

`base-cloud`内置了四个基础拦截器，开发者可通过阅读其逻辑代码，深入了解其运行原理，为未来业务开发提供便利。

[LoginInter()](https://gitee.com/phoooob/base-cloud-v3/tree/master/uniCloud/cloudfunctions/common/base-cloud-v3/src/inters/BaseLoginInter.js)

[PermissionInter()](https://gitee.com/phoooob/base-cloud-v3/tree/master/uniCloud/cloudfunctions/common/base-cloud-v3/src/inters/BasePermissionInter.js)

[HttpInter()](https://gitee.com/phoooob/base-cloud-v3/tree/master/uniCloud/cloudfunctions/common/base-cloud-v3/src/inters/BaseHttpInter.js)

[TranactionInter()](https://gitee.com/phoooob/base-cloud-v3/tree/master/uniCloud/cloudfunctions/common/base-cloud-v3/src/inters/BaseTranactionInter.js)

[ResponseInter()](https://gitee.com/phoooob/base-cloud-v3/tree/master/uniCloud/cloudfunctions/common/base-cloud-v3/src/inters/BaseResponseInter.js)


#### 1. LoginInter()

登录校验拦截器，可接收配置参数如下：

```javascript
loginInter({
	invalidTokenCode : "invalidToken", //token无效时返回的状态码标识
	tokenKey : "uniIdToken", //客户端token字段键名
	uniID : uniID //uniID对象，需引入uni-id公共模块
})
```

#### 2. PermissionInter()

权限校验拦截器，基于`uni-id-users`、`uni-id-roles`数据表的数据进行权限校验，权限数据缓存于用户的token中，用户的`role`中包含`admin`时为超级管理员，不校验权限：

```javascript
PermissionInter()
```

#### 3. ResponseInter()

##### 3.1 响应结果统一处理拦截器，可接收配置参数如下，以下配置为默认配置，可修改为其他的自定义值：

```javascript
ResponseInter({
	codeKey : "code", //状态码键名
	messageKey : "message", //提示信息键名
	success : { //业务响应成功时返回的默认响应结果
		code : "ok" ,
		message : ""
	},
	fail : { //业务响应失败时返回的默认响应结果
		code : "fail",
		message : "操作失败"
	}
})
```

##### 3.2 基于默认响应结果，返回业务响应结果。

```javascript
//1. 返回true、undefined、json、array数据，表示响应成功
return true ;

//2.返回一个字符串或false，表示响应失败
return "错误提示信息" ;
```

##### 3.3 基于默认响应结果，在业务函数中可简化响应结果代码编写：

```javascript

const { Controller } = require("base-cloud-v3");

module.exports = class UserController extends Controller {
	constructor(ctx) {
		super(ctx, "uni-id-users");
	}

	async info() {
		let data = await this.table.info();
		return { data };
	}
	
	async save() {
		let isUnique = await this.table.isUnique({field:"username"});
		if(!isUnique){
			return "用户名已存在" ;
		}
	}

	
};
```

前端访问`api/user/info`接口时，将得到响应结果如下：

```javascript
{
	code : "ok" ,
	message : "" ,
	data : {
		//...
	}
}
```

##### 3.4 当返回字符串时，默认响应结果会处理为业务处理失败的响应。

```javascript
//api > controller > user.js

async save() {
	let isUnique = await this.table.isUnique({field:"username"});
	if(!isUnique){
		return "用户名已存在" ;
	}
	await this.table.save();
}
```

前端访问`api/user/save`接口时，若提交了一个重复的用户名，此时前端收到的响应结果为：

```javascript
{
	code : "fail" ,
	message: "用户名已存在"
}
```

保存更新成功时，前端收到的响应结果为：

```javascript
{
	code : "ok" ,
	message : ""
}
```

#### 4. TransactionInter()

> [注意] 使用该拦截器时，务必保证操作的数据表已创建完成，否则将抛出异常。

开启事务，当抛出异常时，进行回滚。在被拦截的`controller`或`service`中使用`this.ctx.tranaction`可以获取到当前线程中的回滚数据库对象，
基于该对象获取`collection`实例，而后进行`add()`、`update()`操作，需要注意的是事务本身不支持批量增加、修改操作，详见[数据库事务](https://uniapp.dcloud.io/uniCloud/cf-database?id=starttransaction)

```javascript
//在数据表一的controller中
async save(){
	let tCollectionA = this.ctx.transaction.collection(this.table.name); //获取当前集合的事务集合对象，建议设置为代码片段 :)
	await tCollectionA.add({name:"xxx"}); //执行数据表一的添加操作
	await this.service.demoService.update({_id:"docId",name:"cccc"});//执行数据表二的更新操作
}
```

```javascript
//在数据表二的service中
async update(data){
	let tCollectionB = this.ctx.transaction.collection(this.table.name); //获取当前集合的事务集合对象
	let updated = await tCollectionB.doc(data._id).update({name:data.name});//执行数据表一的添加操作
	if(updated == 0){
		throw new Error("操作失败"); //抛出异常时将进行数据库操作回滚
	}
}
```

该拦截器在配置文件中应放在拦截器数组中最后一个位置才有效，如下为`config.js`配置文件中的使用示例：

```javascript
const { LoginInter,  ResponseInter, TransactionInter } = require("base-cloud-v3");
const uniID = require("uni-id");

let code = "systemError" ; //抛出异常触发事务回滚时的反馈给前端状态码，默认：fail
let message = "系统错误" ; //抛出异常无异常信息时的默认反馈信息

module.exports = {
	baseDir: __dirname, // 项目根目录
	middleware: [
		[
			LoginInter({ uniID }), // token校验
			{
				name: "LoginInter",
				enable: true,
				ignore: []
			}
		],
		[
			ResponseInter(), // 响应结果
			{
				name: "ResponseInter",
				enable: true
			}
		],
		[
			TransactionInter(code,message), // 事务
			{
				name: "TransactionInter",
				enable: true,
				match:[ "user/sign/save"]
			}
		]
	]
};

```

#### 5. HttpInter()

禁止通过外网链接访问，只能通过云函数调用。

### 九、客户端调用

#### 1. 使用 uniCloud 访问
```javascript
uniCloud.callFunction({
  name: 'api', // 要调用的云函数名称
  data: {
    action: 'user/login', // 路由地址，对应 controller 下 user.js 的 login 方法
    // 参数列表
    data: {
      // controller 通过 this.ctx.data 获取
      username: 'demo',
      password: 'demo',
    },
  },
})
```

#### 2. 使用 URL 化 request 访问

```javascript
uni.request({
  url: 'xxxxx/api/user/login', // 路由地址，对应 controller 下 user.js 的 login 方法
  data: {
    // controller 通过 this.ctx.data 获取
    username: 'demo',
    password: 'demo',
  },
})
```


### 十、其他

#### 1. 抓取网络图片保存至云存储
```javascript
let url = "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" ; //网络图片链接
let fileName = "baidu.jpg" ; //转储后的文件名
let cdnUrl = await this.$b.fetchImage(url , fileName);
```


#### 2. 通用加密算法

加密算法：将所有`非空参数`按字典序排序，最后加上`秘钥`，进行`md5`加密，然后转`大写`，形成签名字符串。


##### 2.1 获取签名

使用`sign()`函数直接获取签名：


```javascript
let data = { c : 3 , a : 1 , b : 2 , sign : "xxxxx" } ;
let escapeKey = ["sign"] ; //data中不参与签名的键名，默认["sign"]
let join = "&" ; //用于参数拼接的字符串
let secret = "your secret" ; //参与签名的秘钥
let secretKey = "key" ; //秘钥追加到参数后时定义的键名，未定义时不追加

//加密原始字符串： a=1&b=2&c=3&key=your secret
let sign = this.$b.sign ({data , secret , escapeKey , join , secretKey }); //将得到一个32位的大写字符串
```


##### 2.2 签名验证

使用`verifySign()`进行签名验证：


```javascript
let data = { c : 3 , a : 1 , b : 2 , sign : "xxxxx" } ;
let sign = data.sign ; //进行比对的签名
let escapeKey = ["sign"] ; //data中不参与签名的键名，默认["sign"]
let join = "&" ; //用于参数拼接的字符串
let secret = "your secret" ; //参与签名的秘钥
let secretKey = "key" ; //秘钥追加到参数后时定义的键名，未定义时不追加

//加密原始字符串： a=1&b=2&c=3&key=your secret
let isVaild = this.$b.verifySign ({data, escapeKey , secret , join , secretKey , sign}); //true | false 
```


##### 2.3 获取加密原始字符串

使用`getSignStr(data , escapeKey , join)` 函数获取加密字符串，获取后用于使用自定义加密算法加密，例：

```javascript
let data = { c : 3 , a : 1 , b : 2 , sign : "xxxxx" } ;
let escapeKey = ["sign"] ; //data中不参与签名的键名，默认["sign"]
let join = "&" ; //用于参数拼接的字符串
let signStr = this.$b.getSignStr (data , escapeKey , join ); // a=1&b=2&c=3
```
