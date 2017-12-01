const canvas=document.getElementById('gamefield');
const ctx=canvas.getContext('2d');




ctx.fillStyle='black';
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.scale(20, 20);
const matrix=[
    [0,0,0],
    [1,1,1],
    [0,1,0]
];

let score=0;
let level=1;
let scorespan=document.getElementById("score");
let levelspan=document.getElementById("level");

function givescore(){
  if(score >=1000)
  {
      score=0;
      level+=1;
      dropinterval-=20;
      console.log(dropinterval);
      let levelstring=level.toString();
      while(levelstring.length <4)
      {
        levelstring="0".concat(levelstring);
      }
      levelspan.textContent=levelstring;
     
  }
  else{
    score+=50;
  }
  
  let scorestring=score.toString();
  while(scorestring.length <4){
      scorestring="0".concat(scorestring);
  }
  scorespan.textContent=scorestring;

}


function createpiece(){
    const allmatrix={
        L:[
            [0,1,0],
            [0,1,0],
            [0,1,1]
        ],
        T:[
            [2,2,2],
            [0,2,0],
            [0,0,0]
        ],
        S:[
            [3,3,0],
            [3,3,0],
            [0,0,0]
        ],
        Z:[
            [4,0,0],
            [4,4,0],
            [0,4,0]
        ],
        N:[
            [0,0,6],
            [0,6,6],
            [0,6,0]
        ],
        I:[
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ],
        J:[
            [0,7,0],
            [0,7,0],
            [7,7,0]
        ]
    }
    const types='LTSZNIJ';
    return allmatrix[types[types.length*Math.random() | 0 ]];
}

function playerReset(){

    player.matrix=createpiece();
    player.pos.x=(arena[0].length/2 |0)-(player.matrix[0].length/2 |0);
    player.pos.y=0;
    if(collide(arena,player)){
        arena.map(row=>{
            row.fill(0);
        });
    scorespan.textContent="0000";
    levelspan.textContent="0001";
    dropinterval=1000;


    }

}

function removeRow(){
   outer: for(let y=arena.length-1;y>0;--y){
       for(let x=0;x<=arena[y].length;++x){
           if(arena[y][x]===0) continue outer;
       }

       const row=arena.splice(y,1)[0].fill(0);
       arena.unshift(row);
       givescore();
       ++y;

   }

}


function rotatematrix(matrix,dir){
    for(let y=0;y<matrix.length;++y){
        for(let x=0;x<y;++x){
            [
                matrix[y][x],
                matrix[x][y]
            ]=[
                matrix[x][y],
                matrix[y][x]
            ]
        }
    }
    if(dir >0) matrix.forEach((row,y)=>{
         row.reverse();
    });
    else matrix.reverse();
}


function playerrotate(dir){
    let pos=player.pos.x;
    let offset=0;
    rotatematrix(player.matrix,dir);
    while(collide(arena,player)){
        player.pos.x+=offset;
        offset=-(offset+(offset >0 ? 1 :-1));
        if(offset> player.matrix[0].length){
            rotatematrix(player.matrix,-dir);
            player.pos.x=pos;
            return;
        }
    }
}


function collide(arena,player){
    const [m,o]=[player.matrix,player.pos];
    for(let y=0;y<m.length;y++){
        for(let x=0;x<m[y].length;x++){
            if(m[y][x] !==0 && (arena[y+o.y] && arena[y+o.y][x+o.x])!==0){
                return true;
            }
        }
    }
    return false;
}

function creatematrix(w,h){
    const matrix=[];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }

    return matrix;
}

function merge(arena,player){
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value !==0){
                arena[y+player.pos.y][x+player.pos.x]=value;
            }
          
        });
    });
}

function drawMatrix(matrix,offset){
    const colors=[null,'red','green','yellow','pink','blue','violet','orange'];
    matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
          if(value!==0){
              ctx.fillStyle=colors[value];
              ctx.fillRect(x + offset.x,
                           y + offset.y,
                           1,1); 
             ctx.lineWidth=0.1;
              ctx.strokeStyle = "#ffffff";
              ctx.strokeRect(x + offset.x,
                             y + offset.y,
                             1,1);                      
          }
        });
      });
}


const arena=creatematrix(20,25); 
const player={
   pos    :{x:8,y:0},
   matrix :createpiece()
}

function draw(){
    ctx.fillStyle='black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawMatrix(arena,{x:0,y:0});
    drawMatrix(player.matrix,player.pos);
}

function playerMove(dir){
    player.pos.x+=dir;
    if(collide(arena,player)){
        player.pos.x -=dir;
    }
}
function playerdrop(){
    player.pos.y++;
   if(collide(arena,player)){
        player.pos.y--;
        merge(arena,player);
        playerReset(); 
        removeRow();
    }
    dropcounter=0;
}

let dropcounter=0;
let dropinterval=1000;
let lasttime=0;

function update(time=0){
    let deltatime=time-lasttime;
    lasttime=time;
    dropcounter +=deltatime;
    if(dropcounter>dropinterval)
    {
        playerdrop();
    }
    draw();
    requestAnimationFrame(update);
}

update();


















document.addEventListener('keydown',function(event){
   if(event.keyCode === 37){
       playerMove(-1);
   }
   else if(event.keyCode === 39)
   {
       playerMove(1);
   } 
   else if(event.keyCode === 40)
   {
       playerdrop();
   }
   else if(event.keyCode === 68){ //d
       playerrotate(1);
   }  
   else if(event.keyCode === 81){ //q
       playerrotate(-1);
   }

});