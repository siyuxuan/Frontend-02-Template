const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");

export class Timeline {
    constructor(){
        
        // this.animation 队列 
        this[ANIMATIONS] = new Set();
    }
    start(){
        let startTime = Date.now();
        this[TICK] = () =>{
            // console.log("tick");
            let t = Date.now()- startTime;
            for(let animation of this[ANIMATIONS]){
                // console.log(t)
                let t0 = t;
                if(animation.duration < t){
                    this[ANIMATIONS].delete(animation);
                    t0 = animation.duration;
                }
                animation.receive(t0);
            }
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    pause(){}
    resume(){}

    reset(){}
    add(animation){
        this[ANIMATIONS].add(animation)
    }
}
// 属性动画
export class Animation {
    constructor(object,property, startValue, endValue, duration,timingFunction){
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }

    receive(time){
        // console.log(time);
        let range = this.endValue - this.startValue;
        this.object[this.property] = this.startValue + range * time / this.duration;

    }

}