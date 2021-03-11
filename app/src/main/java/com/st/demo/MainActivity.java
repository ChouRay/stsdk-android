package com.st.demo;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.TextView;

import com.st.sdk.ST;
import com.st.sdk.STListener;


public class MainActivity extends AppCompatActivity implements STListener {

    private TextView tv_link_ip;//连接到的ip
    private TextView tv_link_name;//连接名称
    private TextView tv_link_status;//连接错误状态显示
    private TextView tv_user_count;//账号授权数量

    boolean isProxy = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        tv_link_ip = findViewById(R.id.tv_link_ip);
        tv_link_name = findViewById(R.id.tv_link_name);
        tv_link_status = findViewById(R.id.tv_link_status);
        tv_user_count = findViewById(R.id.tv_user_count);

        ST.init(this.getApplication());
        ST.setStListener(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        ST.releaseip();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
            if (isProxy) {
                Intent home = new Intent(Intent.ACTION_MAIN);
                home.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                home.addCategory(Intent.CATEGORY_HOME);
                startActivity(home);
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    public void onBtnLogin(View v){
        String your_st_account = "ttt123";
        String your_st_password = "123123";
        ST.login(your_st_account, your_st_password);
    }

    public void onBtnChangeIp(View v){
        ST.changeip("");
    }

    public void onBtnCloseIp(View v) {
        ST.stopip();
        isProxy = false;
        tv_link_ip.setText("已断开");
        tv_link_name.setText("无连接");
        tv_link_status.setText("");
    }


    @Override
    public void onSTLogined(int code, String json) {
        Log.e("TAG", "onSTLogined code=" + code + ", json:" + json);
        if(code ==0 ){
            tv_link_status.setText("登录成功");
            ST.getAreas();
        } else if (code == 1) {
            tv_link_status.setText("账号密码错误");
        }
    }

    @Override
    public void onIPChanged(int code, String ip, String area, int curr, int total) {
        Log.e("TAG", "onIPChanged code=" + code + ",ip=" + ip + ",area=" + area + ",curr=" + curr + ",total=" +total);
        if (code == 0) {
            // set ui
            isProxy = true;
            tv_link_ip.setText("" + ip);
            tv_link_name.setText("" + area);
            tv_user_count.setText("用量：" + curr + "-" + total);
            tv_link_status.setText("");
        } else if (code == 2) {
            tv_link_status.setText("账号已过期");
        } else if(code == 5) {
            tv_link_status.setText("切换间隔不低于11秒");
        } else if(code == 6) {
            tv_link_status.setText("超出用量");
        }  else if (code == 7) {
            tv_link_status.setText("无可用ip");
        } else {
            tv_link_status.setText("获取ip失败");
        }
    }

    @Override
    public void onSTRelease(int code) {
        Log.e("TAG", "onSTRelease=" + code);
    }

    @Override
    public void onAreasResp(int code, String json) {
        Log.e("TAG", "code=" + code + ", areas=" + json);
    }
}
