require('../../public.js');
require('../../assets/css/packageDetails.css');

Jsborya.ready(function(){


var app=new Vue({
	el:'#app',
	data:{
		off:{
			select:0,
			shiftDetails:0,
		},
		packageList:'',
		details:{'remarks':{"detaile":""}},
	},
	created:function(){
		this.off.shiftDetails=this.getUrlParam('type')
	},
	mounted:function(){
		this.initPage()
	},
	methods:{
		initPage:function(){
			this.getList(function(){
				Jsborya.webviewLoading({isLoad:false});//关闭app加载层
			});
		},
		getList:function(closeLoad){
			var vm=this;
			var type=vm.getUrlParam('type'),packageCode=vm.getUrlParam('packageCode'),prestoreMoney=vm.getUrlParam('prestoreMoney'),activityCode=vm.getUrlParam('activityCode'),sysOrderId=vm.getUrlParam('sysOrderId');
			var userInfo=JSON.parse(window.localStorage.getItem('KM_USERINFO'));

			var json={
	  			'params':{
	  				'sysOrderId':sysOrderId,
	  				'prestoreMoney':prestoreMoney,
	  				'packageCode':packageCode,
	  				'activityCode':activityCode,
	  				'type':type
	  			},
	  			'userInfo':userInfo
	  		};
			vm.AJAX('../../../eas/w/searchcard/getMorePackageInfo',json,function(data){
				vm.packageList=data.data;
				vm.mathLable();
			},closeLoad)
		},
		select:function(e){
			var vm=this,
				 name=e.toElement.name,
			className=e.toElement.parentNode.className,
			     type=vm.getUrlParam('type'),
			     init=name.split('|')[0],
			    index=name.split('|')[1];
			if(type==1){
				var parent=e.toElement.parentNode.parentNode;
				for(var i=0;i<parent.childNodes.length;i++){
					if(parent.childNodes[i].nodeType===1)parent.childNodes[i].className='';
				}
				 e.toElement.parentNode.className='active';
			}else if(type==2){
				init!=2&&e.toElement.parentNode.className ? e.toElement.parentNode.className='' : init==2 ? e.toElement.parentNode.className='active active2' : e.toElement.parentNode.className='active';
			}
			vm.details=JSON.parse(vm.packageList[index].info);
			vm.details.title=vm.packageList[index].title;
		},
		mathLable:function(){
			var vm=this,list=vm.packageList;
			for(var i in list){
				if(list[i].init==1||list[i].init==2){
					vm.off.select=i;
					vm.details=JSON.parse(list[i].info);
					vm.details.title=list[i].title;
					break;
				}
			}
		},
		makeSure:function(){
			var obj=document.getElementById('app-package'),child=obj.childNodes,bag=[],bagCode='',vm=this,url;
			var type=vm.getUrlParam('type'),packageCode=vm.getUrlParam('packageCode'),prestoreMoney=vm.getUrlParam('prestoreMoney'),activityCode=vm.getUrlParam('activityCode'),sysOrderId=vm.getUrlParam('sysOrderId');
			for(let i=0;i<child.length;i++){
				if(child[i].nodeType===1&&(child[i].className=='active'||child[i].className=='active active2')){
					for(let k=0,item=child[i].childNodes;k<item.length;k++){
						if(item[k].nodeType===1)bag.push(item[k].name.split('|')[1]);
					}
				}
			}
			for(let j=0;j<bag.length;j++){
				type==1 ? bagCode+=vm.packageList[bag[j]].menuCode : bagCode+=vm.packageList[bag[j]].menuCode+'|';
			}
			type==1 ? url="package.html?type="+type+"&sysOrderId="+sysOrderId+"&packageCode="+bagCode+"&prestoreMoney="+prestoreMoney+"&activityCode="+activityCode+"" : url="package.html?type="+type+"&sysOrderId="+sysOrderId+"&packageCode="+packageCode+"&prestoreMoney="+prestoreMoney+"&activityCode="+activityCode+"&bag="+bagCode+"";
			Jsborya.pageBack({
				url:url,
				depiction:'选择套餐',
				isLoad:true
				// data:JSON.parse(window.localStorage.getItem('KM_ORDERINFO'))
			});
		},
		filterBr:function(str){
			return str?str.split('<br>'):str=[];
		},
	}
});


});