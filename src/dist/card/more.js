require('../../public.js');
require('../../assets/css/more.css');

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
		selectCity:{"cityCode":'100',"cityName":'全国'},//选择的城市
		isOffScreen:false,//筛选开关
		isShift:1,//普号<=>靓号切换开关
		pageSize:12,
		windowHeight:400,
		isPullLoad:true,//上拉加载开关
		page:1,
		phoneType:0,//号码范围
		userInfo:{},
		cardList:{'list':[]},
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
		this.initPage()
	},
	methods:{
		initPage:function(){
			var vm=this,windowHeight=document.documentElement.clientHeight,windowWidth=document.documentElement.clientWidth;
			//设置页面展现
			vm.windowHeight=windowHeight;
			var row=Math.ceil((windowHeight-129)/45),//行数
			    col=windowWidth<=469 ? 2 : windowWidth<=719 ? 3 : 4;//列数
			vm.pageSize=row*col;//号码数量
			
			var urlData=vm.getUrlParam('data');
			if(urlData)vm.selectCity=JSON.parse(BASE64.decode(urlData));
			Jsborya.getUserInfo(function(data){
				var data=JSON.parse(BASE64.decode(data));
				vm.userInfo=data;
				if(!urlData)vm.selectCity={"cityCode":data.cityCode,"cityName":data.city};
				vm.getList();
			});
		},
		getList:function(){//获取更多号卡
			var vm=this,json={
	  			'params':{
	  				'cityCode':vm.selectCity.cityCode,
	  				'type':1,
	  				'page':1,
	  				'pretty':vm.isShift,
	  				'phoneType':vm.phoneType,
	  				'pageSize':vm.pageSize,
	  				'typeLevelZero':'',
	  				'typeLevelOne':'',
	  				'typeLevelTwo':'',
	  				'typePrice':'',
	  				'typeNumMore':'',
	  				'typeNumLess':'',
	  			},
	  			'userInfo':vm.userInfo,
	  		};
			vm.AJAX('../../../eas/w/searchcard/getNumberList',json,function(data){
				vm.cardList=data.data;
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

			vm.AJAX('../../../eas/w/searchcard/orderCreate',json,function(data){
				if(data.code=="681"){
					layer.open({
						title:'提示',
						content:'当前有未处理订单，是否处理订单？',
						btn:['处理订单','取消'],
						yes:function(){
							window.localStorage.setItem('haveSeen','');
							Jsborya.pageBack({
								url:"index.html",
								isLoad:true,
								depiction:"选号",
							});
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
							cardType:phoneType,
							orderStatusCode:'1000',
							privilegeType:data.data.privilegeType,
							phoneNumber:card,
						}
					});
				}
			});

		},
		shiftPretty:function(index,page,isCloseLoad){//选择普号<==>靓号
			var vm=this,pretty,rule;
			vm.isShift!=index&&(page=1,vm.page=1);
			vm.isShift=index;
			index==1 ? pretty=1 : pretty=2;
			var pull=function(data){//上拉时，合并数据列表
				vm.cardList.list=vm.cardList.list.concat(data);
			};
			var json={
	  			'params':{
	  				'cityCode':vm.selectCity.cityCode,
	  				'type':1,
	  				'page':page||1,
	  				'pretty':pretty,
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
				vm.isPullLoad=true;
				isCloseLoad ? pull(data.data.list) : vm.cardList=data.data;
			},isCloseLoad);
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
		selectRule:function(){//选择规则
			this.switchPage('SCREEN');
			var vm=this,json={
	  			'params':{
	  				'cityCode':vm.selectCity.cityCode,
	  				'type':1,
	  				'page':1,
	  				'pretty':vm.isShift,
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
	    pullLoad:function(e){//上拉执行
	    	e.preventDefault();
	    	var vm=this,page=vm.page,obj=document.getElementById('moreUl');
	    	if(vm.isPullLoad&&obj.scrollHeight<=(obj.scrollTop+obj.offsetHeight)){
	    		vm.isPullLoad=false;
	    		page++;
	    		vm.page=page;
	    		vm.shiftPretty(vm.isShift,page,true);
	    	}
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
					var data={"cityName":this.selectCity.cityName,"cityCode":this.selectCity.cityCode,'title':"更多号码"}
					data=BASE64.encode(JSON.stringify(data));
					Jsborya.pageJump({
						url:"city.html?data="+data+"&back=more",
						stepCode:'999',
						depiction:"选择城市",
					});
					break;
			}
		}
	}
});


});