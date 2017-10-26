//import Vue from 'vue';
window.Vue=require('vue');
import utils from './assets/js/utils.js';

Vue.use(utils);

var FastClick = require('fastclick');
FastClick.attach(document.body);

require("./assets/css/base.css");
require('./assets/js/layer/layer.js');
require("./assets/js/layer/need/layer.css");
require("./assets/js/max.borya_app.js");

window.onload = function() {
    document.body.addEventListener("touchstart", function() {});
};
