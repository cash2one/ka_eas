require('../../public.js');
require('../../assets/css/search.css');

Jsborya.ready(function(){


var app=new Vue({
	el:'#app',
	data:{
		searchValue:'',//号码搜索key
		phoneType:0,//号码类别
		isDelete:false,//搜索显示清空按钮
		isShowCitySearch:true,//城市搜索开关
		windowHeight:500,
		isPullLoad:true,//上拉加载开关
		isShow:false,
		page:1,
		pageSize:20,
		userInfo:{},
		cardList:{list:[]},
		city:{"cityName":"北京","cityCode":"110"},
	},
	created:function(){
		Jsborya.webviewLoading({isLoad:false});//关闭app加载层
	},
	mounted:function(){
		this.initPage();
	},
	methods:{
		initPage:function(){
			var vm=this,windowHeight=document.documentElement.clientHeight,windowWidth=document.documentElement.clientWidth;
			//设置页面展现
			vm.windowHeight=windowHeight;
			var row=Math.ceil((windowHeight-99)/45),//行数
			    col=windowWidth<=469 ? 2 : windowWidth<=719 ? 3 : 4;//列数
			vm.pageSize=row*col;//号码数量

			var data=vm.getUrlParam('data');
			if(data){
				data=JSON.parse(BASE64.decode(data));
				vm.city=data;
				vm.phoneType=data.phoneType||0;
				Jsborya.getUserInfo(function(data){
					vm.userInfo=JSON.parse(BASE64.decode(data));
				});
			}
			
		},
		selectCity:function(){
			var data={"cityName":this.city.cityName,"cityCode":this.city.cityCode,'title':'搜索号码'}
			data=BASE64.encode(JSON.stringify(data));
			Jsborya.pageJump({
				url:"city.html?data="+data+"&back=search",
				stepCode:'999',
				depiction:"选择城市",
			});
		},
		searchInputChange:function(){
			this.searchValue ? this.isDelete=true : this.isDelete=false;
			this.searchValue.length==11&&this.searchCard(1);
		},
		searchCard:function(page,isCloseLoad){//搜索号码
			var vm=this;
			vm.page=page;
			var pull=function(data){
				vm.cardList.list=vm.cardList.list.concat(data);
			};
			if(!vm.searchValue||vm.searchValue.length<2){layer.open({content:'请输入2位及以上数字',skin: "msg",msgSkin:'error',time: 4});return false;}

			var json={
	  			'params':{
	  				'phoneSegment':vm.searchValue,
	  				'page':page||1,
	  				'cityCode':vm.city.cityCode,
	  				'pageSize':vm.pageSize,
	  				'phoneType':vm.phoneType
	  			},
	  			'userInfo':vm.userInfo
	  		};
			vm.AJAX('../../../eas/w/searchcard/searchNumber',json,function(data){
				vm.isShow=true;
				vm.isPullLoad=true;
				isCloseLoad ? pull(data.data.list) : vm.cardList=data.data;
			},isCloseLoad);
		},
		selectCard:function(card,name,phoneType){//点击号码生成订单
			var vm=this,json={
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
							cityName:name,
							privilegeType:data.data.privilegeType,
							orderStatusCode:'1000',
							cardType:phoneType,
							phoneNumber:card,
						}
					});
				}
				
			});
		},

		inputEmpty:function(){
			this.searchValue='';
			this.isDelete=false;
		},
	    pullLoad:function(e){
	    	e.preventDefault();
	    	var vm=this,page=vm.page,obj=document.getElementById('searchUl');
	    	if(vm.isPullLoad&&obj.scrollHeight<=(obj.scrollTop+obj.offsetHeight)){
	    		vm.isPullLoad=false;
	    		page++;
	    		vm.searchCard(page,true);
	    	}
	    },
	}
});


});