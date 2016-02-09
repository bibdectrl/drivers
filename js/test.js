function spawnObstacle(){
  var toSpawn = Math.floor(Math.random() * 5);
  switch(toSpawn){
    case 0: return "garbage can";
    case 1: return "SUV";
    case 2: return "minivan";
    case 3: return "sedan";
    case 4: return "smartcar";
  }
}

console.log(spawnObstacle());
