require('../../public.js');
require('../../assets/css/e_a.css');

Jsborya.ready(function(){


var app=new Vue({ 
	el: '#app',
	data:{
		off:{
			show7:true,
			show11:true
		},
		userInfo:'',
		month:[],//最近6个月，时间数组
		lastMonth:'',//上一个月
		check:5,//当前选择月数
		isPullLoad:true,//上拉加载开关
		page:1,//当前页
        window:'',//屏幕宽度
        list:{'list7':[],'list11':[],'monthTotal':0,'monthincentive':0,'monthMerchant':0,'listTotal7':0,'listTotal11':0},//数据列表
	},
	created:function(){
		this.window=document.documentElement.clientHeight;
	},
	mounted:function(){
		this.initPage();
	},
	methods:{
		initPage:function(){
			var vm=this;
			vm.filterMonth();
			var lastM=parseInt(vm.month[5].name)-1;
			lastM==0 ? vm.lastMonth=12 : vm.lastMonth=lastM;
			Jsborya.getUserInfo(function(data){
				var data=JSON.parse(BASE64.decode(data))
				vm.userInfo=data;
				vm.getList(1,function(){
					Jsborya.webviewLoading({isLoad:false});//关闭app加载层
				});
			});
		},
		tab:function(index){
			var vm=this;
			vm.check=index;
			vm.list.list7=vm.list.list11=[];
			var lastM=parseInt(vm.month[index].name)-1;
			lastM==0 ? vm.lastMonth=12 : vm.lastMonth=lastM;
			vm.getList();
		},
	  	getList:function(page,isCloseLoad){
	  		var vm=this;
	  		var json={
	  			'params':{
	  				'yearMonth':vm.month[vm.check].date
	  			},
	  			'userInfo':vm.userInfo
	  		};
	  		// !page&&(vm.page=1,vm.list={});
	  		vm.AJAX('../../../eas/c/account/openIncentive',json,function(data){
				vm.list=data.data;
				//vm.list=vm.list.concat(data.data.list)
			},isCloseLoad,true)
	  	},
	  	pullLoad:function(){
	    	// var vm=this,obj=document.getElementById('day-ul'),page=vm.page;
	    	// if(vm.isPullLoad&&obj.scrollHeight<=(obj.scrollTop+obj.offsetHeight)){
	    	// 	vm.isPullLoad=false;
	    	// 	page++;
	    	// 	vm.page=page;
	    	// 	vm.getList(page,true);
	    	// }
	    },
	  	filterMonth:function(){
			var arr=[],t=new Date(),y=t.getFullYear(),m=t.getMonth()+1,vm=this;
			for(var i=0;i<6;i++){
				var mm=m-i,yy=y;
				mm<=0&&(mm=12-Math.abs(mm),yy=y-1);
				mm<10&&(mm='0'+mm);
				var startTime=yy+'-'+mm+'-01 00:00:00';
				var endTime= mm!=12 ? vm.get_unix_time(yy+'-'+(parseInt(mm)+1)+'-1 00:00:00') : vm.get_unix_time((yy+1)+'-1-1 00:00:00');
				arr[i]={'name':mm+'月','startTime':startTime,'endTime':vm.getDateTime(endTime-1)[6],'date':String(yy)+mm}
			}
			this.month=arr.reverse();
		},
		filterNumber:function(value){
	  		return (parseFloat(value)/100).toFixed(2);
	  	},
	  	filterList:function(list){
	  		console.log(1);
	  		var vm=this,arr={};
	  		for(var i in list){
	  			var dateTime=list[i].dateTime;
	  			if(typeof arr[dateTime]==='undefined')arr[dateTime]=[];
	  			arr[dateTime].push({'free':list[i].free,'type':list[i].type,'dateTime':dateTime});
	  		}
	  		return arr;
	  	},
	  	showList:function(type){
			// if(type==1){
			// 	this.off.show7 ? this.off.show7=false : this.off.show7=true;
			// }else if(type==2){
			// 	this.off.show11 ? this.off.show11=false : this.off.show11=true;
			// }
	  	},
	  	showListDetails(e){
			// var p=e.target.parentNode.parentNode.parentNode,ul='',yearMonth=new Date().getFullYear()+e.target.title,vm=this;
			// for(let i=0;i<p.childNodes.length;i++){
			// 	if(p.childNodes[i].nodeName==="UL")ul=p.childNodes[i];
			// }
			// var json={
	  // 			'params':{
	  // 				'yearMonth':yearMonth.replace(/-/,''),
	  // 				'type':7,
	  // 			},
	  // 			'userInfo':vm.userInfo
	  // 		};
	  // 		if(e.target.className!="fr"){
			// 	e.target.className='fr';
			// 	ul.style.display='none';
			// 	return false;
	  // 		}
	  // 		vm.AJAX('../../../eas/c/account/detail',json,function(data){
			// 	var str='',list=data.data.list;
			// 	for(let i=0;i<list.length;i++){
			// 		str+='<li class="clr"><span>'+list[i].src_dealer_name+'</span><span class="fr">'+vm.filterNumber(list[i].free)+'</span></li>';
			// 	}
			// 	list.length==0&&(str+='<li class="m-no-data">暂无数据</li>');
			// 	e.target.className='fr active';
			// 	ul.style.display='block';
			// 	ul.innerHTML=str;
			// },false,true);
	  	},
	}
	
});


});