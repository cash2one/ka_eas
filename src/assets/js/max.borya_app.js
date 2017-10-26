/*
	Created By Max 2017-02-07,
	JavascriptBridge With Native
	require base64.js
 */

!function(a,b){
	"function" == typeof define && (define.amd || define.cmd) ? define(function() {
		return b(a)
	}) : b(a);
}(window,function(a){
	var OS=getUserAgent(),URL=getLocalPath();
	
	function getLocalPath(){
		var _url=window.location.href;
		_url=_url.split('.html')[0].split('/');
		_url.splice(_url.length-1,1);
		return _url.join('/')+'/';
	}
	function getUserAgent(){
		var e = navigator.userAgent,
		t = (navigator.appVersion, e.indexOf("Android") > -1 || e.indexOf("Linux") > -1),
		n = !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		return t ? 1 : n ? 2 : void 0//1:andriod,2:ios
	}
	function base64(data){
		return window.BASE64.encode(JSON.stringify(data));
	}
	function connect(init,callback){
		if(1==OS&&window.WebViewJavascriptBridge ? init(WebViewJavascriptBridge) : document.addEventListener('WebViewJavascriptBridgeReady',function(){
			init(WebViewJavascriptBridge)
			callback();
		},!0),2==OS){
			window.WVJBCallbacks = [init];
	        var WVJBIframe = document.createElement('iframe');
	        WVJBIframe.style.display = 'none';
	        WVJBIframe.src = 'https://__bridge_loaded__';
	        document.documentElement.appendChild(WVJBIframe);
	        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
	        callback();
		}
	}
	function callHandler(props){
		var data=props.data ? BASE64.encode(JSON.stringify(props.data)) : '';
		window.WebViewJavascriptBridge ? window.WebViewJavascriptBridge.callHandler(props.name,data,props.callback)  : null;
	}
	A={
		ready:function(callback){
			connect(function(bridge) {
			    bridge.init(function(message, responseCallback) {
			        console.log('connect success ！', message);
			    });
		    },callback);
		},
		webviewLoading:function(json){//loading
			callHandler({
				name:'webViewLoading',
				data:{
					isLoad:json.isLoad
				},
				callback:function(str){
					console.log('webviewLoading');
				}
			});
		},
		pageJump:function(json){//页面跳转
			var stepCode;
			if(OS==1&&json.stepCode=='800'){//Android未设置800
				stepCode='999';
			}else{
				stepCode=json.stepCode;
			}
			var data={
				"url":json.stepCode=='800'? json.url : URL+json.url,//800为绝对路径
				"stepCode":stepCode,
				"depiction":json.depiction,
				"data":json.data||null
			};
			//window.location.href=data.url;
			callHandler({
				name:'pageJump',
				data:data,
				callback:function(str){
					console.log('jump');
				}
			});
		},
		pageBack:function(json){//页面返回
			var data={
				"url":URL+json.url,
				"depiction":json.depiction,
				"isLoad":json.isLoad||!1,
			};
			json.cityCode&&(data.cityCode=json.cityCode,data.cityName=json.cityName);
			//window.location.href=data.url;
			callHandler({
				name:'pageBack',
				data:data,
				callback:function(str){
					console.log('back');
				}
			});
		},
		getUserInfo:function(callback){//获取app用户信息
			// callback(BASE64.encode(JSON.stringify({
			// 	"token":"NBV7lrx0CmV3QUpQ5tQdaH19apBohNZx6iE7BS0udUc4LwlerLlDa5BR86K8BQEXJbvNqEmCsFkIFA5smhRT3QIou501jsJlsK+XUtFbO/4=",
			// 	"timestamp":"1504161111364",
			// 	"applicationId":"CM-1503890938306-180316232",
			// 	"uid":"170719347725",
			// 	"cityCode":"100",
			// 	"city":"全国"
			// })));
			callHandler({
				name:'getUserInfo',
				data:'',
				callback:function(str){
					callback(str);
				}
			});
		},
		updateVersion:function(json){//app弹出版本更新
			callHandler({
				name:'updateVersion',
				data:json,
				callback:function(str){
					console.log('updateVersion');
				}
			});
		},
		isConnected:function(callback){//判断app是否连接设备
			callHandler({
				name:'isConnected',
				data:'',
				callback:function(str){
					callback(str);
				}
			});
		},
		dialog:function(json){//app弹出框
			callHandler({
				name:'dialog',
				data:json,
				callback:function(str){
					json.yes ? json.yes(str) : console.log('dialog');
				}
			});
		},
		callPay:function(json){//支付
			callHandler({
				name:'callPay',
				data:json,
				callback:function(response){
					json.callback(response);
				}
			});
		},
	},
	
	a.Jsborya=A;
});

