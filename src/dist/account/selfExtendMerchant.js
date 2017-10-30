require('../../public.js');
require('../../assets/css/selfExtendMerchant.css');

Jsborya.ready(function(){


var app=new Vue({ 
	el: '#app',
	data:{
		userInfo:'',
		drop:{
			off:0,
			type:1,
			name:'注册时间',
		},
		resData:{list:[],"self_tourist": "0","bind_equipment": "0","bind_equipment2": "0",},
	},
	created:function(){
		Jsborya.webviewLoading({isLoad:false});//关闭app加载层
	},
	mounted:function(){
		this.initPage();
	},
	methods:{
		initPage:function(){
			var vm=this;
			Jsborya.getUserInfo(function(data){
				var data=JSON.parse(BASE64.decode(data))
				vm.userInfo=data;
				vm.getList();
			});
			
			var appDom=document.getElementById('app');
			document.attachEvent ? appDom.attachEvent("onclick",function(event){
				vm.drop.off=false;
				window.event.cacenlBubble=false;
			}) : appDom.addEventListener("click", function(event) {
				vm.drop.off=false;
				event.stopPropagation();
			},false);
		},
	  	getList:function(){
	  		var vm=this;
	  		var json={
	  			'userInfo':vm.userInfo,
	  			'params':{
	  				type:vm.drop.type
	  			}
	  		};
	  		vm.AJAX('../../../eas/c/account/self_merchant',json,function(data){
				vm.resData=data.data;
			},false,true);
	  	},
	  	filterNumber:function(value){
	  		return (parseFloat(value)/100).toFixed(2);
	  	},
	  	dropDownClick:function(e){
			this.drop.off=true;
			document.attachEvent ? window.event.cacenlBubble=false : e.stopPropagation();
	  	},
	  	dropItemClick:function(e){
			var vm=this,name=e.target.innerHTML;
			vm.drop.name=name;
			vm.drop.type=e.target.title;
			vm.drop.off=false;
			vm.getList();
			document.attachEvent ? window.event.cacenlBubble=false : e.stopPropagation();
	  	},
		
	}
	
});


});