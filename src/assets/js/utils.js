// import Vue from 'vue'
// import axios from 'axios'

require('./base64.js')
var GlobalVar = function() {
    return this || (0, eval)("(this)")
}();
GlobalVar.Gshec = /^1(3|4|5|7|8)\d{9}$/, GlobalVar.Gchec = /^[0-9]*[1-9][0-9]*$/;

export default{
    install(Vue,option){
        Vue.prototype.get_unix_time=function(e) {
            var t;
            if (e) {
                var n = e.replace(/-/g, "/");
                t = new Date(n)
            } else t = new Date;
            return t.getTime().toString()
        },
        Vue.prototype.getDateTime=function(e) {
            var t;
            t = e ? new Date(parseInt(e)) : new Date;
            var n = t.getFullYear(),
                a = t.getMonth() + 1,
                r = t.getDate(),
                o = t.getHours(),
                i = t.getMinutes(),
                s = t.getSeconds(),
                c = [];
                a >= 10 || (a = "0" + a), r >= 10 || (r = "0" + r), o >= 10 || (o = "0" + o), i >= 10 || (i = "0" + i), s >= 10 || (s = "0" + s), c[0] = n, c[1] = a, c[2] = r, c[3] = n + "-" + a, c[4] = a + "-" + r, c[5] = o + ":" + i, c[6] = n + "-" + a + "-" + r + " " + o + ":" + i + ":" + s, c[7]=a + "-" + r + " " + o + ":" + i + ":" + s;
            return c;
        },
        Vue.prototype.getUrlParam=function(e) {
            var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
                n = window.location.search.substr(1).match(t);
            return null != n ? unescape(n[2]) : null
        },
        Vue.prototype.phoneFormat=function(n) {
            var w=n.split('');
            w.splice(3,0,' ');
            w.splice(8,0,' ');
            w=w.join('');
            return w;
        },
        Vue.prototype.filterLevel=function(level){
            var levelArr=['','（特级）','','','','','',''];
            return levelArr[parseInt(level)];
        },
        Vue.prototype.AJAX=function(url,data,success,closeLoad,closeBase64){
            // data数据格式
            // {
            //     userInfo:{用户信息
            //         'token':'',
            //         'timestamp':'',
            //         'applicationID':'',
            //         'userId':''
            //     },
            //     param:{//接口参数

            //     }
            // }
            var xhr,index,postData=data.params || {};
            !closeLoad&&(index=layer.open({type: 2,shadeClose:false,shade: 'background-color: rgba(255,255,255,0)'}));

            const error=function(data){//错误处理
                if(data.code=="671"){
                    Jsborya.dialog({
                        content:"登录已过期，请重新登录",
                        btn:['确定'],
                        code:'671',
                        yes:function(){
                            console.log(1);
                        }
                    });
                }else if(data.code=="2000"){
                    Jsborya.updateVersion(data.data);
                }else if(data.code=="687"){
                    var tips='',merchantAttribute=data.data.merchantAttribute;
                    if(merchantAttribute==1){
                        if(data.data.isMain==1){
                            tips='您当前没有权限售卖<b class="yellow">联通号卡</b><br>是否申请该权限？';
                        }else{
                            tips='您当前没有权限售卖<b class="yellow">联通号卡</b><br>请联系您的主账号申请该权限';
                        }
                    }else if(merchantAttribute==2){
                        if(data.data.isMain==1){
                            tips='你当前没有权限售卖<b class="purple">远特号卡</b><br>是否申请该权限？';
                        }else{
                            tips='你当前没有权限售卖<b class="purple">远特号卡</b><br>请联系您的主账号申请该权限';
                        }
                    }
                    layer.open({
                        title:'提示',
                        content:'<span style="line-height:1.2;">'+tips+'</span><p style="text-align:left;font-size:11px;" class="red">注：冰激凌套餐仅限北京及周边地区商户申请售卖，其他地市商户即将开放申请，敬请期待。</p>',
                        btn:['确定','取消'],
                        type:1,
                        style:'width:90%;top:-40px;',
                        yes:function(){
                            data.data.isMain==1 ? Jsborya.pageJump({
                                url:"",
                                stepCode:"2005",
                                depiction:"售卡申请",
                                data:{
                                   merchantAttribute:merchantAttribute,
                                }
                            }) : Jsborya.pageBack({
                                url:"index.html",
                                depiction:"号板",
                                isLoad:true,
                            });
                        }
                    });
                }else if(data.code=="678"){
                    layer.open({
                        title:'提示',
                        content:'订单超时已关闭',
                        btn:['返回选号','取消'],
                        yes:function(){
                            Jsborya.pageJump({
                                url:"index.html",
                                depiction:"号板",
                                stepCode:'2001'
                            })
                        }
                    });
                }else if(data.code=="649"){//激活提示
                    Jsborya.dialog({
                        content:"",
                        btn:[],
                        code:'649'
                    });
                }else if(data.code=="681"){
                    layer.open({
                        title:'提示',
                        content:'当前有未处理订单，是否处理订单？',
                        btn:['处理订单','取消'],
                        yes:function(){
                            Jsborya.pageJump({
                                url:"index.html",
                                depiction:"号板",
                                stepCode:'2001'
                            })
                        }
                    });
                }else{
                    layer.open({
                        content:data.msg||data,
                        skin: "msg",
                        msgSkin:'error',
                        time: 4
                    });
                }
            };
            
            postData.token=data.userInfo.token;
            postData.timestamp=data.userInfo.timestamp;
            postData.applicationID=data.userInfo.applicationId;
            postData.userId=data.userInfo.uid;
            postData = !closeBase64 ? BASE64.encode(JSON.stringify(postData)) : JSON.stringify(postData);
            
            XMLHttpRequest ? xhr=new XMLHttpRequest() : xhr=new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('POST',url,true);
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=utf-8');
            xhr.setRequestHeader('Accept','application/json,text/javascript;q=0.01');
            xhr.send(postData);

            xhr.onreadystatechange=()=>{
                if(xhr.readyState===4){
                    closeLoad ? typeof closeLoad==='function'&&closeLoad() : layer.close(index);
                    if(xhr.status>=200&&(xhr.status<300 || xhr.status===304)){
                        try{
                            var responseText=JSON.parse(xhr.responseText);
                            responseText.code=='200' ? success(responseText) : error(responseText);
                        }catch(e){
                            console.log(e);
                            error('数据解析错误');
                        }
                        
                    }else{
                        if(xhr.status===504||xhr.status===500){
                            error('服务器异常');
                        }else if(xhr.status===200){
                            error('服务器响应错误');
                        }else if(xhr.status===404||xhr.status===0){
                            error('服务器地址错误');
                        }else{
                            error(xhr.statusText+xhr.status);
                        }
                        
                    }
                }
            };
            
            // axios.post(url,postData).then((response) => {
            //     closeLoad ? typeof closeLoad==='function'&&closeLoad() : layer.close(index);
            //     response.data.code=='200'||response.data.code=='681'||response.data.code=='678' ? success(response.data) : error(response.data)
            // }).catch((response)=>{
            //     error(
            //         response instanceof Error ? {
            //             'code':999,'msg':response.message
            //         } : {
            //             'code':999,'msg':response.status
            //         }
            //     )
            //     closeLoad ? typeof closeLoad==='function'&&closeLoad() : layer.close(index);
            // })
        };
    }
}
