const CHRESS_X = 15;
const CHRESS_Y = 15;

let computer = false;
let user = true;
let _useri = 0, _userj = 0; //记录用户下棋的坐标
let _compi = 0, _compj = 0; //记录计算机当前下棋的坐标
let _myWin = [], _compWin = []; //记录用户，计算机赢的情况
let backAble = false, returnAble = false; 
let resultTxt = document.getElementById('result-wrap');
// 悔棋
let backBtn = document.getElementById("goback");
// let returnbtn = document.getElementById("return");
let chressBord = [];//棋盘


for(let i=0; i< CHRESS_X; i++){
    chressBord[i] = [];
    for (let j = 0; j<CHRESS_Y; j++){
        chressBord[i][j] = 0;
    }
}

// 绘制棋盘
let chess = document.getElementById("chess");
// 判断canvas节点是否具有getContext方法, 如果没有, 则说明浏览器不支持canvas
let ctx = chess.getContext('2d');

ctx.strokeStyle = "#ccc";//边框颜色

window.onload = function(){
    drawChessBoard();
}

// 棋盘绘制函数
function drawChessBoard(){
    for(let i= 0; i<CHRESS_X;i++){
        ctx.moveTo(15 + i * 30 , 15);
        ctx.lineTo(15 + i * 30 , 435);
        ctx.stroke();
        ctx.moveTo(15,15+i*30);
        ctx.lineTo(435,15+i*30);
        ctx.stroke();
    }
}

  //画棋子
function oneStep(i,j,user) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);// 画圆
    context.closePath();
    //渐变
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);

    if(user){
        gradient.addColorStop(0,'#0a0a0a');
        gradient.addColorStop(1,'#636766');
    }else{
        gradient.addColorStop(0,'#d1d1d1');
        gradient.addColorStop(1,'#f9f9f9');
    }
    context.fillStyle = gradient;
    context.fill();
}
//销毁棋子
function minusStep(i,j) {
    //擦除该圆
    context.clearRect((i) * 30, (j) * 30, 30, 30);

    // 重画该圆周围的格子
    context.beginPath();
    context.moveTo(15+i*30 , j*30);
    context.lineTo(15+i*30 , j*30 + 30);
    context.moveTo(i*30, j*30+15);
    context.lineTo((i+1)*30 , j*30+15);

    context.stroke();
}




