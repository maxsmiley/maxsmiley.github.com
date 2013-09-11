ExpiresDefault "access plus 2 years"
//Globals
///Display
var spritesheet, canvas, ctx;
var death;
var row_height = 35;
var swamp_edge = 107;
var water_height = (row_height*5);
var water_edge = swamp_edge + water_height;
var road_height = (row_height*5);
var road_edge = water_edge + row_height + road_height;
var game_edge = road_edge + row_height;

///Game
var level = 1;
var lives;
var score = 0, acum = 0, highscore = 0;
var frog;
var frogsHome;
var flyTime;
var flyObj;
var objects = new Array(); 
var objectSpawnRate;
var objectSpawnPoints = 
  [{y:road_edge-row_height,     remaining: 50, speed:.9, type: 1, direction: -1, width: 30, 
    px: 81, py: 263, ph: 30},
   {y:road_edge-(2*row_height), remaining: 50, speed:1, type: 2, direction: 1, width: 30, 
    px: 7, py: 300, ph: 30},
   {y:road_edge-(3*row_height), remaining: 50, speed:1, type: 3, direction: -1, width: 32, 
    px: 10, py: 263, ph: 30}, 
   {y:road_edge-(4*row_height), remaining: 50, speed:1, type: 4, direction: 1, width: 32, 
    px: 45, py: 263, ph: 26},
   {y:road_edge-(5*row_height), remaining: 50, speed:1, type: 5, direction: -1, width: 51, 
    px: 104, py: 301, ph: 26},
   {y:water_edge-row_height,    remaining: 50, speed:1, type: 6, direction: -1, width: 91, 
    px: 16, py: 404, ph: 26},
   {y:water_edge-(2*row_height), remaining: 50, speed:1, type: 7, direction: 1, width: 91, 
    px: 5, py: 230, ph: 26},
   {y:water_edge-(3*row_height), remaining: 50, speed:2, type: 8, direction: 1, width: 181, 
    px: 7, py: 165, ph: 30}, 
   {y:water_edge-(4*row_height), remaining: 50, speed:1, type: 6, direction: -1, width: 91, 
    px: 16, py: 404, ph: 26},
   {y:water_edge-(5*row_height), remaining: 50, speed:1.5, type: 9, direction: 1, width: 114, 
    px: 9, py: 190, ph: 32},];

var totalTime;
var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39; //Keycodes for direction


  frog = {
    time: 0,
    x: 90,  y: road_edge, size: 30,
    reset: function(){
      this.time = totalTime;
      this.x = 1+ 6*this.move.speed;
      this.y = road_edge;
      this.move.remaining = 0;
      this.move.direction = UP;
      this.move.base = this;
      this.move.ridingObject= undefined;
      this.move.highest = this.y;
      this.death.remaining = 0;
    },
    
    move: {
      highest: road_edge,
      base: "", //Used for accessing parent object
      v:5, vx:0, vy:0, speed :30,
      remaining: 0,
      direction: UP,   
      ridingObject: undefined, 
      order: function(dir){
        if(this.remaining <= 0){
          this.direction = dir;
          switch(dir){
            case RIGHT:
              if(this.base.x + 2*this.speed < canvas.width){
                this.vx = this.v;
                this.vy = 0;
                this.remaining = this.speed;
              }    
              break;
            case LEFT:
              if(this.base.x - this.speed > 0){
                this.vx = -this.v;
                this.vy = 0;
                this.remaining = this.speed;
              }    
              break;
            case UP:
              if(this.base.y == this.highest ){
                 score += 10; 
                 acum += 10;
                 this.highest -= row_height;
              }
             
              if(this.base.y - row_height > 0){
                this.vx = 0;
                this.vy = -this.v;
                this.remaining = row_height;
              }    
              break;
            case DOWN:
              if(this.base.y + row_height < game_edge){
                this.vx = 0;
                this.vy = this.v;
                this.remaining = row_height;
              }    
              break;
          }
        }
      },
    },
    death: {
      remaining : 0,
    },
    update: function(){
        if(this.y < water_edge){ //Water
          if(this.move.ridingObject == undefined || this.x < 0 
             || this.x+this.size > canvas.width ){
            frogDeath();
          }
        }
        if(this.move.remaining > 0){ //move
          this.move.remaining -= this.move.v;
          this.x += this.move.vx;
          this.y += this.move.vy;
        }
        if(this.move.ridingObject != undefined){ //move w/ log
          this.x += this.move.ridingObject.direction
        }
        this.move.ridingObject = undefined;
    },
    checkCollision: function (obj) {
      var frogsize = 30;
      if( !(this.x >= obj.x+obj.width || 
               this.x+frogsize <= obj.x|| 
               this.y>= obj.y+row_height ||
               this.y+frogsize <= obj.y)){
        if(obj.type < 6){ //If car
           frogDeath();
        }else if(obj.type < 10) { //If log
          
          this.move.ridingObject = obj;
        }else{
          if(!obj.occupied){
            if(obj.fly){
              score += 200;
              acum += 200;
            }
            score += 50;
            acum += 50;
            frogsHome ++;
            obj.occupied = true;
            this.reset();
            if(frogsHome >= 5){
              var lev = level, scr = score + frog.time*10/(100/40) + 1000, 
                  acm = acum + frog.time*10/(100/40) + 1000; 
              init_game_vars();
              level = lev +1;
              score = scr;
              acum = acm;
            }
          }
        }
      }
    },
  };
  
