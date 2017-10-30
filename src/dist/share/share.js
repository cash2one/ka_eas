require('../../public.js');
require('../../assets/css/share.css');
import Clipboard from 'clipboard';

var app=new Vue({
	el:'#app',
	data:{
		osType:1,
		inviteCode:'',
		inviter:'',
		isInvite:!1,
		isWeichat:!0,
		showImg:!1
	},
	created:function(){
		var inviteCode=this.getUrlParam('inviteCode');
		this.osType=this.getUserAgent();
		if(inviteCode){
			this.inviteCode=this.getUrlParam('inviteCode');
			this.getInviteCode();
			this.isInvite=true;
		}
		this.isWeichat=this.isWeichatFn();
		this.initClipboard();
		
	},
	methods:{
		initClipboard(){
			var vm=this;
			var clipboard = new Clipboard('#clip-a');
			clipboard.on('success', function(e) {
				layer.open({content:'复制成功',skin: "msg",time: 4,msgSkin:'success'});
			    e.clearSelection();
			});

			clipboard.on('error', function(e) {
			    alert('请选择“ 拷贝 ”进行复制!')
			});

			if(vm.osType==2&&vm.inviteCode){
				var clipboard = new Clipboard('#clip-b');
				clipboard.on('success', function(e) {
					vm.isShow();
				    e.clearSelection();
				});

				clipboard.on('error', function(e) {
				    vm.isShow();
				});
			}
		},
		getInviteCode:function(){
			var _self=this,json={
	  			'params':{
	  				"invite_code":_self.inviteCode
	  			},
	  			'userInfo':{
	  				'token':'',
	  				'timestamp':'',
	  				'applicationID':'',
	  				'userId':'',
	  			}
	  		};
			_self.AJAX('../../../eas/w/share/getInfo',json,function(data){
				if(data.code=="200"){
					var inviter=data.data.inviter,len=inviter.length;
					inviter=inviter.substr(len-1,len);
					for(var i=0;i<len-1;i++){
						inviter='*'+inviter;
					}
					_self.inviter=inviter;
				}else{
					layer.open({content:data.msg,skin: "msg",time: 4})
				}
			})
		},
		getUserAgent:function(){
			var e = navigator.userAgent,
			t = (navigator.appVersion, e.indexOf("Android") > -1 || e.indexOf("Linux") > -1),
			n = !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			return t ? 1 : n ? 2 : void 0//1:andriod,2:ios
		},
		isShow:function(){
			var vm=this,url;
			if(!vm.isWeichat){
				if(vm.isInvite&&vm.osType==1){//有邀请码,android
					var json={
			  			'params':{
			  				"inviteCode":vm.inviteCode,
			  				"userName":vm.inviter,
			  			},
			  			'userInfo':{
			  				'token':'',
			  				'timestamp':'',
			  				'applicationID':'',
			  				'userId':'',
			  			}
			  		};
					vm.AJAX('../../../eas/w/install/pack',json,function(data){
						if(data.code=="200"){
							window.location.href=data.data.url;
							// try{
							// 	document.getElementById('apk_iframe').src=data.data.url;
							// }catch(e){
							// 	alert(e);
							// }
						}else{
							layer.open({content:data.msg,skin: "msg",msgSkin:'error',time: 4});
						}
					});
				}else if(vm.osType==2){//ios
					window.open("https://itunes.apple.com/cn/app/id1225083436");
				}else{//其它
					window.open("http://km.m10027.com/drcs/data/apk_newversion/kameng.apk");
				}
			}else if(vm.isWeichat){//在微信里面
				vm.showImg=true;
			}
		},
		hide:function(){
			this.showImg=false;
		},
		isWeichatFn:function() {
		    var ua = navigator.userAgent.toLowerCase();
		    if (ua.match(/MicroMessenger/i) == "micromessenger") {
		        return true;
		    } else {
		        return false;
		    }
		}
	}
});


