garden = Game.ObjectsById[2].minigame

// plotTile = garden.getTile(0,0)
garden.getTile(1, 0)
/*
Baker'sWheat 1
Thumbcorn 2
Cronerice 3
Meddleweed 14
*/

for (plant in garden.plants) {
    console.log(plant)
    console.log(garden.plant.cost)
}

for (let i = 0; i < 34; i++) {
    garden.plantsById[i].cost = 1
    garden.plantsById[i].costM = 1
}
