User-center RESTful API Document
===
![jwi](http://www.jwis.cn/web_file/images/logo2.png "jwi logo")  

> Copyright(c) afterloe. ISC Licensed  
> Version: v0.0.4
> ModifyTime: 2016-10-19 22:30:43
> Authors:   
    afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)  
> Host:  
    http://192.168.1.204/service/usercenter

## Overview  
1. [Https request](#Https_request)  
    1.1 [发起参数](#Https_request_1)
2. [Https response](#Https_response)  
    2.1 [发起参数](#Https_header_1)
3. [User](#User)  
    3.1 [登录](#User_1)  
    3.2 [注册](#User_2)  
    3.3 [注销](#User_3)  
    3.4 [校验TOKEN有效性](#User_4)  
    3.5 [获取用户信息](#User_5)    
    3.6 [个人信息](#User_6)     
    3.7 [修改个人基本信息](#User_7)  
    3.8 [绑定邮箱或手机](#User_8)  
    3.9 [修改密码](#User_9)  
    3.10 [修改头像](#User_10)  
    3.11 [找回密码](#User_11)  
3. [Administrators](#Administrators)  
    3.1 [用户列表](#Administrators_6)  
    3.2 [拉黑用户](#Administrators_7)  
    3.3 [查看用户详情](#Administrators_8)  
4. [Security](#security)  
    4.1 [校验图片验证码 - 改密](#Administrators_6)  
    4.2 [校验安全码 - 授权](#Administrators_7)  
    4.3 [校验安全码 - 授权 - 常用](#Administrators_8)  
5. [Mapping](#Mapping)

-------------

### [Https request](#Https_request)
```json
{
    "ei": "设备ID",
    "user-agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36",
    "token" : "登陆认证",
    "Accept-Language":"en-US,zh-CN",
    "注意" : {
        "language": "en-US,zh-CN 将会在下一个大版本中删除,当前版本支持,请更换到最新的"
    }
}
```

### [Https response Object](#Https_response)
```json
{
    "code" : "执行状态码",
    "error": "执行失败时的错误信息",
    "result" : "返回的数据[可能是对象，可能是字符串]"
}
```

### [Request Header](#Https_header)

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" --request GET https://192.168.1.205:10050/ -k

{"code":200,"error":null,"result":{"server":"tru.jwis.cn","auth":"afterloe","mail":"afterloeliu@jwis.cn","qq":"60728727@qq.com","language":"en-US","appName":"cynomy_market"}}
```

-------------

### [User](#User)
+ [登录](#User_1)  
PUT /user/signIn

```json
{
    "mail":"邮箱",
    "phoneNum":"手机号",
    "password":"密码",
    "注意":"邮箱和手机号只能传递一个，如果同时传递只有mail有效"
}
```  

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" --request PUT -d "mail=afterloeliu@jwis.cn" -d "password=123456a" https://192.168.1.205:10050/user/signIn -k

{"code":200,"error":null,"result":{"token":"eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==","user":{"_id":"58009372e16ced5ce18de1bf","nickname":"TRU16398092","mail":"afterloeliu@jwis.cn","phoneNum":null,"id":10034}}}

curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" --request PUT -d "mail=afterloeliu@jwis.cn" -d "password=123456a" https://192.168.1.205:10050/user/signIn -k
{"code":"400","error":"account or password is Error ","result":null}
```  

+ [注册](#User_2)  
POST /user/signUp  

```json
{
    "mail": "注册邮箱",
    "phoneNum": "手机号",
    "password": "密码 -- 6位以上包含字母",
    "verificationCode": "验证码",
    "注意": "邮箱号和手机号必须有一个，如果同时传只有mail有效"
}
```  

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" --request POST -d "verificationCode=124986" -d "nickName=afterloe" -d "mail=afterloeliu@jwis.cn" -d "password=123456a" https://127.0.0.1:10050/user/signUp -k

{"code":200,"error":null, "result":null}

curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" --request POST -d "verificationCode=LcYAc8O5" -d "nickName=afterloe" -d "mail=afterloeliu@jwis.cn" -d "password=123456a" -i https://192.168.1.205:10050/user/signUp -k

{"code":500,"error":"security code error","result":null}
```

+ [注销](#User_3)  
PUT /user/signOut

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" --request PUT https://192.168.1.205:10050/user/signOut -k

{"code":200,"error":null,"result":null}
```

+ [校验TOKEN有效性](#User_4)  
GET /user/validateLogon

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:ohd0jfHUubPnslROQr5QCDDH+YaL+0q8l251Xht8vW7SGHBcLDSDzsK8FMD8P6My4PC5V1WXW+WTrSEB28j5Rw==" --request GET https://192.168.1.205:10050/user/validateLogon -k

{"code":200,"error":null}

```

+ [获取用户信息](#User_5)  
GET /user/personal

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:ohd0jfHUubPnslROQr5QCDDH+YaL+0q8l251Xht8vW7SGHBcLDSDzsK8FMD8P6My4PC5V1WXW+WTrSEB28j5Rw==" --request GET https://192.168.1.205:10050/user/personal -k

{"code":200,"error":null,"result":{"nickname":"TRU16398092","phoneNum":null,"mail":"afterloeliu@jwis.cn","job":null,"contribution":0,"gender":null,"company":null,"synopsis":null,"target":[],"joinDate":"2016-10-14 16:12:34","lastLoginDate":"2016-10-19 17:48:02","avatar":"http://192.168.1.205:10080/images/weipiaoer.png"}}

```

+ [个人信息](#User_6)  
GET /personal/my  

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" --request GET https://192.168.1.205:10050/personal/my -k

{"code":200,"error":null,"result":{"nickname":"TRU16398092","phoneNum":null,"mail":"afterloeliu@jwis.cn","job":null,"contribution":0,"gender":null,"company":null,"synopsis":null,"target":[],"joinDate":"2016-10-14 16:12:34","lastLoginDate":"2016-10-19 17:48:02","avatar":"http://192.168.1.205:10080/images/weipiaoer.png"}}
```

+ [修改个人基本信息](#User_7)  
PUT /personal/my

```json
{
 "nickname": "昵称",
 "gender" : "性别",
 "job" : "工作",
 "company": "公司",
 "synopsis": "简介"
}
```

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" -d "nickname=afterloe" -d "gender=男" -d "job=technical consultant" -d "company=JW Innovation Software (Shenzhen)Ltd" -d "synopsis=full development engineer of JW Innovation Software (Shenzhen)Ltd" --request PUT https://192.168.1.205:10050/personal/my -k

{"code":200,"error":null}
```

+ [绑定邮箱或手机](#User_8)  
PUT /personal/binding

```json
{
 "to" : "手机或邮箱"
}
```

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" -d "to=13266548013" --request PUT https://192.168.1.205:10050/personal/binding -k

{"code":200,"error":null}
```

+ [修改密码](#User_9)  
PUT /personal/revise/password

```json
{
 "oldpw": "旧密码",
 "newPassword" : "新密码"
}
```

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" -d "oldpw=123456a" -d "newPassword=123456" --request PUT https://192.168.1.205:10050/personal/revise/password -k

{"code":200,"error":null}
```

+ [修改头像](#User_10)  
POST /personal/revise/avatar

```json
{
 "avatar" : "头像　图片二进制文件"
}
```

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" -F "avatar=@E:/图片/084673FF86422F1B460971C73221F6E7.jpg;type=application/octet-stream" --request PUT https://192.168.1.205:10050/personal/revise/avatar -k

{"code":200,"error":null}
```


+ [找回用户密码](#User_8)  
PUT /user/retrieve  

```json
{
    "newPassword":"符合规则的新密码",
    "注意":{
        "pc":"在执行找回密码之前请先进行 [图片验证码校验] 的接口，然后系统会向图片校验的接口中的to发送安全码，使用该安全码调用 [安全码校验] 接口获得改密许可。最后调该接口进行改密，否则会出现authentication fail 授权失败的异常，授权只能维持5分钟。改密之后授权自动取消",
        "移动":"在执行找回密码之前请调用 [发送安全码] 的接口获取安全码，接着调用 [校验安全码 - 授权 - 常用] 接口获取到改密许可。最后调用改接口进行改密，否则会出现authentication fail 授权失败的异常，授权只能维持5分钟。改密之后授权自动取消"
    }
}
```

```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:ohd0jfHUubPnslROQr5QCDDH+YaL+0q8l251Xht8vW7SGHBcLDSDzsK8FMD8P6My4PC5V1WXW+WTrSEB28j5Rw==" --request PUT https://192.168.1.205:10050/user/retrieve -i -k

{"code":200,"error":null,"result":null}

curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:ohd0jfHUubPnslROQr5QCDDH+YaL+0q8l251Xht8vW7SGHBcLDSDzsK8FMD8P6My4PC5V1WXW+WTrSEB28j5Rw==" --request PUT https://192.168.1.205:10050/user/retrieve -i -k

{"code":500,"error":"authentication fail","result":null}
```
### Security

+ [用户列表](#Administrators_1)  
GET /manager/user/list/:order/:pageNum/:page  
```json
{
  "order": "排序倒序 time 创建时间, login 登录时间",
  "pageNum":"展示多少条",
  "page": "页数-- 从1开始"
}
```
```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" --request GET https://192.168.1.205:10060/manager/user/list/time/100/0 -k
```

+ [拉黑用户](#Administrators_2)  
DELETE /manager/:userId  
```json
{
  "userId" : "被拉黑的用户id"
}
```
```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" --request DELETE https://192.168.1.205:10060/manager/10033 -k
```

+ [查看用户详情](#Administrators_3)  
GET /manager/:userId  
```json
{
  "userId" : "被查看的用户id"
}
```
```bash
curl -H "ei:A4EB32A2-C979-4E12-8777-8DDC61CC2ADA" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 BIDUBrowser/8.4 Safari/537.36" -H "Accept-Language:en-US,zh;q=0.8" -H "token:eoDs8UR3WXRhS3pFPdLVBp3nVG1ccSKc8zpIxO5haw5URuYHUwrlyjhhxr20qNWq1Xdc+tbMtwKKgk/bbWG/Lg==" --request GET https://192.168.1.205:10060/manager/10033 -k
```

### Security
+ [校验图片验证码 - 改密](#Security_1)  
GET /security/auth/:to/:code

```json
{
    "to":"申请校验修改密码的用户",
    "code":"验证码"
}
```
```bash
$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/auth/afterloeliu@jwis.cn/45dF -k -i

{"code":200,"error":null,"result":null}

$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/auth/afterloeliu/45dF -k -i

{"code":500,"error":"unsupported identity","result":null}

$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/auth/afterloeliu@2980.com/45dF -k -i

{"code":500,"error":"phone or mail is not registered","result":null}

```
+ [校验安全码 - 授权](#Security_2)  
GET /security/vSecurityCode/:code  

```json
{
    "code":"安全码"
}
```
```bash
$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/vSecurityCode/458913
-k -i

{"code":200,"error":null,"result":null}

$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/vSecurityCode/458913
-k -i

{"code":200,"error":"security code error","result":null}

```
+ [校验安全码 - 授权 - 常用](#Security_3)  
GET /security/vSecurityCode/:to/:code  

```json
{
    "to": "申请授权的用户标识【手机】【邮箱】",
    "code": "安全码"
}
```bash
$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/vSecurityCode/afterloeliu@jwis.cn/458913 -k -i

{"code":200,"error":null,"result":null}

$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/vSecurityCode/afterloeliu@jwis.cn/458913 -k -i

{"code":200,"error":"security code error","result":null}

$ curl -H "ei:10010" --request GET https://192.168.1.205:10050/security/vSecurityCode/afterloeliu@jwis.cn/458913 -k -i

{"code":200,"error":"authentication fail","result":null}