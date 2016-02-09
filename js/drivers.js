var game = new Phaser.Game(640, 512);

var gameState = {

 preload: function(){
  game.load.spritesheet("cyclist", "assets/bikewithrider.png", 34, 128, 4);
  game.load.spritesheet("ped", "assets/ped.png", 32, 27, 4)
  game.load.spritesheet("ped2", "assets/ped2.png", 32, 27, 4);
  game.load.spritesheet("ped3", "assets/ped3.png", 32, 27, 4);
  game.load.image("dead", "assets/dead.png");
  game.load.image("road", "assets/road.png");
  game.load.image("bus", "assets/testbus.png");
  game.load.image("busdown", "assets/busdown.png");
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
  this.peds.createMultiple(3, "ped");
  this.peds.createMultiple(3, "ped2");
  this.peds.createMultiple(3, "ped3");

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
       this.cyclist.y -= Math.min( Math.abs(this.cyclist.y - 300) , 3);
     } else if (this.cyclist.y < 300){
       this.cyclist.y += Math.min( Math.abs(this.cyclist.y - 300), 3);
     }
  }
  this.peds.forEachAlive(function(ped){
     ped.y += this.speed;
  }, this);
  

 },

 addObstacle: function(){
   var option = game.rnd.between(0, 3);
   switch(option){
     case 0: this.createPed(); break; 
     case 1: this.createBus(); break;
     case 2: this.createBusDown(); break;
     case 3: this.instadeath(); break;
     default: console.log(option + " was chosen");
   }
 },

 instadeath: function(){
   this.cyclist.loadTexture("dead");  
   this.speed = 0;
   this.cyclist.alive = false;
 },


 createPed: function(){
  var ped = this.peds.getFirstDead();
  ped.reset(0, 200);
  ped.animations.add("walk");
  ped.animations.play("walk", 10, true);
  ped.checkWorldBounds = true;
  ped.outOfBoundsKill = true;
  ped.body.velocity.x = 300;
 },

 createBus: function(){
  var bus = this.buses.getFirstDead();
  bus.reset(100, 512);
  bus.body.velocity.y = this.game.rnd.between(-200, -220);
  bus.checkWorldBounds = true;
  bus.outOfBoundsKill = true;
 },

 createBusDown: function(){
  var busDown = this.busesDown.getFirstDead();
  busDown.reset(400, -255);
  busDown.body.velocity.y = 400;
  busDown.checkWorldBounds = true;
  busDown.outOfBoundsKill = true;

 }

}