//Initial set-up procedure
document.addEventListener("keydown", function(event) {
  keyPressed(event);
});

//Game Functions
function init_game_vars(){
  level = 1;
  lives = 3;
  highscore = Math.max(highscore, score);
  score = 0;
  acum = 0;
  frogsHome = 0;
  frog.reset();
  for(var i = 0; i < objects.length; i ++){
    delete objects[i];
  }
  flyTime = Math.floor(20 + Math.random()* 100);
  if(flyObj != undefined){
    flyObj.fly = false;
  }
  objects = new Array();
  objectSpawnRate = .2;
  //Winpoints
  for(var i = 0; i < 5; i ++){
   newObject = {x: 11 + 85*i,
                y: swamp_edge-row_height,
                ph: 32,
                type: 10,
                width: 32,
                direction : 0,
                occupied : false,
                fly: false};
   objects.push(newObject);
                    
  }
  for(var i = 0; i < objectSpawnPoints.length; i ++){
  var vx = 0,mult;
  if(objectSpawnPoints[i].type > 5){
    mult = 1.5;
  }else{
    mult = 3.5;
  }
    while (vx < canvas.width){
      newObject = {    x:vx, 
                    y:objectSpawnPoints[i].y, 
                    direction : objectSpawnPoints[i].direction 
                                * objectSpawnPoints[i].speed,
                    type:objectSpawnPoints[i].type, 
                    width: objectSpawnPoints[i].width,
                    ph: objectSpawnPoints[i].ph, 
                    px: objectSpawnPoints[i].px,
                    py: objectSpawnPoints[i].py };
      vx += objectSpawnPoints[i].width*mult;
      objects.push(newObject);
    }
  }
  totalTime = 1000;
  frog.time = totalTime;
}

