import HelloWorld from "./HelloWorld.vue";
import Vue from "Vue";

// new Vue({
//     el: "#app",
//     template: "<HelloWorld/>",
//     components: { HelloWorld }
// }) 

// 真正的生产环境不能用template 官方用的是render()

new Vue({
    el: "#app",
   render: h => h(HelloWorld)
}) ;