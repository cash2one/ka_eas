webpackJsonp([14],{0:function(e,t,o){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=o(3),p=a(r);o(1),o(100),Jsborya.ready(function(){new Vue({el:"#app",data:{off:{typeLevelZero:99999,typeLevelOne:99999,typeLevelTwo:99999,typePrice:99999,typeNumMore:99999,typeNumLess:99999},bottomImgH:"85px",liSpace:"0",selectCity:{cityCode:"100",cityName:"全国"},showCardList:!0,showOrderTips:!1,isOffScreen:!1,dragStatus:1,position:{transform:"translate3d(0,0,0)"},pageSize:12,endDrop:"",phoneType:0,userInfo:"",cardList:{list:[]},orderInfo:"",ruleData:{isContain:[{typeName:"不含4",typeCode:"200004"}],special:[{typeName:"全部",typeCode:"130000"},{typeName:"领导号",typeCode:"130001"},{typeName:"情侣号",typeCode:"130002"}],senior:[{typeName:"全部",typeCode:"110000"},{typeName:"四连及以上",typeCode:"100002"},{typeName:"对号",typeCode:"100003"},{typeName:"顺子",typeCode:"100004"},{typeName:"ABCABCABC",typeCode:"100005"},{typeName:"AAAABBBBC",typeCode:"100006"},{typeName:"AAABBBBC",typeCode:"100007"},{typeName:"ABCDABCD",typeCode:"100008"},{typeName:"ABABABABAB",typeCode:"100009"},{typeName:"ABABABAB",typeCode:"100010"},{typeName:"AAABBBC",typeCode:"100011"},{typeName:"AAABBBB",typeCode:"100018"},{typeName:"AAABBBCCC",typeCode:"100019"},{typeName:"AABBBBB",typeCode:"100020"},{typeName:"3拖3",typeCode:"100012"},{typeName:"4拖3",typeCode:"100013"},{typeName:"4拖4",typeCode:"100014"},{typeName:"5拖2",typeCode:"100015"},{typeName:"5拖3",typeCode:"100016"},{typeName:"6拖2",typeCode:"100017"}],ordinary:[{typeName:"全部",typeCode:"120000"},{typeName:"小靓号",typeCode:"100060"},{typeName:"三连号",typeCode:"100023"},{typeName:"对号",typeCode:"100027"},{typeName:"顺子",typeCode:"100025"},{typeName:"ABAB",typeCode:"100028"},{typeName:"ABABAB",typeCode:"100029"},{typeName:"ABCABC",typeCode:"100030"},{typeName:"AABAAB",typeCode:"100036"},{typeName:"ABBABB",typeCode:"100037"},{typeName:"AABBB",typeCode:"100038"},{typeName:"3拖2",typeCode:"100031"},{typeName:"3拖3",typeCode:"100032"},{typeName:"4拖2",typeCode:"100033"},{typeName:"5拖2",typeCode:"100035"},{typeName:"4拖3",typeCode:"100034"}],price:[{typeName:"100以下",typeCode:"100049"},{typeName:"100~500",typeCode:"100050"},{typeName:"500~1000",typeCode:"100051"},{typeName:"1000~5000",typeCode:"100052"},{typeName:"5000~10000",typeCode:"100053"},{typeName:"1万以上",typeCode:"100054"}],number:[{typeName:"0较多",typeCode:"100039"},{typeName:"1较多",typeCode:"100040"},{typeName:"2较多",typeCode:"100041"},{typeName:"3较多",typeCode:"100042"},{typeName:"4较多",typeCode:"100043"},{typeName:"5较多",typeCode:"100044"},{typeName:"6较多",typeCode:"100045"},{typeName:"7较多",typeCode:"100046"},{typeName:"8较多",typeCode:"100047"},{typeName:"9较多",typeCode:"100048"}]}},created:function(){Jsborya.webviewLoading({isLoad:!1})},mounted:function(){this.initPage()},methods:{initPage:function(){var e=this,t=e.getUrlParam("type")||"",o=window.localStorage.getItem("haveSeen"),a=document.documentElement.clientHeight,r=document.documentElement.clientWidth,p=(r-20)/4.25,i=Math.floor((a-119-p)/45),y=r<=469?2:r<=719?3:4,s=a-119-p-45*i;if(e.liSpace=s/i/2+"px 0px",e.pageSize=i*y,e.bottomImgH=p+"px",t){var d=e.getUrlParam("data");d=JSON.parse(BASE64.decode(d)),"city"==t&&(e.selectCity=d,Jsborya.getUserInfo(function(t){e.userInfo=JSON.parse(BASE64.decode(t)),999==o?e.backHome():e.getOrderTips()}))}else Jsborya.getUserInfo(function(t){var t=JSON.parse(BASE64.decode(t));e.userInfo=t,e.selectCity={cityCode:t.cityCode,cityName:t.city},999==o?e.backHome():e.getOrderTips()})},getOrderTips:function(e){var t=this,o={userInfo:t.userInfo};t.AJAX("../../../eas/w/searchcard/getOrder",o,function(e){e.data?(t.orderInfo=e.data,t.countDown(),t.orderInfo.numberLevel=t.filterLevel(t.orderInfo.numberLevel),t.showOrderTips=!0,t.showCardList=!1):t.backHome()},e)},getCardList:function(e){var t=this,o={params:{cityCode:t.selectCity.cityCode,type:3,page:1,pretty:0,phoneType:t.phoneType,pageSize:t.pageSize,typeLevelZero:99999!=t.off.typeLevelZero?t.ruleData.special[t.off.typeLevelZero].typeCode:"",typeLevelOne:99999!=t.off.typeLevelOne?t.ruleData.senior[t.off.typeLevelOne].typeCode:"",typeLevelTwo:99999!=t.off.typeLevelTwo?t.ruleData.ordinary[t.off.typeLevelTwo].typeCode:"",typePrice:99999!=t.off.typePrice?t.ruleData.price[t.off.typePrice].typeCode:"",typeNumMore:99999!=t.off.typeNumMore?t.ruleData.number[t.off.typeNumMore].typeCode:"",typeNumLess:99999!=t.off.typeNumLess?t.ruleData.isContain[t.off.typeNumLess].typeCode:""},userInfo:t.userInfo};t.AJAX("../../../eas/w/searchcard/getNumberList",o,function(o){t.cardList=o.data,e&&(t.dragStatus=5,setTimeout(function(){t.position={transform:"translate3d(0,0,0)"},setTimeout(function(){t.dragStatus=1},300)},500))},e)},shiftPhoneType:function(e){var t=this;0!=t.phoneType&&t.phoneType!=e?t.phoneType=0:1==e?t.phoneType=2:2==e&&(t.phoneType=1),t.initRuleCheck()},shiftRule:function(e,t){1==t?(e==this.off.typeLevelZero?this.off.typeLevelZero=99999:this.off.typeLevelZero=e,this.off.typeLevelOne=99999,this.off.typeLevelTwo=99999):2==t?(e==this.off.typeLevelOne?this.off.typeLevelOne=99999:this.off.typeLevelOne=e,this.off.typeLevelZero=99999,this.off.typeLevelTwo=99999):3==t?(e==this.off.typeLevelTwo?this.off.typeLevelTwo=99999:this.off.typeLevelTwo=e,this.off.typeLevelZero=99999,this.off.typeLevelOne=99999):4==t?e==this.off.typePrice?this.off.typePrice=99999:this.off.typePrice=e:5==t?e==this.off.typeNumMore?this.off.typeNumMore=99999:this.off.typeNumMore=e:6==t&&(e==this.off.typeNumLess?this.off.typeNumLess=99999:this.off.typeNumLess=e)},initRuleCheck:function(){this.off={typeLevelZero:99999,typeLevelOne:99999,typeLevelTwo:99999,typePrice:99999,typeNumMore:99999,typeNumLess:99999}},selectRule:function(){this.switchPage("SCREEN");var e=this,t={params:{cityCode:e.selectCity.cityCode,type:3,page:1,pretty:0,phoneType:e.phoneType,pageSize:e.pageSize,typeLevelZero:99999!=e.off.typeLevelZero?e.ruleData.special[e.off.typeLevelZero].typeCode:"",typeLevelOne:99999!=e.off.typeLevelOne?e.ruleData.senior[e.off.typeLevelOne].typeCode:"",typeLevelTwo:99999!=e.off.typeLevelTwo?e.ruleData.ordinary[e.off.typeLevelTwo].typeCode:"",typePrice:99999!=e.off.typePrice?e.ruleData.price[e.off.typePrice].typeCode:"",typeNumMore:99999!=e.off.typeNumMore?e.ruleData.number[e.off.typeNumMore].typeCode:"",typeNumLess:99999!=e.off.typeNumLess?e.ruleData.isContain[e.off.typeNumLess].typeCode:""},userInfo:e.userInfo};e.AJAX("../../../eas/w/searchcard/getNumberList",t,function(t){e.cardList=t.data})},continueOrder:function(){var e,t=this,o="选择套餐",a={userInfo:t.userInfo};t.AJAX("../../../eas/w/searchcard/getOrder",a,function(a){a.data?(window.localStorage.setItem("haveSeen",""),1e3==t.orderInfo.orderStatusCode&&(e=2==t.orderInfo.cardType?"unicomPackage.html?sysOrderId="+t.orderInfo.sysOrderId:"package.html?sysOrderId="+t.orderInfo.sysOrderId),Jsborya.pageJump({url:e,stepCode:t.orderInfo.orderStatusCode,depiction:o,data:t.orderInfo})):t.backHome()})},abandon:function(e){var t=this;layer.open({title:"提示",content:"您要放弃未完成的订单的后续操作么？",btn:["放弃","取消"],yes:function(){var o={params:{sysOrderId:e},userInfo:t.userInfo};t.AJAX("../../../eas/w/searchcard/orderCancel",o,function(e){"676"==e.code?(t.getOrderTips(),layer.closeAll()):(t.backHome(),window.localStorage.setItem("haveSeen",""),layer.open({title:"操作成功",content:"订单已取消，若已支付，支付货款将退回至您的账户",btn:["确定"]}))})}})},selectCard:function(e,t,o){var a=this,r={params:{number:e,phoneType:o},userInfo:a.userInfo};return 2==o&&1==a.cardList.isNewVersion?(layer.open({title:"提示",content:'当前版本不支持选择<b class="purple">联通号码</b>，请更新到最新版本。',btn:["确定"]}),!1):1==a.dragStatus&&void a.AJAX("../../../eas/w/searchcard/orderCreate",r,function(r){if("681"==r.code)layer.open({title:"提示",content:"当前有未处理订单，是否处理订单？",btn:["处理订单","取消"],yes:function(){a.getOrderTips(),layer.closeAll()}});else{var p="";p=2==o?"unicomPackage.html?sysOrderId="+r.data.sysOrderId:"package.html?sysOrderId="+r.data.sysOrderId,Jsborya.pageJump({url:p,stepCode:"1000",depiction:"选择套餐",data:{createTime:r.data.createTime,sysOrderId:r.data.sysOrderId,limitSimilarity:r.data.limitSimilarity,cityName:t,orderStatusCode:"1000",privilegeType:r.data.privilegeType,cardType:o,phoneNumber:e}})}})},backHome:function(){this.getCardList(),this.showCardList=!0,this.showOrderTips=!1},haveSeen:function(){window.localStorage.setItem("haveSeen","999"),this.backHome()},switchPage:function(e){switch(e){case"SCREEN":this.isOffScreen?(this.isOffScreen=!1,document.body.style.overflowY="auto"):(this.isOffScreen=!0,document.body.style.overflowY="hidden"),document.getElementById("ruleCheck").scrollTop=0;break;case"SEARCH":var t={cityCode:this.selectCity.cityCode,cityName:this.selectCity.cityName};t=BASE64.encode((0,p.default)(t)),Jsborya.pageJump({url:"search.html?data="+t,stepCode:"999",depiction:"搜索号码"});break;case"CITY":var t={cityName:this.selectCity.cityName,cityCode:this.selectCity.cityCode,title:"选号"};t=BASE64.encode((0,p.default)(t)),Jsborya.pageJump({url:"city.html?data="+t+"&back=index",stepCode:"999",depiction:"选择城市"});break;case"MORE":var o=this,t={cityName:o.selectCity.cityName,cityCode:o.selectCity.cityCode,title:"选号"};t=BASE64.encode((0,p.default)(t)),Jsborya.pageJump({url:"more.html?data="+t,stepCode:"999",depiction:"更多号码"})}},startDrag:function(e){return e=e.changedTouches?e.changedTouches[0]:e,this.endDrop={x:e.pageX,y:e.pageY,time:(new Date).getTime()},4!=this.dragStatus&&void(1==this.dragStatus&&(this.dragStatus=2))},onDrag:function(e){var t=e;if(e=e.changedTouches?e.changedTouches[0]:e,2==this.dragStatus){var o=e.pageX-this.endDrop.x,a=e.pageY-this.endDrop.y,r=Math.abs(o)<Math.abs(a)?1:0;t.preventDefault(),1==r&&0<a&&a<120&&(this.position={transform:"translate3d(0,"+a+"px,0)"},a>90&&(this.dragStatus=3))}},stopDrag:function(e){if(e=e.changedTouches?e.changedTouches[0]:e,4==this.dragStatus)return!1;var t=this,o=e.pageY-t.endDrop.y,a=+(new Date).getTime()-this.endDrop.time;o>90&&3==t.dragStatus&&Number(a)>100?(t.position={transform:"translate3d(0,45px,0)"},t.dragStatus=4,t.getCardList(!0)):(t.position={transform:"translate3d(0,0,0)"},this.dragStatus=1)},countDown:function(){var e=this,t=parseInt(e.orderInfo.validTime);e.orderInfo.validTime="00:00",clearInterval(window.timer);var o=function(e){var t=e%60,o=Math.floor(e/60);return t<=9&&(t="0"+t),o<=9&&(o="0"+o),o+":"+t};window.timer=setInterval(function(){t--,0==t?(e.orderInfo.validTime="00:00",clearInterval(window.timer),window.location.reload()):e.orderInfo.validTime=o(t)},1e3)},jump:function(){Jsborya.pageJump({url:"unicomPanel.html",stepCode:"999",depiction:"联通套餐专区"})}}})})},100:function(e,t){}});