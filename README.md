## [Android Root版本SDK(广播版接入)](https://github.com/ChouRay/stsdk-android/tree/main/SDK-App)
通过发送广播的方式来操作SDK，切换ip的功能
- [可以通过autojs代码接入](https://github.com/ChouRay/stsdk-android/blob/main/SDK-App/stsdk_autojs_demo.js)
- 可以通过adb命令直接接入
```
// 登录
adb shell am broadcast -f 0x01000000 -a action.st.login --es username 你的账号 --es password 你的密码
// 切换ip
adb shell am broadcast -f 0x01000000 -a action.st.changeip
// 释放IP（不用了必须释放，否则下次登录会卡5分种连接数）
adb shell am broadcast -f 0x01000000 -a action.st.releaseip
```

## [Android Root版本SDK(Api接入)](https://github.com/ChouRay/stsdk-android/tree/main/SDK-App)
#### 登录
> http://127.0.0.1:8083/login?username=你的账号名&password=你的密码

```
返回
{
	"code": 200,			
	"data": {
		"version": 3,	// 1 普通 2 专享 3 独享
		"usageCount": 18,	// 连接数 总数
		"usingCount": 0,	// 当前用量		
		"username": "xxxxxx",
		"dateOfflineForClient": 1703996290000, // 到期时间	
	}

}

```

#### 切换ip

> 默认url：http://127.0.0.1:8083/changeip
<br>

> 完整url： http://127.0.0.1:8083/changeip?areas=[你选择的城市id]&lineId=[lineId]&hostId=[hostId]
> 参数说明： 
>> areas, 城市id，多个中间用逗号分隔，如： 512,352，521
>> hostId, lineId 切换ip会返回，用于普通版固定ip

```
返回
{
    "code":200            
    "ipName": "浙江-台州电信",
    "addr": "183.149.124.17",                              
	"hostId": 12,	// 普通版固定IP时 请求参数 &hostId=
	"lineId": 32131, // 普通版固定IP时 请求参数 &lineId=
    "usageCount": 18,
    "usingCount": 1,
}
	// 其它code
	405{msg:"切换IP间隔时间需要大于11秒"}
    412{msg:"账号已过期"}
    416{msg:"当前授权已满，请稍后再试"}
    417{msg:"地区或者套餐暂无ip可用，请重试或联系管理员"}
    500服务器错误
```

#### 释放ip（退出时必须调用，以免连接数被占用）

>http://127.0.0.1:8083/releaseip

```
返回
{
	"code": 200,
	"msg": "success",
	"usingCount": 1	// 用量
}
```


#### 停止代理IP(用于停止代理走本地，但不退出软件)

> http://127.0.0.1:8083\stopip

```
返回
{
	"code": 200,
	"msg": "success"	
}
```

#### 获取所有地区列表
> http://127.0.0.1:8083/getareas

```
返回
{
	"code":200,
	"data":[{
		"id":22,		// 省份id
		"isEnable":1,	// 1 可用 ，其它数字不可用
		"pid": 22,		// 省份ID
		"pname": "陕西",	// 省份名称
		"cities":[{
			"id": 279,	// 城市id
			"isEnable": 0,	// 1 可用 ，其它数字不可用
			"lineNum": 12,	// 节点数量
			"cname": "汉中电信", // 城市名称	
		}]
	}]
}

```


### 以上方式皆需要下载安装sdk的apk包[点击下载](https://android-1302225453.cos.ap-guangzhou.myqcloud.com/wzb/ST%E5%8A%A0%E9%80%9F%E5%99%A8SDK1.6.apk)

<br>
<br>

## Android Root版SDK(java接入文档)

### 使用方法：

```
将aar包放入项目libs里面

在build.gradle中加入如下引用
// 建议最好修改下版本名称，避免用到缓存的aar包
implementation (name:'stproxy-release1.x', ext:'aar')

// 需要第三方 Gson 与 OkHttp 库
implementation("com.squareup.okhttp3:okhttp:3.14.9")
implementation 'com.google.code.gson:gson:2.4'

```

### 类： ST
#### 方法：
```
/**
 * 初始化接口
 * @param app
 */
 void init(Application app);
/**
 * 设置接口回调监听
 * @param listener
 */
 void setStLisntener(STListener listener);
```

```
/**
 * 账号登录
 * @param username
 * @param password
 */
 void login(String username, String password);
 
/**
 * 切换ip
 * @param areas 地区代码： 如果有多个地区，则使用逗号隔开如： 1,2,4,6
 */
 void changeip(String areas);

/**
 * 断开代理网络，回到本地网络，但是还没释放ip
 */
void stopip();

/**
 * 释放ip，服务器立马释放授权占用。
 * 如果用户异常退出，如：直接杀进程退出，则服务器会卡3-6分的授权占用
 * 注： 授权，指的是一个账号下购买的单窗口ip数量
 */
 void releaseip();

/**
 * 获取地区
 * 注意: 需要登录后才能调用
 * @param isFilter 是否过滤无效地区或维护中的地区
 */
void getAreas(bool isFilter);
```


### 接口：STListener
#### 方法：
```
/**
 * 登录回调
 * @param code 返回码
 */
 void onSTLogined(int code);

/**
 * 切换ip后的回调
 * @param code 返回码
 * @param ip    代理ip
 * @param area  地区
 * @param curr  占用数量
 * @param total 总数量
 */
 void onIPChanged(init code, String ip, String area, int curr, int total);

/**
 * 释放IP后的回调
 * @param code 返回码
 */
 void onSTRelease(init code);
/**
 * 获取地区后的回调
 * @param code  返回码
 * @param json 地区列表
 */
void onAreasResp(int code, String json);

/**
* ip连接状态监听
* 注意： 这是非UI线程回调
* @param code 返回码
* @param msg  返回消息
*/
void onIPStatusListener(int code, String msg);

```

### code返回码：
#### 公共：
- 1 	网络异常 等错误
- 0 	 成功

#### 登录login：
- 1	账号名/密码错误
- 2	其它错误

```
{
	"usageCount": 100,  // 总连接数
	"usingCount": 0,    // 已用连接数
	"username": "ttt123",   //登录账号
	"dateOfflineForClient": 1637055038000  //账号到期时间
}
```


#### 切换ip：
- 1	获取ip失败
- 2	账号已过期
- 3	用户还未登录
- 5	切换ip太快，至少11秒以上（针对独享）
- 6	超出用量
- 7	无可用ip

#### 获取地区：
```
 {
		"id": 10,   // 代表省份id
		"isEnable": 1,  // 0不可用 1 代表可用， 2 维护中 
		"versionMark": 5,
		"cities": [{
			"id": 122,      // 城市id， changeid时的参数就是这个
			"isEnable": 1,      // 0不可用 1 代表可用， 2 维护中
			"versionMark": 1,   // 无关变量不用管
			"lineNum": 412,     // 线路条数
			"cname": "泰州电信",
			"pid": 10           // 代表省份id
		}],
		"pname": "江苏"
}

```
#### IP连接状态监听：
- 1 ip连接断开，已断网
- 2 账号到期，已断网
