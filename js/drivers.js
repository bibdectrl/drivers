var game = new Phaser.Game(640, 512);


var preloadState = {

  preload: function(){
   game.load.image("title", "assets/title.png");
   game.load.spritesheet("cyclist", "assets/bikewithrider.png", 34, 128, 4);
   game.load.spritesheet("ped", "assets/allpedsbackandforth.png", 32, 27, 30)
   game.load.image("dead", "assets/dead.png");
   game.load.image("road", "assets/road.png");
   game.load.image("bus", "assets/testbus.png");
   game.load.image("busdown", "assets/busdown.png");
   game.load.image("sportscar", "assets/sportscar.png");
   game.load.image("sportscardown", "assets/sportscardown.png");
  },

  create: function(){
   game.state.start("title");

  }

};

var titleState = {

  create: function(){
   game.add.sprite(0, 0, "road");
   game.add.sprite(150, 100, "title");
   game.add.text(170, 350, "PRESS SPACE TO START");
  },

  update: function(){
   if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
     game.state.start("game");
   }
  }


}


var gameState = {

 create: function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  this.road = game.add.tileSprite(0, 0, 640, 512, "road");
  this.cyclist = game.add.sprite(300, 300, "cyclist");
  this.cyclist.alive = true;
  this.peds = game.add.group();
  this.peds.enableBody = true;
  this.peds.createMultiple(15, "ped");
  this.speed = 4
  this.buses = game.add.group();
  this.busesDown = game.add.group();
  this.buses.enableBody = true;
  this.buses.createMultiple(5, "bus");
  this.busesDown.enableBody = true;
  this.busesDown.createMultiple(5, "busdown");
  this.sportsCars = game.add.group();
  this.sportsCars.enableBody = true;
  this.sportsCars.createMultiple(5, "sportscar");
  this.sportsCarsDown = game.add.group();
  this.sportsCarsDown.enableBody = true;
  this.sportsCarsDown.createMultiple(5, "sportscardown");
  game.physics.arcade.enable(this.cyclist);
  this.cyclist.body.collideWorldBounds = true;
  this.cyclist.animations.add("ride");
  this.cyclist.animations.play("ride", 15, true);
  this.timer = game.time.events.loop(1500, this.addObstacle, this);
 
 },

 update: function(){
  game.physics.arcade.overlap(this.peds, this.busesDown, this.killPed, null, this); 
  game.physics.arcade.overlap(this.peds, this.buses, this.killPed, null, this);
  game.physics.arcade.overlap(this.cyclist, this.peds,  this.instaDeath, null, this);
  game.physics.arcade.overlap(this.cyclist, this.buses, this.instaDeath, null, this);
  game.physics.arcade.overlap(this.cyclist, this.busesDown, this.instaDeath, null, this);
  game.physics.arcade.overlap(this.cyclist, this.sportsCars, this.instaDeath, null, this);
  game.physics.arcade.overlap(this.peds, this.sportsCars, this.killPed, null, this);

  this.road.tilePosition.y += this.speed;  
  var touched = false; 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.UP)){
     this.cyclist.body.velocity.y = -400;
     touched = true;
  } 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
     this.cyclist.body.velocity.y = 400;
     touched = true;
  } 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
     this.cyclist.body.velocity.x = -300;
     touched = true;
  } 
  if (this.cyclist.alive && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
     this.cyclist.body.velocity.x = 300;
     touched = true;
  } if (! touched && this.cyclist.alive) {
    this.cyclist.body.velocity.y = 200;
    this.cyclist.body.velocity.x = 0;
  }
   this.peds.forEachAlive(function(ped){
     ped.y += this.speed;
   }, this); 
 
 },

 killPed: function(ped, vehicle){
   if (! ped.crushed ) {
     if (ped.y > vehicle.y){
       ped.body.velocity.x *= -1;
       if (ped.body.velocity.x >= 0){
         ped.animations.play("walking-right", 5, true);
       } else {
         ped.animations.play("walking-left", 5, true);
       }
     }
     else {
       if (ped.body.velocity.x >= 0)
         ped.animations.play("dead-right", 1, true);
       else {
         ped.animations.play("dead-left", 1, true);
       }
       ped.body.velocity.x = 0;
     }
   }
 },

 addObstacle: function(){
   var option = game.rnd.between(0, 4);
   switch(option){
     case 0: this.createPed(); break; 
     case 1: this.createBus(); break;
     case 2: this.createBusDown(); break;
     case 3: this.createSportsCar(); break;
     case 4: this.createSportsCarDown(); break;
   }
 },

 instaDeath: function(cyc, ped){
   this.cyclist.loadTexture("dead");  
   this.speed = 0;
   this.cyclist.body.velocity.y = 0;
   this.cyclist.body.velocity.x = 0;
   this.cyclist.alive = false;
   game.time.events.loop(4000, function(){ game.state.start("title"); }, this);
 },

 
 createSportsCar: function(){
   var car = this.sportsCars.getFirstDead();
   car.reset(400, 512);
   car.checkWorldBounds = true;
   car.outOfBoundsKill = true;
   car.body.velocity.y = -200;
 },
 
 createSportsCarDown: function(){
   var car = this.sportsCarsDown.getFirstDead();
   car.reset(100, -198);
   car.checkWorldBounds = true;
   car.outOfBoundsKill = true;
   car.body.velocity.y = 400;

 },

 createPed: function(){
  var pedNum = game.rnd.between(0, 2);
  var ped = this.peds.getFirstDead();
  ped.crushed = false;
  switch (pedNum) {
      case 0:   
          ped.animations.add("walking-right", [0, 1, 2, 3]);
          ped.animations.add("walking-left", [29, 28, 27, 26]);
          ped.animations.add("dead-right", [4]);
          ped.animations.add("dead-left", [25]);
          break;
      case 1:
          ped.animations.add("walking-right", [5, 6, 7, 8]);
          ped.animations.add("walking-left", [24, 23, 22, 21]);
          ped.animations.add("dead-right", [9]);
          ped.animations.add("dead-left", [20]);
          break;
      case 2:
          ped.animations.add("walking-right", [10, 11, 12, 13]);
          ped.animations.add("walking-left", [19, 18, 17, 16])
          ped.animations.add("dead-right", [14]);
          ped.animations.add("dead-left", [15]);
          break;
  }
  var leftOrRight = Math.random();
  if (leftOrRight <= 0.5) {
    var y = game.rnd.between(0, 400);
    ped.reset(0, y);
    ped.checkWorldBounds = true;
    ped.outOfBoundsKill = true;
    ped.body.velocity.x = 400;
    ped.animations.play("walking-right", 5, true); 
  } else {
    var y = game.rnd.between(0, 400);
    ped.reset(639, y);
    ped.checkWorldBounds = true;
    ped.outOfBoundsKill = true;
    ped.body.velocity.x = -400;
    ped.animations.play*("walking-left", 5, true);
  }
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
