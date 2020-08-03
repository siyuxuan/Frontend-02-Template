const images = require('images');

function render(veiwport,element){
    if(element.style){
        var img = images(element.style.width,element.style.height);

        if(element.style['background-color']){
            let color = element.style['background-color'] || 'rgb(0,0,0)';
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1),Number(RegExp.$2),Number(RegExp.$3), 1);
            veiwport.draw(img, element.style.left || 0,element.style.top || 0);
        }
    }
}