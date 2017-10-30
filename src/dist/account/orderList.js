require('../../public.js');
require('../../assets/css/orderList.css');

Jsborya.ready(function(){


var app=new Vue({
	el:'#app',
	data:{
		total:0,
		type:1,
		list:[],
		searchData:[],
		searchInput:'',
		month:[],
		drop:{
			off:0,
			name:'全部订单',
			type:0
		},
		check:5,
		userInfo:'',
		windowHeight:400,
		isPullLoad:true,
		page:1
	},
	mounted:function(){
		this.initPage()
	},
	methods:{
		initPage:function(){
			var vm=this;
			vm.filterMonth();
			Jsborya.getUserInfo(function(data){
				var data=JSON.parse(BASE64.decode(data))
				vm.userInfo=data;
				var param=vm.getUrlParam('param');
				param ? vm.type=2 :(vm.type=1,vm.getList(1,function(){
					Jsborya.webviewLoading({isLoad:false});//关闭app加载层
				}));
			});
			
			window.innerHeight>1000 ? vm.windowHeight=(document.documentElement.clientHeight+document.body.clientHeight) : vm.windowHeight=window.innerHeight;
			var appDom=document.getElementById('app');
			document.attachEvent ? appDom.attachEvent("onclick",function(event){
				vm.drop.off=false
				window.event.cacenlBubble=false;
			}) : appDom.addEventListener("click", function(event) {
				vm.drop.off=false
				event.stopPropagation();
			},false);
		},
		filterMonth:function(){
			var arr=[],t=new Date(),y=t.getFullYear(),m=t.getMonth()+1,vm=this;
			for(var i=0;i<6;i++){
				var mm=m-i,yy=y;
				mm<=0&&(mm=12-Math.abs(mm),yy=y-1);
				mm<10&&(mm='0'+mm);
				var startTime=yy+'-'+mm+'-01 00:00:00';
				var endTime= mm!=12 ? vm.get_unix_time(yy+'-'+(parseInt(mm)+1)+'-1 00:00:00') : vm.get_unix_time((yy+1)+'-1-1 00:00:00');
				arr[i]={'name':mm+'月','startTime':startTime,'endTime':vm.getDateTime(endTime-1)[6]}
			}
			this.month=arr.reverse();
		},
		tab:function(index){
			var vm=this;
			vm.check=index;
			vm.getList();
		},
		getList:function(page,closeLoad){
			var vm=this,json={
	  			'params':{
	  				'startTime':vm.month[vm.check].startTime,
	  				'endTime':vm.month[vm.check].endTime,
	  				'pageNum':page||1,
	  				'pageSize':10,
	  				'orderStatus':vm.drop.type
	  			},
	  			'userInfo':vm.userInfo
	  		};
			!page&&(vm.page=1,vm.list=[]);
			vm.AJAX('../../../eas/w/searchcard/orderList',json,function(data){
				vm.list=vm.list.concat(data.data.list);
				vm.total=parseInt(data.data.total);
				vm.isPullLoad=true
			},closeLoad)
		},
		pullLoad:function(){
	    	var vm=this,obj=document.getElementById('listUl'),page=vm.page;
	    	if(vm.isPullLoad&&obj.scrollHeight<=(obj.scrollTop+obj.offsetHeight)){
	    		vm.isPullLoad=false;
	    		page++;
	    		vm.page=page;
	    		vm.getList(page,true);
	    	}
	    },
	    search:function(){
	    	var vm=this,json={
	  			'params':{
	  				'context':vm.searchInput
	  			},
	  			'userInfo':vm.userInfo
	  		};
	    	if(!json.params.context){
	    		layer.open({content:'请输入订单号或手机号',skin: "msg",msgSkin:'error',time: 2});
	    		return false;
	    	}else if(json.params.context.length<11){
	    		layer.open({content:'手机号码格式错误',skin: "msg",msgSkin:'error',time: 2});
	    		return false;
	    	}else if(json.params.context.length>11&&json.params.context.length<18){
	    		layer.open({content:'订单号长度最小为18位',skin: "msg",msgSkin:'error',time: 2});
	    		return false;
	    	}
	    	vm.AJAX('../../../eas/w/searchcard/seekOrder',json,function(data){
				vm.searchData=data.data.list;
				document.getElementById('searchTag').style.display="block"
			})
	    },
		dropDown:function(e){
			var vm=this,obj=e.target;
			obj.title&&(vm.drop.name=obj.innerHTML,vm.drop.type=obj.title,vm.getList())
			vm.drop.off ? vm.drop.off=false : vm.drop.off=true;
			document.attachEvent ? window.event.cacenlBubble=false : e.stopPropagation();
		},
		tLevel:function(v){
			var levelArr=['','特级,','','','','',''];
	    	return levelArr[parseInt(v)];
		},
	}
})


});