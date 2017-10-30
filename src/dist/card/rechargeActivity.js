require('../../public.js');
require('../../assets/css/rechargeActivity.css');
Jsborya.ready(function(){


var app=new Vue({
	el:'#app',
	data:{
		payType:2,
		isLoad:0,
		response:{
			annex:'',
			linkurl:'http://www.baidu.com'
		},
		inputMoney:'',
		giveMoney:0,
		userInfo:''
	},
	created:function(){
		var vm=this;
		Jsborya.webviewLoading({isLoad:false});//关闭app加载层
		Jsborya.getUserInfo(function(data){
			var data=JSON.parse(BASE64.decode(data));
			vm.userInfo=data;
			vm.getActivity();
		});
	},
	methods:{
		getActivity(){
			var vm=this;
			vm.AJAX('../../../eas/w/activity/getInfo',{'userInfo':vm.userInfo},function(data){
				vm.response=data.data.content;
			});
		},
		oninputMoney(){
			var vm=this,money=vm.inputMoney*100;
			vm.giveMoney='0.00';
			for(let v of vm.response.valueList){
				if(money>=v.minMoney&&money<v.maxMoney){
					vm.giveMoney=(parseFloat(v.deductionValue)/100).toFixed(2);
					break;
				}
			}
		},
		openNewView(url){
			var vm=this;
			url&&Jsborya.pageJump({
				url:url,
				stepCode:'800',
				depiction:"充值优惠活动详情",
			});
		},
		callPay(){
			var vm=this;
			// if(vm.isLoad)return false;
			if(!vm.inputMoney){
				layer.open({
	                content:'请输入充值金额',
	                skin: "msg",
	                msgSkin:'error',
	                time: 2
	            });
	            return false;
			}
			//vm.isLoad=true;
			Jsborya.callPay({
				code:'9001',
				data:{
					money:vm.inputMoney*100
				},
				type:vm.payType,
				callback(response){
					// vm.isLoad=false;
					// try{
					// 	response=JSON.parse(BASE64.decode(response));
					// }catch(e){
					// 	layer.open({
			  //               content:'数据解析失败',
			  //               skin: "msg",
			  //               msgSkin:'error',
			  //               time: 2
			  //           });
			  //           return false;
					// }
					
					// if(response.code==200){
					// 	layer.open({
			  //               content:'充值成功',
			  //               skin: "msg",
			  //               msgSkin:'success',
			  //               time: 4
			  //           });
					// }else{
					// 	layer.open({
			  //               content:response.msg,
			  //               btn:['确定']
			  //           });
					// }
				}
			});
		}
	}
});


});