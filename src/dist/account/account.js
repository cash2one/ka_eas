require('../../public.js');
require('../../assets/css/c_a.css');

import dynamics from "dynamics.js"
Jsborya.ready(function(){


var app=new Vue({ 
	el: '#app',
	data:{
		userInfo:'',
		dragStatus:0,//拖拽开关
		select:0,
		c: { x: 0, y: 0 },//二次贝塞尔曲线坐标
        start: { x: 0, y: 0 },//记录拖拽起始坐标
        window:'',//屏幕宽度
        isLoad:0,
        list:[
            {
                "list": []
            },
            {
                "list": []
            },
            {
                "list": []
            },
            {
                "list": []
            },
            {
                "list": []
            },
            {
                "list": []
            }
        ],//数据列表
        offArr:[0,0,0,0,0,0],
        monthArr:'',
        listStyle:''
	},
	created:function(){
		Jsborya.webviewLoading({isLoad:false});//关闭app加载层
		this.window=document.documentElement.clientWidth;
		this.listStyle={"maxHeight":(document.documentElement.clientHeight-70)+'px'};
	},
	mounted:function(){
		this.initPage()
		this.filterMonth();
	},
	methods:{
		initPage:function(){
			var vm=this;
			Jsborya.getUserInfo(function(data){
				var data=JSON.parse(BASE64.decode(data))
				vm.userInfo=data;
				vm.dragStatus=2;
	    		dynamics.animate(vm.c, {
		          x:vm.window/2,
		          y: 60
		        }, {
		          type: dynamics.spring,
		          duration: 700,
		          friction: 280
		        })
				vm.getList();
			})
		},
	  	getList:function(){
	  		var vm=this;
	  		vm.isLoad=true;
	  		var json={'userInfo':vm.userInfo};
	  		vm.AJAX('../../../eas/c/account/change',json,function(data){
	  			vm.dragStatus=3;
	  			vm.isLoad=false;
	  			setTimeout(function(){
	  				dynamics.animate(vm.c, {
			          x:0,
			          y:0
			        }, {
			          type: dynamics.spring,
			          duration: 700,
			          friction: 280
			        })
			        vm.dragStatus=0;
	  			},800);
				data.data.list.length&&(vm.list=data.data.list);
				Vue.set(vm.offArr,0,true)
			},true,true)
	  	},
	  	filterDay:function(index){
	  		var vm=this,list=vm.list[index].list,arr=[],row={};
	  		for(var i in list){
	  			var m_d=vm.getDateTime(list[i].dateTime)[4];
	  			var h_m=vm.getDateTime(list[i].dateTime)[5];
	  			if(typeof row[m_d]==='undefined')row[m_d]=[];
	  			row[m_d].push({'h_m':h_m,'orderId':list[i].orderId,'phone':list[i].phone,'money':list[i].money})
	  		}
			return row;
	  	},
	  	filterNumber:function(value){
	  		return (parseFloat(value)/100).toFixed(2);
	  	},
	  	openLi:function(index){
	  		var vm=this;
	  		if(vm.isLoad)return false;
	  		vm.select=index;
	  		vm.offArr[index] ? Vue.set(vm.offArr,index,false) : (vm.offArr=[0,0,0,0,0,0],Vue.set(vm.offArr,index,true));
	  	},
	  	filterMonth:function(){
			var arr=[],t=new Date(),y=t.getFullYear(),m=t.getMonth()+1,vm=this;
			for(var i=0;i<6;i++){
				var mm=m-i,yy=y;
				mm<=0&&(mm=12-Math.abs(mm),yy=y-1);
				mm<10&&(mm='0'+mm);
				var startTime=yy+'-'+mm+'-01 00:00:00';
				var endTime= mm!=12 ? vm.get_unix_time(yy+'-'+(parseInt(mm)+1)+'-1 00:00:00') : vm.get_unix_time((yy+1)+'-1-1 00:00:00');
				i==0&&(mm='本')
				arr[i]={'name':mm+'月','startTime':startTime,'endTime':vm.getDateTime(endTime-1)[6]}
			}
			vm.monthArr=arr;
		},
		headerPath: function (){
	      var w=this.window; 
	      return 'M0,0 L'+w+',0 '+w+',0' +
	        'Q' + this.c.x + ',' + this.c.y +
	        ' 0,0'
	    },
	    contentPosition: function () {
	      var dy = this.c.y - 0
	      var dampen = dy > 0 ? 2 : 4
	      return {
	        transform: 'translate3d(0,' + dy / dampen + 'px,0)'
	      }
	    },
		startDrag: function (e) {
	      e = e.changedTouches ? e.changedTouches[0] : e;
	      var vm=this;
	      if(this.isLoad)return false;
	      var dom=document.getElementById('month'+vm.select);
	      if(dom.scrollTop!=0){
	      	this.dragStatus = 0
	      	return false;
	      }
	      this.dragStatus = 1;
	      this.start.x = e.pageX;
	      this.start.y = e.pageY;
	      this.start.time=new Date().getTime();
	    },
	    onDrag: function (e) {
	      var event=e;
	      e = e.changedTouches ? e.changedTouches[0] : e;
	      var dom=document.getElementById('month'+this.select);
	      if(dom.scrollTop!=0){
	      	this.dragStatus = 0
	      	return false;
	      }
	      if (this.dragStatus==1||999) {
	        var x= 0 + (e.pageX - this.start.x) 
	        var dy = e.pageY - this.start.y
	        var dampen = dy > 0 ? 1.5 : 4
	        var y = 0 + dy / dampen
	        if(y>0&&document.body.scrollTop==0){
	        	event.preventDefault();
	        }
	        var duration=+new Date().getTime()-this.start.time;
		    var isDrop=Math.abs(x) < Math.abs(y) ? 1:0;//是否向下滑动
		    if(isDrop==1&&Number(duration)>120&&dy>0){
		    	
		    	this.c.x=x;
		    	this.dragStatus=999;//滑动
		   		if(dy<400){this.c.y=y}
		    }
	      }
	    },
	    stopDrag: function (e) {
	      e = e.changedTouches ? e.changedTouches[0] : e;
	      var dom=document.getElementById('month'+this.select);
	      if(dom.scrollTop!=0){
	      	this.dragStatus = 0
	      	return false;
	      }
	      var dy = e.pageY - this.start.y;
	      if (this.dragStatus==999) {
	      	if(120<dy){
	    		this.dragStatus=2
	    		dynamics.animate(this.c, {
		          x:this.window/2,
		          y: 60
		        }, {
		          type: dynamics.spring,
		          duration: 700,
		          friction: 280
		        })
		        this.getList();
	    	}else if(!this.isLoad){
	    		this.dragStatus=0;
	    		dynamics.animate(this.c, {
		          x:0,
		          y:0
		        }, {
		          type: dynamics.spring,
		          duration: 700,
		          friction: 280
		        })
	    	}
	        
	      }
	    }
	}
	
})


});