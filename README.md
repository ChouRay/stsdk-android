## [Android Root版本SDK autojs实现）](https://github.com/ChouRay/stsdk-android/tree/main/autojs)


## Android Root版SDK(java实现)

### 使用方法：

```
将aar包放入项目libs里面

在build.gradle中加入如下引用
// 建议最好修改下版本名称，避免用到缓存的aar包
implementation (name:'stproxy-release1.x', ext:'aar')

// 需要第三方 Gson 与 OkHttp 库， 我这配置的是这个
implementation 'com.squareup.retrofit2:converter-gson:2.2.0'

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
