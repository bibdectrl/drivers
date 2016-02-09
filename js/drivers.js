var game = new Phaser.Game(640, 512);

var gameState = {

 preload: function(){
  game.load.spritesheet("cyclist", "assets/bikewithrider.png", 34, 128, 4);
  game.load.spritesheet("ped", "assets/ped.png", 32, 27, 5)
  game.load.spritesheet("ped2", "assets/ped2.png", 32, 27, 5);
  game.load.spritesheet("ped3", "assets/ped3.png", 32, 27, 5);
  game.load.image("dead", "assets/dead.png");
  game.load.image("road", "assets/road.png");
  game.load.image("bus", "assets/testbus.png");
  game.load.image("busdown", "assets/busdown.png");
  game.load.image("deadped", "assets/deadped.png");
 },

 create: function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  this.road = game.add.tileSprite(0, 0, 640, 512, "road");
  this.cyclist = game.add.sprite(300, 300, "cyclist");
  this.cyclist.alive = true;
  this.buses = game.add.group();
  this.busesDown = game.add.group();
  this.buses.enableBody = true;
  this.buses.createMultiple(5, "bus");
  this.busesDown.enableBody = true;
  this.busesDown.createMultiple(5, "busdown");
  this.peds = game.add.group();
  this.peds.enableBody = true;
  this.peds.createMultiple(5, "ped");
  this.peds2 = game.add.group();
  this.peds2.enableBody = true;
  this.peds2.createMultiple(5, "ped2");
  this.peds3 = game.add.group();
  this.peds3.enableBody = true;
  this.peds3.createMultiple(5, "ped3");
  this.speed = 4
  game.physics.arcade.enable(this.cyclist);
  this.cyclist.body.collideWorldBounds = true;
  this.cyclist.animations.add("ride");
  this.cyclist.animations.play("ride", 15, true);
  this.timer = game.time.events.loop(2000, this.addObstacle, this);
 },
 
 update: function(){
  this.road.tilePosition.y += this.speed;  
  var touched = false; 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.UP)){
     this.cyclist.y -= 3; 
     touched = true;
  } 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
     this.cyclist.y += 3;
     touched = true;
  } 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
     this.cyclist.x -= 3;
     touched = true;
  } 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
     this.cyclist.x += 3;
     touched = true;
  } if (! touched) {
     if (this.cyclist.y > 300){
       this.cyclist.y -= Math.min( Math.abs(this.cyclist.y - 300), 3);
     } else if (this.cyclist.y < 300){
       this.cyclist.y += Math.min( Math.abs(this.cyclist.y - 300), 3);
     }
  }
  this.peds.forEachAlive(function(ped){
     ped.y += this.speed;
  }, this);
  this.peds2.forEachAlive(function(ped){
     ped.y += this.speed;
  }, this);
  
  this.peds3.forEachAlive(function(ped){
     ped.y += this.speed;
  }, this);
  
  game.physics.arcade.overlap(this.peds, this.buses, this.killPed, null, this);
  game.physics.arcade.overlap(this.peds2, this.buses, this.killPed, null, this);
  game.physics.arcade.overlap(this.peds3, this.buses, this.killPed, null, this);
 },

 killPed: function(ped, bus){
   ped.animations.play("dead");
   ped.body.velocity.x = 0;
 },

 addObstacle: function(){
   var option = game.rnd.between(0, 3);
   switch(option){
     case 0: this.createPed(); break; 
     case 1: this.createBus(); break;
     case 2: this.createBusDown(); break;
     default: console.log(option + " was chosen");
   }
 },

 instadeath: function(){
   this.cyclist.loadTexture("dead");  
   this.speed = 0;
   this.cyclist.alive = false;
 },


 createPed: function(){
  var pedNum = game.rnd.between(0, 2);
  var ped;
  switch (pedNum) {
      case 0:   
          ped = this.peds.getFirstDead();
          break;
      case 1:
          ped = this.peds2.getFirstDead();
          break;
      case 2:
          ped = this.peds3.getFirstDead();
          break;
  }
  var y = game.rnd.between(0, 400);
  ped.reset(0, y);
  ped.animations.add("walk", [0, 1, 2, 3]);
  ped.animations.add("dead", [4]);
  ped.animations.play("walk", 10, true);
  ped.checkWorldBounds = true;
  ped.outOfBoundsKill = true;
  ped.body.velocity.x = 300;
 },

 createBus: function(){
  var bus = this.buses.getFirstDead();
  bus.reset(400, 512);
  bus.body.velocity.y = -200;
  bus.checkWorldBounds = true;
  bus.outOfBoundsKill = true;
 },

 createBusDown: function(){
  var bus = this.busesDown.getFirstDead();
  bus.reset(100, -255);
  bus.body.velocity.y = 400;
  bus.checkWorldBounds = true;
  bus.outOfBoundsKill = true;

 }

}
