garden = Game.ObjectsById[2].minigame

bank = Game.ObjectsById[5].minigame

magic = Game.ObjectsById[7].minigame

Game.ObjectsById[5].minigame.getBrokerPrice = function() {
    return 1;
};

Game.getLumpRefillMax = function() {
    return 1;
};

Game.ObjectsById[2].minigame.plantsById[0].cost = 0

plot1 = garden.plot[0][0]
plot1 = [1,58]
// plotTile = garden.getTile(0,0)
garden.getTile(1, 0)
/*
Baker'sWheat 1
Thumbcorn 2
Cronerice 3
Meddleweed 14
*/

// for (plant in garden.plants) {
//     console.log(plant)
//     console.log(garden.plant.cost)
// }
//
// for (let i = 0; i < 34; i++) {
//     garden.plantsById[i].cost = 1
//     garden.plantsById[i].costM = 1
// }


// Game.lumpMatureAge=1;
// Game.lumpRipeAge=1;
// Game.lumpOverripeAge=1;
// Game.lumpCurrentType=0;
//
// Game.lumpT = 1701597885000;
const inputHour = 21
const inputMinute = 0
const hour = 3600000;
const minute = 60000;
Game.lumpT = Date.now() - inputHour * hour - inputMinute * minute

Game.lumpT = Game.lumpT - 2*minute
Game.lumpCurrentType = 1
