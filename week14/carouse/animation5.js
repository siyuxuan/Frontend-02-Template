const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
    constructor(){
        // this.animation 队列 
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }
    start(){
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () =>{
            // console.log("tick");
            let now = Date.now();
            for(let animation of this[ANIMATIONS]){
                let t;
                if(this[START_TIME].get(animation)< startTime){
                   t = now - startTime - this[PAUSE_TIME] - animation.delay;
                }else{
                    t = now - this[START_TIME].get(animation)- this[PAUSE_TIME] - animation.delay;
                }
                // console.log(animation)
                if(animation.duration < t){
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                if(t >0){
                    animation.receive(t);
                }
                
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
// 暂停animation
    pause(){
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume(){
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }


    reset(){}
    add(animation,startTime){
        if(arguments.length <2){
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation,startTime);
        // 添加delay
    }
}
// 属性动画
export class Animation {
    constructor(object,property, startValue, endValue, duration,delay, timingFunction, template ){
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction || (v => v);
        this.template = template || (v => v); 
    }

    receive(time){
        // console.log(time);
        let range = this.endValue - this.startValue;
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);

    }

}