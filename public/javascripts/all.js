function Camera(e,t,a){this.x=0,this.y=0,this.width=t,this.height=a}function Client(e,t,a,i,s,n,c,o,l,r){this.name=e,this.plane=t,this.id=a,this.x=i,this.y=s,this.angle=c,this.speed=n,this.health=o,this.points=l,this.ammo=r}function Maverick(e,t,a,i,s){this.ctx=e,this.camera=t,this.client=a,this.players=i,this.bullets=s}console.log("Maverick 2D!"),$("#reload").hide();var socket=io();console.log(socket);var canvas=$("#canvas")[0],ctx=canvas.getContext("2d"),angle=0,players=[],bullets=[],leaderboard=[],plane,leftPress,rightPress,spacePress,upPress,downPress;$(document).on("keydown",function(e){mav&&(68!==e.keyCode&&39!==e.keyCode||(rightPress=!0),65!==e.keyCode&&37!==e.keyCode||(leftPress=!0),38!==e.keyCode&&87!==e.keyCode||(upPress=!0),32===e.keyCode&&(spacePress=!0))}),$(document).on("keyup",function(e){mav&&(68!==e.keyCode&&39!==e.keyCode||(rightPress=!1),65!==e.keyCode&&37!==e.keyCode||(leftPress=!1),38!==e.keyCode&&87!==e.keyCode||(upPress=!1),32===e.keyCode&&(spacePress=!1))}),$("#reload").on("click",function(){socket.emit("respawn",mav.client),$("#menu").hide()});var spitfire=new Image;spitfire.src="/images/spitfire.png";var zero=new Image;zero.src="/images/zero.png";var mustang=new Image;mustang.src="/images/mustang.png";var lightning=new Image;lightning.src="/images/lightning.png";var messerschmitt=new Image;messerschmitt.src="/images/messerschmitt.png";var planes=[spitfire,zero,mustang,lightning,messerschmitt],bulletImg=new Image;bulletImg.src="/images/bullet.png";var tileMap=new Image;tileMap.src="/images/map-2.png";var map={cols:10,rows:10,tileSize:500};Camera.prototype.move=function(e,t){this.x=e,this.y=t},Maverick.prototype.updateCam=function(e){this.camLeftBound=this.client.x-canvas.width/2,this.camRightBound=this.client.x+canvas.width/2,this.camTopBound=this.client.y-canvas.height/2,this.camBottomBound=this.client.y+canvas.height/2,this.camera.move(this.client.x,this.client.y)},Maverick.prototype.keyPressHandler=function(){var e=this;leftPress&&socket.emit("leftPressed",e.client),rightPress&&socket.emit("rightPressed",e.client),upPress&&socket.emit("upPressed",e.client),upPress||socket.emit("downPressed",e.client)},Maverick.prototype.spaceHandler=function(){var e=this;spacePress&&socket.emit("spacePressed",e.client),spacePress||socket.emit("spaceUp",e.client)},Maverick.prototype.run=function(){this.tick();var e=this;setInterval(function(){e.keyPressHandler.call(e)},30),setInterval(function(){e.spaceHandler.call(e)},150)},Maverick.prototype.tick=function(e){window.requestAnimationFrame(this.tick.bind(this)),this.ctx.clearRect(0,0,1280,960),this.render()},Maverick.prototype.render=function(){this.ctx.canvas.width=window.innerWidth,this.ctx.canvas.height=window.innerHeight,this.updateCam(),this.drawMap(),this.drawBullets(),this.drawEnemies(),this.drawPlane(),this.drawLeaderboard(),this.drawLeaders(),this.drawAmmo()},Maverick.prototype.drawMap=function(){this.ctx.save(),this.ctx.drawImage(tileMap,0,0,5e3,5e3,-mav.camLeftBound,-mav.camTopBound,5e3,5e3),this.ctx.restore()},Maverick.prototype.drawPlane=function(){this.ctx.save(),this.ctx.translate(canvas.width/2,canvas.height/2),this.ctx.textAlign="center",this.ctx.textBaseline="bottom",this.ctx.font="18px 'Lucida Grande'",this.ctx.fillStyle="blue",this.ctx.fillText(this.client.name,0,-85),this.ctx.fillStyle="grey",this.ctx.fillText("Health: "+this.client.health,0,-65),this.ctx.rotate(Math.PI/180*this.client.angle),this.ctx.drawImage(planes[this.client.plane],-60,-60,120,120),this.ctx.restore()},Maverick.prototype.drawEnemies=function(){var e=this;players.length>=1&&players.forEach(function(t){t.id!==e.client.id&&t.x<e.camRightBound&&t.x>e.camLeftBound&&t.y<e.camBottomBound&&t.y>e.camTopBound&&(e.ctx.save(),e.ctx.translate(t.x-e.camLeftBound,t.y-e.camTopBound),e.ctx.textAlign="center",e.ctx.textBaseline="bottom",e.ctx.font="18px 'Lucida Grande'",e.ctx.fillStyle="red",e.ctx.fillText(t.name,0,-85),e.ctx.fillStyle="grey",e.ctx.fillText("Health: "+t.health,0,-65),e.ctx.rotate(Math.PI/180*t.angle),e.ctx.drawImage(planes[t.plane],-60,-60,120,120),e.ctx.restore())})},Maverick.prototype.drawBullets=function(){var e=this;bullets.length>=1&&bullets.forEach(function(t){t.x<e.camRightBound&&t.x>e.camLeftBound&&t.y<e.camBottomBound&&t.y>e.camTopBound&&(e.ctx.save(),e.ctx.translate(t.x-e.camLeftBound,t.y-e.camTopBound),e.ctx.rotate(Math.PI/180*t.angle),e.ctx.drawImage(bulletImg,-12,-12,24,24),e.ctx.restore())})},Maverick.prototype.drawAmmo=function(){for(var e=this,t=canvas.height-64,a=16,i=mav.client.ammo;i>0;i--)e.ctx.drawImage(bulletImg,a,t,48,48),a+=16},Maverick.prototype.drawLeaderboard=function(){this.ctx.globalAlpha=.3,this.fillStyle="black",this.ctx.fillRect(20,20,200,200),this.ctx.globalAlpha=1},Maverick.prototype.drawLeaders=function(){var e=this,t=50;e.ctx.fillStyle="white",e.ctx.font="18px 'Lucida Grande'",e.ctx.fillText("Leaderboard:",35,50),e.ctx.fillStyle="black",leaderboard.forEach(function(a){t+=25,e.ctx.globalAlpha=1,e.ctx.fillStyle="white",e.ctx.font="18px 'Lucida Grande'",e.ctx.fillText(a.name+": "+a.points+" pts",35,t),e.ctx.fillStyle="black"})},$("#start").on("click",function(){plane=$("#select").val();var e=new Client($("#name").val(),plane,socket.id);socket.emit("spawn",e)}),socket.on("joinGame",function(e){canvas.getContext("2d");console.log("Updated Settings:",e);var t=new Client(e.name,e.plane,e.id,e.x,e.y,e.speed,e.angle,e.health,e.points,e.ammo),a=new Camera(map,canvas.width,canvas.height);mav=new Maverick(canvas.getContext("2d"),a,t),$("#menu").hide(),mav.run()}),socket.on("rejoinGame",function(e){mav.client=e}),socket.on("movePlane",function(e){mav.client.x=e.x,mav.client.y=e.y,mav.client.speed=e.speed,mav.client.health=e.health,mav.client.angle=e.angle,mav.client.points=e.points,mav.client.ammo=e.ammo}),socket.on("moveBullets",function(e){bullets=e}),socket.on("updateAllPlayers",function(e){players=e}),socket.on("updateAllLeaderboards",function(e){leaderboard=e}),socket.on("shotFired",function(e){console.log(e.name,"is shooting!")}),socket.on("playerDie",function(e){console.log(e.name,"was shot down!"),e.id===mav.client.id&&($("#inputs").hide(),$("#start").hide(),$("#controls").hide(),$("#select").hide(),$("#reload").show(),$("#menu").show())});