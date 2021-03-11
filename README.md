## Android Root版SDK
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
 * 用户登录后才能知道是，普通还是独享的地区
 */
void getAreas();
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
```

### code返回码：
#### 公共：
- 1 	网络异常 等错误
- 0 	 成功

#### 登录login：
- 1	账号名/密码错误
- 2	其它错误

#### 切换ip：
- 1	获取ip失败
- 2	账号已过期
- 3	用户还未登录
- 5	切换ip太快，至少11秒以上（针对独享）
- 6	超出用量
- 7	无可用ip
