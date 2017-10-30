require('../../public.js');
require('../../assets/css/index.css');

Jsborya.ready(function(){


var app=new Vue({
	el:'#app',
	data:{
		off:{//规则筛选开关
			"typeLevelZero":99999,
			"typeLevelOne":99999,
		    "typeLevelTwo":99999,
		    "typePrice":99999,
		    "typeNumMore":99999,
		    "typeNumLess":99999
		},
		bottomImgH:'85px',//底部图片高度
		liSpace:'0',//号码列表，padding计算
		selectCity:{"cityCode":'100',"cityName":'全国'},//选择的城市
		showCardList:true,//首页列表开关
		showOrderTips:false,//未完成订单开关
		isOffScreen:false,//筛选开关
		dragStatus:1,//下拉状态开关
		position:{transform: 'translate3d(0,0,0)'},//下拉样式
		pageSize:12,
		endDrop:'',
		phoneType:0,//号码范围
		userInfo:'',
		cardList:{'list':[]},
		orderInfo:'',
		ruleData:{
			'isContain':[{'typeName':'不含4','typeCode':'200004'}],
			'special':[{'typeName':'全部','typeCode':'130000'},{'typeName':'领导号','typeCode':'130001'},{'typeName':'情侣号','typeCode':'130002'}],
			'senior':[{'typeName':'全部','typeCode':'110000'},{'typeName':'四连及以上','typeCode':'100002'},{'typeName':'对号','typeCode':'100003'},{'typeName':'顺子','typeCode':'100004'},{'typeName':'ABCABCABC','typeCode':'100005'},{'typeName':'AAAABBBBC','typeCode':'100006'},{'typeName':'AAABBBBC','typeCode':'100007'},{'typeName':'ABCDABCD','typeCode':'100008'},{'typeName':'ABABABABAB','typeCode':'100009'},{'typeName':'ABABABAB','typeCode':'100010'},{'typeName':'AAABBBC','typeCode':'100011'},{'typeName':'AAABBBB','typeCode':'100018'},{'typeName':'AAABBBCCC','typeCode':'100019'},{'typeName':'AABBBBB','typeCode':'100020'},{'typeName':'3拖3','typeCode':'100012'},{'typeName':'4拖3','typeCode':'100013'},{'typeName':'4拖4','typeCode':'100014'},{'typeName':'5拖2','typeCode':'100015'},{'typeName':'5拖3','typeCode':'100016'},{'typeName':'6拖2','typeCode':'100017'}],
			'ordinary':[{'typeName':'全部','typeCode':'120000'},{'typeName':'小靓号','typeCode':'100060'},{'typeName':'三连号','typeCode':'100023'},{'typeName':'对号','typeCode':'100027'},{'typeName':'顺子','typeCode':'100025'},{'typeName':'ABAB','typeCode':'100028'},{'typeName':'ABABAB','typeCode':'100029'},{'typeName':'ABCABC','typeCode':'100030'},{'typeName':'AABAAB','typeCode':'100036'},{'typeName':'ABBABB','typeCode':'100037'},{'typeName':'AABBB','typeCode':'100038'},{'typeName':'3拖2','typeCode':'100031'},{'typeName':'3拖3','typeCode':'100032'},{'typeName':'4拖2','typeCode':'100033'},{'typeName':'5拖2','typeCode':'100035'},{'typeName':'4拖3','typeCode':'100034'}],
			'price':[{'typeName':'100以下','typeCode':'100049'},{'typeName':'100~500','typeCode':'100050'},{'typeName':'500~1000','typeCode':'100051'},{'typeName':'1000~5000','typeCode':'100052'},{'typeName':'5000~10000','typeCode':'100053'},{'typeName':'1万以上','typeCode':'100054'}],
			'number':[{'typeName':'0较多','typeCode':'100039'},{'typeName':'1较多','typeCode':'100040'},{'typeName':'2较多','typeCode':'100041'},{'typeName':'3较多','typeCode':'100042'},{'typeName':'4较多','typeCode':'100043'},{'typeName':'5较多','typeCode':'100044'},{'typeName':'6较多','typeCode':'100045'},{'typeName':'7较多','typeCode':'100046'},{'typeName':'8较多','typeCode':'100047'},{'typeName':'9较多','typeCode':'100048'}]
		},
	},
	created:function(){
		Jsborya.webviewLoading({isLoad:false});//关闭app加载层
	},
	mounted:function(){
		this.initPage();
	},
	methods:{
		initPage:function(){
			var vm=this,type=vm.getUrlParam('type')||'',haveSeen=window.localStorage.getItem('haveSeen'),windowHeight=document.documentElement.clientHeight,windowWidth=document.documentElement.clientWidth;
			//设置页面展现
			var bottomImgH=(windowWidth-20)/4.25;
			var row=Math.floor((windowHeight-119-bottomImgH)/45),//行数
			    col=windowWidth<=469 ? 2 : windowWidth<=719 ? 3 : 4,//列数
			    spaceHeight=windowHeight-119-bottomImgH-row*45;
			vm.liSpace=spaceHeight/row/2+'px 0px';
			vm.pageSize=row*col;//号码数量
			vm.bottomImgH=bottomImgH+'px';//设置底部图片高度
			if(type){//是否从城市页面跳转过来
				var data=vm.getUrlParam('data');
				data=JSON.parse(BASE64.decode(data));
				if(type=='city'){
					vm.selectCity=data;
					Jsborya.getUserInfo(function(data){
						vm.userInfo=JSON.parse(BASE64.decode(data));
						haveSeen==999?vm.backHome():vm.getOrderTips();
					});
				}
			}else{
				Jsborya.getUserInfo(function(data){
					var data=JSON.parse(BASE64.decode(data));
					vm.userInfo=data;
					vm.selectCity={"cityCode":data.cityCode,"cityName":data.city};
					haveSeen==999?vm.backHome():vm.getOrderTips();
				});
			}
			
		},
		getOrderTips:function(closeLoad){//获取订单提示
			var vm=this;
			var json={'userInfo':vm.userInfo};
			vm.AJAX('../../../eas/w/searchcard/getOrder',json,function(data){
				if(data.data){
					vm.orderInfo=data.data;
					vm.countDown();
					vm.orderInfo.numberLevel=vm.filterLevel(vm.orderInfo.numberLevel);
					vm.showOrderTips=true;
					vm.showCardList=false;
				}else{
					vm.backHome();
				}
			},closeLoad);
		},
		getCardList:function(closeLoad){//获取首屏号卡数据
			var vm=this;
			var json={
	  			'params':{
	  				'cityCode':vm.selectCity.cityCode,
	  				'type':3,
	  				'page':1,
	  				'pretty':0,
	  				'phoneType':vm.phoneType,
	  				'pageSize':vm.pageSize,
	  				'typeLevelZero':vm.off.typeLevelZero!=99999 ? vm.ruleData.special[vm.off.typeLevelZero].typeCode : '',
	  				'typeLevelOne':vm.off.typeLevelOne!=99999 ? vm.ruleData.senior[vm.off.typeLevelOne].typeCode : '',
	  				'typeLevelTwo':vm.off.typeLevelTwo!=99999 ? vm.ruleData.ordinary[vm.off.typeLevelTwo].typeCode : '',
	  				'typePrice':vm.off.typePrice!=99999 ? vm.ruleData.price[vm.off.typePrice].typeCode : '',
	  				'typeNumMore':vm.off.typeNumMore!=99999 ? vm.ruleData.number[vm.off.typeNumMore].typeCode : '',
	  				'typeNumLess':vm.off.typeNumLess!=99999 ? vm.ruleData.isContain[vm.off.typeNumLess].typeCode : '',
	  			},
	  			'userInfo':vm.userInfo
	  		};
			vm.AJAX('../../../eas/w/searchcard/getNumberList',json,function(data){
				vm.cardList=data.data;
				closeLoad&&(vm.dragStatus=5,
				setTimeout(function(){
					vm.position={transform: 'translate3d(0,0,0)'};
					setTimeout(function(){
						vm.dragStatus=1;
					},300);
				},500));
			},closeLoad);
		},
		shiftPhoneType:function(index){//号码范围切换
			var vm=this;
			if(vm.phoneType!=0&&vm.phoneType!=index){
				vm.phoneType=0;
			}else if(index==1){
				vm.phoneType=2;
			}else if(index==2){
				vm.phoneType=1;
			}
			vm.initRuleCheck();
		},
		shiftRule:function(index,type){//号码规则切换
			if(type==1){
				if(index==this.off.typeLevelZero){
					this.off.typeLevelZero=99999;
				}else{
					this.off.typeLevelZero=index;
				}
				this.off.typeLevelOne=99999;
				this.off.typeLevelTwo=99999;
			}else if(type==2){
				if(index==this.off.typeLevelOne){
					this.off.typeLevelOne=99999;
				}else{
					this.off.typeLevelOne=index;
				}
				this.off.typeLevelZero=99999;
				this.off.typeLevelTwo=99999;
			}else if(type==3){
				if(index==this.off.typeLevelTwo){
					this.off.typeLevelTwo=99999;
				}else{
					this.off.typeLevelTwo=index;
				}
				this.off.typeLevelZero=99999;
				this.off.typeLevelOne=99999;
			}else if(type==4){
				if(index==this.off.typePrice){
					this.off.typePrice=99999;
				}else{
					this.off.typePrice=index;
				}
			}else if(type==5){
				if(index==this.off.typeNumMore){
					this.off.typeNumMore=99999;
				}else{
					this.off.typeNumMore=index;
				}
			}else if(type==6){
				if(index==this.off.typeNumLess){
					this.off.typeNumLess=99999;
				}else{
					this.off.typeNumLess=index;
				}
			}
		},
		initRuleCheck:function(){//初始化规则
			this.off={
				"typeLevelZero":99999,
				"typeLevelOne":99999,
			    "typeLevelTwo":99999,
			    "typePrice":99999,
			    "typeNumMore":99999,
			    "typeNumLess":99999
			};
		},
		selectRule:function(){//选择规则-确定按钮
			this.switchPage('SCREEN');
			var vm=this,json={
	  			'params':{
	  				'cityCode':vm.selectCity.cityCode,
	  				'type':3,
	  				'page':1,
	  				'pretty':0,
	  				'phoneType':vm.phoneType,
	  				'pageSize':vm.pageSize,
	  				'typeLevelZero':vm.off.typeLevelZero!=99999 ? vm.ruleData.special[vm.off.typeLevelZero].typeCode : '',
	  				'typeLevelOne':vm.off.typeLevelOne!=99999 ? vm.ruleData.senior[vm.off.typeLevelOne].typeCode : '',
	  				'typeLevelTwo':vm.off.typeLevelTwo!=99999 ? vm.ruleData.ordinary[vm.off.typeLevelTwo].typeCode : '',
	  				'typePrice':vm.off.typePrice!=99999 ? vm.ruleData.price[vm.off.typePrice].typeCode : '',
	  				'typeNumMore':vm.off.typeNumMore!=99999 ? vm.ruleData.number[vm.off.typeNumMore].typeCode : '',
	  				'typeNumLess':vm.off.typeNumLess!=99999 ? vm.ruleData.isContain[vm.off.typeNumLess].typeCode : '',
	  			},
	  			'userInfo':vm.userInfo
	  		};
			vm.AJAX('../../../eas/w/searchcard/getNumberList',json,function(data){
				vm.cardList=data.data;
			});
		},
		continueOrder:function(){//继续完成订单-按钮
			var vm=this,url,depiction='选择套餐';
			var json={'userInfo':vm.userInfo};
			vm.AJAX('../../../eas/w/searchcard/getOrder',json,function(data){
				if(data.data){
					window.localStorage.setItem('haveSeen','');
					if(vm.orderInfo.orderStatusCode==1000){
						if(vm.orderInfo.cardType==2){
							url="unicomPackage.html?sysOrderId="+vm.orderInfo.sysOrderId+"";
						}else{
							url="package.html?sysOrderId="+vm.orderInfo.sysOrderId+"";
						}
					}
					Jsborya.pageJump({
						url:url,
						stepCode:vm.orderInfo.orderStatusCode,
						depiction:depiction,
						data:vm.orderInfo
					});
				}else{
					vm.backHome();
				}
			});
		},
		abandon:function(sysOrderId){//放弃订单-按钮
			var vm=this;
			layer.open({
				title:'提示',
				content:'您要放弃未完成的订单的后续操作么？',
				btn:['放弃','取消'],
				yes:function(){
					var json={
			  			'params':{
			  				'sysOrderId':sysOrderId,
			  			},
			  			'userInfo':vm.userInfo
			  		};
					vm.AJAX('../../../eas/w/searchcard/orderCancel',json,function(data){
						data.code=="676" ? 
						(vm.getOrderTips(),layer.closeAll()) : 
						(
							vm.backHome(),window.localStorage.setItem('haveSeen',''),
							layer.open({
								title:'操作成功',
								content:'订单已取消，若已支付，支付货款将退回至您的账户',
								btn:['确定'],
							})
						);
					});
					
				}
			});
		},
		selectCard:function(card,name,phoneType){//点击号码生成订单
			var vm=this;
			var json={
	  			'params':{
	  				'number':card,
	  				'phoneType':phoneType
	  			},
	  			'userInfo':vm.userInfo
	  		};

			if(phoneType==2&&vm.cardList.isNewVersion==1){//老版本选择联通号码
				layer.open({
					title:'提示',
					content:'当前版本不支持选择<b class="purple">联通号码</b>，请更新到最新版本。',
					btn:['确定'],
				});
				return false;
			}

	  		if(vm.dragStatus!=1){return false};
			vm.AJAX('../../../eas/w/searchcard/orderCreate',json,function(data){
				if(data.code=="681"){
					layer.open({
						title:'提示',
						content:'当前有未处理订单，是否处理订单？',
						btn:['处理订单','取消'],
						yes:function(){
							vm.getOrderTips();
							layer.closeAll();
						}
					});
				}else{
					var url='';
					phoneType==2 ? url="unicomPackage.html?sysOrderId="+data.data.sysOrderId+"" : url="package.html?sysOrderId="+data.data.sysOrderId+"";
					Jsborya.pageJump({
						url:url,
						stepCode:'1000',
						depiction:'选择套餐',
						data:{
							createTime:data.data.createTime,
							sysOrderId:data.data.sysOrderId,
							limitSimilarity:data.data.limitSimilarity,
							cityName:name,
							orderStatusCode:'1000',
							privilegeType:data.data.privilegeType,
							cardType:phoneType,
							phoneNumber:card,
						}
					});
				}
			});
			
		},
		backHome:function(){//返回号板
			this.getCardList();
			this.showCardList=true;
			this.showOrderTips=false;
		},
		haveSeen:function(){
			window.localStorage.setItem('haveSeen','999');
			this.backHome();
		},
		switchPage:function(v){//页面切换
			switch(v){
				case 'SCREEN':
					this.isOffScreen ? (this.isOffScreen=false,document.body.style.overflowY='auto') : (this.isOffScreen=true,document.body.style.overflowY='hidden');
					document.getElementById('ruleCheck').scrollTop=0;
					break;
				case 'SEARCH'://跳-搜索号码
					var data={"cityCode":this.selectCity.cityCode,"cityName":this.selectCity.cityName};
					data=BASE64.encode(JSON.stringify(data));
					Jsborya.pageJump({
						url:"search.html?data="+data+"",
						stepCode:'999',
						depiction:"搜索号码",
					});
					break;
				case 'CITY'://跳-选择城市
					var data={"cityName":this.selectCity.cityName,"cityCode":this.selectCity.cityCode,'title':'选号'}
					data=BASE64.encode(JSON.stringify(data));
					Jsborya.pageJump({
						url:"city.html?data="+data+"&back=index",
						stepCode:'999',
						depiction:"选择城市",
					});
					break;
				case 'MORE'://跳-更多号码
					var vm=this;
					var data={"cityName":vm.selectCity.cityName,"cityCode":vm.selectCity.cityCode,'title':'选号'}
					data=BASE64.encode(JSON.stringify(data));
					Jsborya.pageJump({
						url:"more.html?data="+data+"",
						stepCode:'999',
						depiction:"更多号码",
					});
					break;
			}
		},
		startDrag:function(e){//开始下拉
			e = e.changedTouches ? e.changedTouches[0] : e;
			this.endDrop={"x":e.pageX,"y":e.pageY,time:new Date().getTime()};
			if(this.dragStatus==4){return false};
			if(this.dragStatus==1)this.dragStatus = 2;
		},
		onDrag:function(e){//下拉中
			var event=e;
			e = e.changedTouches ? e.changedTouches[0] : e;
			if(this.dragStatus==2){
				// var duration=+new Date().getTime()-this.endDrop.time;//滑动时间
				var x=e.pageX-this.endDrop.x,y=e.pageY-this.endDrop.y;//滑动距离
				var isDrop=Math.abs(x) < Math.abs(y) ? 1:0;//是否向下滑动
				event.preventDefault();
				if(isDrop==1 && 0<y && y<120){
					this.position={transform: 'translate3d(0,' + y + 'px,0)'};
					if(y>90){
						this.dragStatus=3;
					}
				}
			}
			
		},
		stopDrag:function(e){//停止下拉
			e = e.changedTouches ? e.changedTouches[0] : e;
			if(this.dragStatus==4){return false};
			var vm=this,y=e.pageY-vm.endDrop.y,duration=+new Date().getTime()-this.endDrop.time;//滑动时间
			if(y>90&&vm.dragStatus==3&&Number(duration)>100){
				vm.position={transform: 'translate3d(0,45px,0)'};
				vm.dragStatus=4;
				vm.getCardList(true);
			}else{
				vm.position={transform: 'translate3d(0,0,0)'};
				this.dragStatus=1
			}
		},
	    countDown:function(){//倒计时
	    	var vm=this,time=parseInt(vm.orderInfo.validTime);
	    	vm.orderInfo.validTime='00:00';
	    	clearInterval(window.timer);
	    	var timeFormat=function(t){
	    		var t_s=t%60,t_m=Math.floor(t/60);
	    		t_s<=9&&(t_s='0'+t_s);
	    		t_m<=9&&(t_m='0'+t_m);
	    		return t_m+':'+t_s;
	    	}
	    	var abandon=function(){
	    		var json={
		  			'params':{
		  				'sysOrderId':vm.orderInfo.sysOrderId,
		  			},
		  			'userInfo':vm.userInfo
		  		};
				vm.AJAX('../../../eas/w/searchcard/orderCancel',json,function(data){
					vm.backHome();
					clearInterval(window.timer);
					layer.open({
						title:'操作成功',
						content:'订单已取消，若已支付，支付货款将退回至您的账户',
						btn:['确定'],
					})
				})
	    	}
	    	window.timer=setInterval(function(){
	    		time--;
	    		time==0?(vm.orderInfo.validTime='00:00',clearInterval(window.timer),window.location.reload()):vm.orderInfo.validTime=timeFormat(time);
	    	},1000);
	    },
	    jump:function(){
			Jsborya.pageJump({
				url:"unicomPanel.html",
				stepCode:'999',
				depiction:"联通套餐专区",
			});
	    }
	}
});


});