function updateObstacles(){
  //Spawn
  for(var i = 0; i < objectSpawnPoints.length; i ++){
    objectSpawnPoints[i].remaining--;
    if(objectSpawnPoints[i].remaining <= 0){
      var nx, dir = objectSpawnPoints[i].direction * objectSpawnPoints[i].speed;
      if(dir > 0){
        nx = -objectSpawnPoints[i].width;
      }else{ 
        nx = canvas.width+objectSpawnPoints[i].width; 
      } 
      var newObject = {x:nx, y:objectSpawnPoints[i].y, 
                    direction : dir,
                    type:objectSpawnPoints[i].type, 
                    width: objectSpawnPoints[i].width,
                    ph: objectSpawnPoints[i].ph, 
                    px: objectSpawnPoints[i].px,
                    py: objectSpawnPoints[i].py };
      objects.push(newObject);
      if(objectSpawnPoints[i].type > 5){
        objectSpawnPoints[i].remaining = (objectSpawnPoints[i].width + 
            Math.floor(Math.random()*row_height)/objectSpawnRate)
            /objectSpawnPoints[i].speed;
      }else{
         objectSpawnPoints[i].remaining = (objectSpawnPoints[i].width*1.5 + 
            Math.floor(Math.random()*objectSpawnPoints[i].width)/objectSpawnRate)
            /objectSpawnPoints[i].speed;
      }
    }
  }
  //Move 
  for(var i = 0; i < objects.length; i ++){
    objects[i].x += objects[i].direction;
    //removal
    if((objects[i].direction > 0 && objects[i].x > canvas.width)
    || (objects[i].direction < 0 && objects[i].x + objects[i].width < 0)){
      delete objects[i];
      objects.splice(i,1);
      i--;
    }else{
      frog.checkCollision(objects[i]);
    }
    //if( frog.y > objects[i].y + row_height/2 && frog.y < objects[i].y + row_height/2
  }
}

function init_graphics_vars(){
 spritesheet = new Image();
 spritesheet.src = 'assets/frogger_sprites.png';
 spritesheet.onload = function(){paintGame();};
 death = new Image();
 death.src = 'assets/dead_frog.png';
 canvas = document.getElementById('game');
 ctx = canvas.getContext('2d');
}
function start_game(){
init_graphics_vars();
 init_game_vars();
 
 begin_paint_loop();
 begin_game_loop();
}

function game(){
if(frog.death.remaining == 0){
  frog.time --;
  if(frog.time <= 0){
    frogDeath();
    frog.time = totalTime;
  }else{
    frog.update();
  }
  updateObstacles();
  flyTime --;
  if(flyTime <= 0){
    if(flyObj == undefined){
      for(var i = 0; i < objects.length; i ++){
        if(objects[i].type == 10){
          if(!objects[i].occupied && (Math.random()*10 < 2)){
            flyObj = objects[i];
            flyObj.fly = true;
            flyTime = Math.floor(60 + Math.random()* 100);
            break;
          }
        }
      }
    }else{
      flyObj.fly = false;
      flyObj = undefined;
      flyTime = Math.floor(60 + Math.random()* 150);
    }
  }
  if(acum > 10000 && lives < 4){
    lives ++;
    acum = 0;
  }
  }else{
    frog.death.remaining --;
    if(frog.death.remaining <= 0){
      if(lives <= 0){
        gameOver();
      }else{
        frog.reset();
      }
    }
  }
}

function frogDeath(){ //Remove a life and show death animation, then reset frog state
  lives --;
  frog.death.remaining = 10;
  
}

function gameOver(){
  init_game_vars();
}


function paintGame(){
  paintBackground();
  paintObjects();
}

function begin_paint_loop(){
  delay = 30;
  setInterval(paintGame, delay);
}

function begin_game_loop(){
   delay = 30;
  setInterval(game, delay);
}

function keyPressed(event){
  var key = event.keyCode;
  if(key == UP || key == DOWN || key == LEFT || key == RIGHT){
    frog.move.order(key);
  }else{
    
  }
}

function paintBackground(){
  ctx.fillStyle="#191970";
  ctx.fillRect(0,0,canvas.width,swamp_edge);
  ctx.fillRect(0,swamp_edge,canvas.width,water_height);
  ctx.fillStyle="#000000";
  ctx.fillRect(0,water_edge,canvas.width,356);
  
  //draw title and land
  ctx.drawImage(spritesheet,0,0,spritesheet.width,110,0,0,spritesheet.width,110);
   //draw title and land
  ctx.fillStyle="fuchsia"; //NEED TO GET RIGHT COLOR
  ctx.fillRect(0,water_edge,canvas.width,34);
  ctx.drawImage(spritesheet,0,119,spritesheet.width,row_height,0,water_edge,spritesheet.width,row_height);
  ctx.fillRect(0,road_edge,canvas.width,34);
  ctx.drawImage(spritesheet,0,119,spritesheet.width,35,0,road_edge,spritesheet.width,35);
  paintStatus();
}

