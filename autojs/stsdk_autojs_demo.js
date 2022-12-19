"ui"; 


intent = new Intent(); 
importClass(android.content.ContextWrapper); 
importClass(android.content.IntentFilter);
filter = new IntentFilter(); 
filter.addAction("receive.st.onSTLogined");
filter.addAction("receive.st.onIPChanged"); 
filter.addAction("receive.st.onSTRelease");
filter.addAction("recive.st.onAreasResp");
filter.addAction("recive.st.onIPStatusListener");
 
 ui.layout( 
     <vertical>
        <button id="btnRegister" text="开始监听" /> 
        <button id="btnUnregister" text="注销广播"/> 
        <button id="btnLogin" text="登录" />
        <button id="btnChangeIP" text="切换IP" />
        <button id="btnReleaseIP" text="不用了，须释放IP" />
        <button id="btnGetAreas" text="查看地区列表" />

        <text id="text1"></text>
        <text id="text2"></text>
        <text id="text3"></text>   
        <frame>
            <list id="list">
                <vertical>
                    <text id="name" textSize="16sp" textColor="#000000" text="姓名: {{name}}"/>
                    <text id="age" textSize="16sp" textColor="#000000" text="年龄: {{age}}岁"/>
                </vertical>
            </list>
        </frame>


     </vertical>      
     );  
     
     function formatDate(ts) {
        var date = new Date(ts); 
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();

        return Y+M+D+h+m+s;
     }

     var receiver; 
     ui.btnRegister.on("click",()=>{  
        toastLog("开始监听"); 
 
        ui.run(function(){ 
          new ContextWrapper(context).registerReceiver(receiver=new android.content.BroadcastReceiver({
        
              onReceive: function(context, intent) {                   
                   switch(intent.getAction()) {
                    case "receive.st.onSTLogined":
                        code = intent.getIntExtra("code", -1);                     
                        if (code == 0) {
                            username = intent.getStringExtra("username");
                            dateOffline = intent.getLongExtra("dateOffline",0);
                            usingCount = intent.getIntExtra("usingCount",0);
                            usageCount = intent.getIntExtra("usageCount",0);
                            version = intent.getStringExtra("version");
                            stVersion = version=='1'?'普通版': version=='2'?"专享版" : "独享版";

                            ui.text1.setText("账号："+ username+",账号类型："+stVersion
                                +"\n到期时间：" + formatDate(dateOffline));
                            ui.text3.setText("用量：" + usingCount+"/"+usageCount);
                        } else if(code == 1) {
                            ui.text1.setText("账号或密码错误")
                        }
                        else {
                            ui.text1.setText("登录返回码:"+code)
                        }                      
                        break;
                    case "receive.st.onIPChanged":
                        code = intent.getIntExtra("code", -1); 
                        if(code ==0 ){
                            ip = intent.getStringExtra("ip");
                            area = intent.getStringExtra("area");
                            usingCount = intent.getIntExtra("curr", 0); 
                            usageCount = intent.getIntExtra("total", 0);                         
                            ui.text2.setText("\nIP:"+ip +"\n"+area);
                            ui.text3.setText("用量：" + usingCount+"/"+usageCount);
                        } else if (code == 2) {
                            ui.text1.setText("账号已过期")
                        } else if(code == 3) {
                            ui.text1.setText("您还未登录")
                        } else if (code == 5) {
                            ui.text1.setText("切换ip至少15秒")
                        } else if (code == 6) {
                            ui.text1.setText("超出使用限量")
                        } else if (code == 7) {
                            ui.text1.setText("无可用ip")
                        } else {
                            ui.text1.setText("获取ip失败,code:"+code)
                        }

                        
                        break;
                    case "receive.st.onSTRelease":
                        //toastLog("IP已释放"); 
                        ui.text1.setText("已释放,请重新登录");
                        ui.text2.setText("");
                        ui.text3.setText("");
                        break;
                    case "receive.st.onIPStatusListener":
                        code = intent.getIntExtra("code", 0); 
                        msg = intent.getStringExtra("msg");

                        break;
                   }
              }                      
          }), filter)
       
        }) });
 
 
    ui.btnUnregister.on("click",()=>{   
        ui.run(function(){ 
        if(receiver!=null){           
            new ContextWrapper(context).unregisterReceiver(receiver); 
            toastLog("已取消(注销广播)");     
            receiver=null;            
        }else{ 
            toastLog("没打开广播呢"); 
         }
        }) 
    });

    ui.btnLogin.on('click', ()=> {
        app.sendBroadcast({
            packageName:'com.st.broadapp',
            className:'com.st.broadapp.STProxyReceiver',
            action:'action.st.login',
            extras: {username:'zzz123',password:'123123'}
        });
    });
 
    ui.btnChangeIP.on('click', ()=> {
            app.sendBroadcast({
            packageName:'com.st.broadapp',
            className:'com.st.broadapp.STProxyReceiver',
            action:'action.st.changeip',
            extras: {areas:''}
        });
    });

    ui.btnReleaseIP.on('click', ()=>{
            app.sendBroadcast({
            packageName:'com.st.broadapp',
            className:'com.st.broadapp.STProxyReceiver',
            action:'action.st.releaseip'
        });
    });

    ui.btnGetAreas.on('click', ()=>{
        app.startActivity({
            packageName:'com.st.broadapp',
            className:'com.st.broadapp.MainActivity',       
        });
    });