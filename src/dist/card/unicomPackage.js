require('../../public.js');
require('../../assets/css/package.css');

Jsborya.ready(function(){

window.app=null;

app=new Vue({
	el:'#app',
	data:{
		off:{//控制开关
			package:0,
			pre:0,
			deductionUsed:true,
			chargeType:"02",
			isShowNotes:false,
		},
		prestoreMoney:'',//含预存话费
		totalMoney:'',//价格
		deductionMoney:'',//抵扣预存话费
		payMoney:'',//还需支付
		numberValue:'',//号码占用费
		packageInfo: {
	        "numberLevel":"1",
	        "sysOrderId": "000000000000000000",
	        "createTime": "00000",
	        "number": "0000000000",
	        "cityName": "--",
	        "numberValue": "0",
	        "packageMore": "0",
	        "deductionFee":"0",
	        "discountType":"2",
	        "package": [
	            {
	                "title": "暂无套餐",
	                "code": "0",
	                "standard": "无",
	                "feeDescribe": "无",
	                "init":"0",
	                "selPackageMore": "0",
	                "prestoreMoneyList": [
	                    {
	                    	"title": "暂无优惠活动",
	                        "prestoreMoney": "0",
	                        "init": "0"
	                    }
	                ],
	                "prestoreDiscountList":{
	                	"0":"10000"
	                },
	                "selPackage": [
	                    {
	                        "title": "暂无可选包",
	                        "code": "0",
	                        "standard": "无",
	                        "feeDescribe": "无",
	                        "init": "0"
	                    }
	                ]
	            }
	        ]
	    },
	    prestoreMoneyList:[],
	    selPackage:[],
        userInfo:{},
	},
	mounted:function(){
		this.initPage();
	},
	methods:{
		initPage:function(){//初始化
			var vm=this;
			Jsborya.getUserInfo(function(data){
				vm.userInfo=JSON.parse(BASE64.decode(data));
				vm.getList({
					'type':0,
					'package':'',
					'selPackage':'',
					'prestoreMoney':'',
					'sysOrderId':vm.getUrlParam('sysOrderId')||'',
				},function(){
					Jsborya.webviewLoading({isLoad:false});//关闭app加载层
				});
				vm.renderList();
			});
		},
		selectPackage:function(e){//选择套餐
			var btn,vm=this,name=e.target.name,className=e.target.parentNode.className;
			className=='active' ? btn=['关闭'] : btn=['选择','关闭'];
			var text=vm.packageInfo.package[name];
			layer.open({
				content:'<div class="select-info"><dl><dt>套餐名称</dt><dd class="b">'+text.title+'</dd></dl><dl><dt>套餐介绍</dt><dd>'+text.info+'</dd></dl></div>',
				btn:btn,
				type:1,
				style:'width:90%;max-width:540px;top:-30px;',
				yes:function(){
					if(className==''){
						vm.off.package=name;
						vm.siblingC(e.target);
						vm.renderList();
					}
					layer.closeAll();
				},
				no:function(){
					layer.closeAll();
				}
			});

		},
		selectBag:function(e){//选择功能包
			var btn,vm=this,name=e.name,parentNode=e.parentNode;
			var selPackage=vm.packageInfo.package[vm.off.package].selPackage[name];
			selPackage.init==2 ? btn=['关闭'] : parentNode.className=='active' ? btn=['不选择','关闭'] : btn=['选择','关闭'];

			layer.open({
				content:'<div class="select-info"><dl><dt>功能包名称</dt><dd class="b">'+selPackage.title+'</dd></dl><dl><dt>功能包介绍</dt><dd>'+selPackage.info+'</dd></dl></div>',
				btn:btn,
				type:1,
				style:'width:90%;max-width:540px;top:-30px;',
				yes:function(){
					selPackage.init!=2&&(parentNode.className=='active' ? parentNode.className='' : parentNode.className='active');
					layer.closeAll();
				},
				no:function(){
					layer.closeAll();
				}
			})
		},
		selectPre:function(e){//预存切换
			var btn,vm=this,name=e.name,className=e.parentNode.className,text='';
			className=='active' ? btn=['关闭'] : btn=['选择','关闭'];

			text=vm.packageInfo.package[vm.off.package].prestoreMoneyList[name].info;
			layer.open({
				title:'提示',
				content:text,
				btn:btn,
				yes:function(){
					if(className==''){
						vm.off.pre=e.name;
						vm.siblingC(e);
						vm.mathDeduction();
					}
					layer.closeAll();
				},
				no:function(){
					layer.closeAll();
				}
			});
		},
		chargeTypeShift:function(index){
			this.off.chargeType=index;
		},
		makeSure:function(){//读取证件信息
			var vm=this;
			if(vm.packageInfo.number=="0000000000")return false;
			var sysOrderId=vm.getUrlParam('sysOrderId'),selPackageCode=vm.filterPreData();

			var json={
	  			'params':{
	  				'sysOrderId':sysOrderId,
	  				'prestoreMoney':vm.packageInfo.package[vm.off.package].prestoreMoneyList[vm.off.pre].prestoreMoney,
	  				'packageCode':vm.packageInfo.package[vm.off.package].code,
	  				'selPackageCode':selPackageCode,
	  				'chargeType':vm.off.chargeType,
	  				'deductionType':vm.off.deductionUsed ? '1' : '0'//是否使用赠送金额
	  			},
	  			'userInfo':vm.userInfo
	  		};

			vm.AJAX('../../../eas/w/searchcard/SetCradInfo',json,function(data){
				Jsborya.isConnected(function(str){
					if(str==1){
						Jsborya.pageJump({
							url:'',
							stepCode:'1001',
							depiction:'上传资料',
							data:{
								prestoreMoney:vm.packageInfo.package[vm.off.package].prestoreMoneyList[vm.off.pre].prestoreMoney,
								totalMoney:(parseInt(vm.packageInfo.numberValue)+parseInt(vm.packageInfo.package[vm.off.package].prestoreMoneyList[vm.off.pre].prestoreMoney)),
								createTime:vm.packageInfo.createTime,
								sysOrderId:vm.packageInfo.sysOrderId,
								cityName:vm.packageInfo.cityName,
								phoneNumber:vm.packageInfo.number,
								actualMoney:data.data.actualMoney,
								cardMoney:data.data.cardMoney,
								prestoreMoney:data.data.prestoreMoney,
								totalMoney:data.data.totalMoney,
								giveMoney:data.data.giveMoney,
								deductMoney:data.data.deductMoney,
								limitSimilarity:data.data.limitSimilarity,
								orderStatusCode:'1001',
								numberLevel:String(vm.packageInfo.numberLevel),
								livingCheck:data.data.livingCheck
							}
						})
					}
				});
			})
		},
		filterPreData:function(){//获取选中的功能包code
			var vm=this,ret='',selPackage=vm.packageInfo.package[vm.off.package].selPackage,bagUl=document.getElementById('bagUl');
			for(let i=0;i<bagUl.childNodes.length;i++){
				if(bagUl.childNodes[i].nodeType===1&&bagUl.childNodes[i].className!=''){
					let index=bagUl.childNodes[i].childNodes[0].name;
					ret+=selPackage[i].code+'|';
				}
			}
			return ret.substring(0,ret.length-1);
		},
		getList:function(params,closeLoad){//获取数据列表
			var vm=this;
			var json={
	  			'params':params,
	  			'userInfo':vm.userInfo
	  		};
			vm.AJAX('../../../eas/w/searchcard/getCradInfo',json,function(data){
				vm.packageInfo=data.data;
				for(var i=0;i<data.data.package.length;i++){//获取默认选中的套餐index
					if(data.data.package[i].init==1)break;
				}
				vm.off.package=i;
				vm.renderList();
			},closeLoad)
		},
		renderList:function(){//渲染功能包和预存
			var vm=this,str='',
				bagUl=document.getElementById('bagUl'),
				preUl=document.getElementById('preUl'),
				packageList=vm.packageInfo.package[vm.off.package],//选中的套餐列表
				isDiscount=vm.packageInfo.discountType!=2;//是否计算折扣

			//渲染可选包
			for(let i=0,todo=packageList.selPackage;i<todo.length;i++){
				todo[i].init==1 ? str+='<li class="active">' : todo[i].init==2 ? str+='<li class="active active2">' : str+='<li>';
				str+='<a onclick="app.selectBag(this)" name="'+i+'" href="javascript:void(0)">'+todo[i].title+'</a></li>';
			}
			if(packageList.selPackageMore==1)str+='<li><a href="javascript:void(0)" onclick="app.more(2)">查看更多</a></li>';
			bagUl.innerHTML=str,str='';
			//渲染预存
			for(let i=0,todo=packageList.prestoreMoneyList;i<todo.length;i++){
				todo[i].init==1 ? (str+='<li class="active">',vm.off.pre=i) : str+='<li>';
				str+='<a onclick="app.selectPre(this)" name="'+i+'" href="javascript:void(0)">'+todo[i].title+'</a></li>';
			}
			preUl.innerHTML=str,str='';

			if(vm.packageInfo.deductionFee==0){//充值赠送余额
				vm.off.deductionUsed=false;
			}else vm.off.deductionUsed=true;

			vm.mathDeduction();
			
		},
		mathDeduction:function(e){//计算折扣后金额
			var vm=this,
				prestoreMoney,//预存
				totalMoney,//总价格
				deductionMoney,//抵扣预存金额
				payMoney,//支付金额
				totalMoney,//总价格
				numberValue=parseFloat(vm.packageInfo.numberValue)/100,//号码占用费
				isDiscount=vm.packageInfo.discountType!=2;//是否计算折扣
			
			prestoreMoney=parseFloat(vm.packageInfo.package[vm.off.package].prestoreMoneyList[vm.off.pre].prestoreMoney)/100;
				
			// if(isDiscount){
			// 	prestoreMoney*=parseFloat(vm.packageInfo.prestoreDiscountList[prestoreMoney*100])/10000;
			// 	numberValue*=parseFloat(vm.packageInfo.numberValueDiscount)/10000;
			// }
			totalMoney=(numberValue+prestoreMoney).toFixed(2);
			numberValue=numberValue.toFixed(2);
			prestoreMoney=prestoreMoney.toFixed(2);

			if(e){//点击
				vm.off.deductionUsed ? vm.off.deductionUsed=false : vm.off.deductionUsed=true; 
			}
			
			if(vm.off.deductionUsed){
				if(vm.packageInfo.deductionFee>prestoreMoney*100){
					deductionMoney=prestoreMoney;
				}else if(0<vm.packageInfo.deductionFee<=prestoreMoney*100){
					deductionMoney=(parseFloat(vm.packageInfo.deductionFee)/100).toFixed(2);
				}else{
					deductionMoney='0.00';//抵扣预存
				}
				payMoney=(totalMoney-deductionMoney).toFixed(2);//支付价格
			}else{
				deductionMoney='0.00';
				payMoney=totalMoney;
			}
			
			
			vm.prestoreMoney=prestoreMoney;
			vm.numberValue=numberValue;
			vm.totalMoney=totalMoney;
			vm.deductionMoney=deductionMoney;
			vm.payMoney=payMoney;
		},
		siblingC:function(e){//同级元素，class切换
			var parent=e.parentNode.parentNode;
			for(var i=0;i<parent.childNodes.length;i++){
				if(parent.childNodes[i].nodeType===1)parent.childNodes[i].className='';
			}
			e.parentNode.className='active';
		},
		btnNotsClick:function(){
			var vm=this;
			vm.off.isShowNotes ? vm.off.isShowNotes=false : vm.off.isShowNotes=true;
		},
	}
});


});