function paintObjects(){
 
  for(i = 0; i < objects.length; i ++){
    //ctx.fillStyle="#ff00cc"; 
    //ctx.fillRect(objects[i].x,objects[i].y,objects[i].width,objects[i].ph);
    if(objects[i].type == 10){
      if(objects[i].occupied){
         ctx.drawImage(spritesheet,76,363,30,30,objects[i].x,objects[i].y,35,35);
      }else if(objects[i].fly){
        ctx.drawImage(spritesheet,135,231,30,30,objects[i].x,objects[i].y,35,35);
      }
    }else if(objects[i].type == 6){
        for (var j = 0; j < 3; j++){
          ctx.drawImage(spritesheet,objects[i].px,objects[i].py,objects[i].width/3,objects[i].ph,
          (objects[i].x+(objects[i].width/3*j)),objects[i].y,objects[i].width/3,objects[i].ph);
        }
    }else{
      ctx.drawImage(spritesheet,objects[i].px,objects[i].py,objects[i].width,objects[i].ph,
       objects[i].x,objects[i].y,objects[i].width,objects[i].ph);
    }
  }
  //ctx.fillRect(frog.x,frog.y,row_height,row_height);
  var size = row_height;
  if(frog.death.remaining > 0){
     ctx.drawImage(death,0,0,30,30,frog.x,frog.y,30,30);
  }else{
  switch(frog.move.direction){
    case UP:
      if(frog.move.remaining <= 0){
        ctx.drawImage(spritesheet,10,363,30,30,frog.x,frog.y,size,size);
      }else{
        ctx.drawImage(spritesheet,38,363,30,30,frog.x,frog.y,size,size);
      }
      break;
    case DOWN:
      if(frog.move.remaining <= 0){
        ctx.drawImage(spritesheet,76,363,30,30,frog.x,frog.y,size,size);
      }else{
        ctx.drawImage(spritesheet,109,363,30,30,frog.x,frog.y,size,size);
      }
      break;
    case LEFT:
      if(frog.move.remaining <= 0){
        ctx.drawImage(spritesheet,76,332,30,30,frog.x,frog.y,size,size);
      }else{
        ctx.drawImage(spritesheet,108,335,30,30,frog.x,frog.y,size,size);
      }
      break;
    case RIGHT:
      if(frog.move.remaining <= 0){
        ctx.drawImage(spritesheet,10,332,30,30,frog.x,frog.y,size,size);
      }else{
        ctx.drawImage(spritesheet,34,332,30,30,frog.x,frog.y,size,size);
      }
      break;
  }
  }
 
/*  for(i = 0; i < objects.length; i ++){
     ctx.drawImage(spritesheet,5,230,91,26,objects[i].x,objects[i].y,91,26);
  }*/
}

function paintStatus(){
  for (var i = 0; i < lives; i ++)
    ctx.drawImage(spritesheet,12,332,20,30,i*16,game_edge+1,15,20);
  ctx.fillStyle="#00ff00"; 
  ctx.font="bold 21px sans-serif";
  ctx.fillText("Level " + level,3*16 + 25, game_edge + 19);
  ctx.fillText("Time",345, game_edge+25);
  ctx.fillRect(200+(totalTime-frog.time)/totalTime*140,game_edge+10,(frog.time+1)/totalTime*140, 20);
  ctx.font="bold 12px sans-serif";
  ctx.fillText("Score: " + score,0, game_edge + 35);
  ctx.fillText("Highscore: " + highscore, 94, game_edge + 35);
 
}