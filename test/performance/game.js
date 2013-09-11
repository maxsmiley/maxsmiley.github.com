var spritesheet,canvas,ctx,death,row_height=35,swamp_edge=107,water_height=5*row_height,water_edge=swamp_edge+water_height,road_height=5*row_height,road_edge=water_edge+row_height+road_height,game_edge=road_edge+row_height,level=1,lives,score=0,acum=0,highscore=0,frog,frogsHome,flyTime,flyObj,objects=[],objectSpawnRate,objectSpawnPoints=[{y:road_edge-row_height,remaining:50,speed:0.9,type:1,direction:-1,width:30,px:81,py:263,ph:30},{y:road_edge-2*row_height,remaining:50,speed:1,type:2,direction:1, width:30,px:7,py:300,ph:30},{y:road_edge-3*row_height,remaining:50,speed:1,type:3,direction:-1,width:32,px:10,py:263,ph:30},{y:road_edge-4*row_height,remaining:50,speed:1,type:4,direction:1,width:32,px:45,py:263,ph:26},{y:road_edge-5*row_height,remaining:50,speed:1,type:5,direction:-1,width:51,px:104,py:301,ph:26},{y:water_edge-row_height,remaining:50,speed:1,type:6,direction:-1,width:91,px:16,py:404,ph:26},{y:water_edge-2*row_height,remaining:50,speed:1,type:7,direction:1,width:91,px:5,py:230,ph:26}, {y:water_edge-3*row_height,remaining:50,speed:2,type:8,direction:1,width:181,px:7,py:165,ph:30},{y:water_edge-4*row_height,remaining:50,speed:1,type:6,direction:-1,width:91,px:16,py:404,ph:26},{y:water_edge-5*row_height,remaining:50,speed:1.5,type:9,direction:1,width:114,px:9,py:190,ph:32}],totalTime,UP=38,DOWN=40,LEFT=37,RIGHT=39; frog={time:0,x:90,y:road_edge,size:30,reset:function(){this.time=totalTime;this.x=1+6*this.move.speed;this.y=road_edge;this.move.remaining=0;this.move.direction=UP;this.move.base=this;this.move.ridingObject=void 0;this.move.highest=this.y;this.death.remaining=0},move:{highest:road_edge,base:"",v:5,vx:0,vy:0,speed:30,remaining:0,direction:UP,ridingObject:void 0,order:function(a){if(0>=this.remaining)switch(this.direction=a,a){case RIGHT:this.base.x+2*this.speed<canvas.width&&(this.vx=this.v,this.vy= 0,this.remaining=this.speed);break;case LEFT:0<this.base.x-this.speed&&(this.vx=-this.v,this.vy=0,this.remaining=this.speed);break;case UP:this.base.y==this.highest&&(score+=10,acum+=10,this.highest-=row_height);0<this.base.y-row_height&&(this.vx=0,this.vy=-this.v,this.remaining=row_height);break;case DOWN:this.base.y+row_height<game_edge&&(this.vx=0,this.vy=this.v,this.remaining=row_height)}}},death:{remaining:0},update:function(){this.y<water_edge&&(void 0==this.move.ridingObject||0>this.x||this.x+ this.size>canvas.width)&&frogDeath();0<this.move.remaining&&(this.move.remaining-=this.move.v,this.x+=this.move.vx,this.y+=this.move.vy);void 0!=this.move.ridingObject&&(this.x+=this.move.ridingObject.direction);this.move.ridingObject=void 0},checkCollision:function(a){if(!(this.x>=a.x+a.width||this.x+30<=a.x||this.y>=a.y+row_height||this.y+30<=a.y))if(6>a.type)frogDeath();else if(10>a.type)this.move.ridingObject=a;else if(!a.occupied&&(a.fly&&(score+=200,acum+=200),score+=50,acum+=50,frogsHome++, a.occupied=!0,this.reset(),5<=frogsHome)){a=level;var b=score+10*frog.time/2.5+1E3,c=acum+10*frog.time/2.5+1E3;init_game_vars();level=a+1;score=b;acum=c}}};document.addEventListener("keydown",function(a){keyPressed(a)}); function init_game_vars(){level=1;lives=3;highscore=Math.max(highscore,score);frogsHome=acum=score=0;frog.reset();for(var a=0;a<objects.length;a++)delete objects[a];flyTime=Math.floor(20+100*Math.random());void 0!=flyObj&&(flyObj.fly=!1);objects=[];objectSpawnRate=0.2;for(a=0;5>a;a++)newObject={x:11+85*a,y:swamp_edge-row_height,ph:32,type:10,width:32,direction:0,occupied:!1,fly:!1},objects.push(newObject);for(a=0;a<objectSpawnPoints.length;a++){var b=0,c;for(c=5<objectSpawnPoints[a].type?1.5:3.5;b< canvas.width;)newObject={x:b,y:objectSpawnPoints[a].y,direction:objectSpawnPoints[a].direction*objectSpawnPoints[a].speed,type:objectSpawnPoints[a].type,width:objectSpawnPoints[a].width,ph:objectSpawnPoints[a].ph,px:objectSpawnPoints[a].px,py:objectSpawnPoints[a].py},b+=objectSpawnPoints[a].width*c,objects.push(newObject)}totalTime=1E3;frog.time=totalTime} function updateObstacles(){for(var a=0;a<objectSpawnPoints.length;a++)if(objectSpawnPoints[a].remaining--,0>=objectSpawnPoints[a].remaining){var b=objectSpawnPoints[a].direction*objectSpawnPoints[a].speed;objects.push({x:0<b?-objectSpawnPoints[a].width:canvas.width+objectSpawnPoints[a].width,y:objectSpawnPoints[a].y,direction:b,type:objectSpawnPoints[a].type,width:objectSpawnPoints[a].width,ph:objectSpawnPoints[a].ph,px:objectSpawnPoints[a].px,py:objectSpawnPoints[a].py});objectSpawnPoints[a].remaining= 5<objectSpawnPoints[a].type?(objectSpawnPoints[a].width+Math.floor(Math.random()*row_height)/objectSpawnRate)/objectSpawnPoints[a].speed:(1.5*objectSpawnPoints[a].width+Math.floor(Math.random()*objectSpawnPoints[a].width)/objectSpawnRate)/objectSpawnPoints[a].speed}for(a=0;a<objects.length;a++)objects[a].x+=objects[a].direction,0<objects[a].direction&&objects[a].x>canvas.width||0>objects[a].direction&&0>objects[a].x+objects[a].width?(delete objects[a],objects.splice(a,1),a--):frog.checkCollision(objects[a])} function init_graphics_vars(){spritesheet=new Image;spritesheet.src="assets/frogger_sprites.png";spritesheet.onload=function(){paintGame()};canvas=document.getElementById("game");ctx=canvas.getContext("2d")}function start_game(){init_graphics_vars();init_game_vars();begin_paint_loop();begin_game_loop()} function game(){if(0==frog.death.remaining){frog.time--;0>=frog.time?(frogDeath(),frog.time=totalTime):frog.update();updateObstacles();flyTime--;if(0>=flyTime)if(void 0==flyObj)for(var a=0;a<objects.length;a++){if(10==objects[a].type&&!objects[a].occupied&&2>10*Math.random()){flyObj=objects[a];flyObj.fly=!0;flyTime=Math.floor(60+100*Math.random());break}}else flyObj.fly=!1,flyObj=void 0,flyTime=Math.floor(60+150*Math.random());1E4<acum&&4>lives&&(lives++,acum=0)}else frog.death.remaining--,0>=frog.death.remaining&& (0>=lives?gameOver():frog.reset())}function frogDeath(){lives--;frog.death.remaining=10}function gameOver(){init_game_vars()}function paintGame(){paintBackground();paintObjects()}function begin_paint_loop(){delay=30;setInterval(paintGame,delay)}function begin_game_loop(){delay=30;setInterval(game,delay)}function keyPressed(a){a=a.keyCode;a!=UP&&a!=DOWN&&a!=LEFT&&a!=RIGHT||frog.move.order(a)} function paintBackground(){ctx.fillStyle="#191970";ctx.fillRect(0,0,canvas.width,swamp_edge);ctx.fillRect(0,swamp_edge,canvas.width,water_height);ctx.fillStyle="#000000";ctx.fillRect(0,water_edge,canvas.width,356);ctx.drawImage(spritesheet,0,0,spritesheet.width,110,0,0,spritesheet.width,110);ctx.fillStyle="fuchsia";ctx.fillRect(0,water_edge,canvas.width,34);ctx.drawImage(spritesheet,0,119,spritesheet.width,row_height,0,water_edge,spritesheet.width,row_height);ctx.fillRect(0,road_edge,canvas.width, 34);ctx.drawImage(spritesheet,0,119,spritesheet.width,35,0,road_edge,spritesheet.width,35);paintStatus()} function paintObjects(){for(i=0;i<objects.length;i++)if(10==objects[i].type)objects[i].occupied?ctx.drawImage(spritesheet,76,363,30,30,objects[i].x,objects[i].y,35,35):objects[i].fly&&ctx.drawImage(spritesheet,135,231,30,30,objects[i].x,objects[i].y,35,35);else if(6==objects[i].type)for(var a=0;3>a;a++)ctx.drawImage(spritesheet,objects[i].px,objects[i].py,objects[i].width/3,objects[i].ph,objects[i].x+objects[i].width/3*a,objects[i].y,objects[i].width/3,objects[i].ph);else ctx.drawImage(spritesheet, objects[i].px,objects[i].py,objects[i].width,objects[i].ph,objects[i].x,objects[i].y,objects[i].width,objects[i].ph);a=row_height;if(0<frog.death.remaining)ctx.drawImage(spritesheet,250,224,30,30,frog.x,frog.y,30,30);else switch(frog.move.direction){case UP:0>=frog.move.remaining?ctx.drawImage(spritesheet,10,363,30,30,frog.x,frog.y,a,a):ctx.drawImage(spritesheet,38,363,30,30,frog.x,frog.y,a,a);break;case DOWN:0>=frog.move.remaining?ctx.drawImage(spritesheet,76,363,30,30,frog.x,frog.y,a,a):ctx.drawImage(spritesheet, 109,363,30,30,frog.x,frog.y,a,a);break;case LEFT:0>=frog.move.remaining?ctx.drawImage(spritesheet,76,332,30,30,frog.x,frog.y,a,a):ctx.drawImage(spritesheet,108,335,30,30,frog.x,frog.y,a,a);break;case RIGHT:0>=frog.move.remaining?ctx.drawImage(spritesheet,10,332,30,30,frog.x,frog.y,a,a):ctx.drawImage(spritesheet,34,332,30,30,frog.x,frog.y,a,a)}} function paintStatus(){for(var a=0;a<lives;a++)ctx.drawImage(spritesheet,12,332,20,30,16*a,game_edge+1,15,20);ctx.fillStyle="#00ff00";ctx.font="bold 21px sans-serif";ctx.fillText("Level "+level,73,game_edge+19);ctx.fillText("Time",345,game_edge+25);ctx.fillRect(200+140*((totalTime-frog.time)/totalTime),game_edge+10,140*((frog.time+1)/totalTime),20);ctx.font="bold 12px sans-serif";ctx.fillText("Score: "+score,0,game_edge+35);ctx.fillText("Highscore: "+highscore,94,game_edge+35)};