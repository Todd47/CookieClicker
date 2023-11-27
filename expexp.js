garden = Game.ObjectsById[2].minigame

// plotTile = garden.getTile(0,0)
garden.getTile(1, 0)
/*
Baker'sWheat 1
Thumbcorn 2
Cronerice 3
Meddleweed 14
*/
// getTile只能查看状态，并不能更新

// const unwantedCrop = [1, 2, 3, 14]
// for (let x = 0; x < 6; x++) {
//     for (let y = 0; y < 6; y++) {
//
//         // 确保种下去的是wheat
//         if (garden.seedSelected !== 0) {
//             garden.seedSelected = 0
//         }
//
//         //     基础planted列
//         if ((x === 1 & y !== 3) || (x === 4 & y !== 3)) {
//             const plotTile = garden.getTile(x, y)
//             const plotCrop = plotTile[0]
//             if (plotCrop !== 1 && plotCrop !== 0) {
//
//                 if (unwantedCrop.includes(plotCrop)) {
//                     // 挖掉
//                     console.log(plotTile, x, y, '不对劲，挖掉')
//                     garden.clickTile(x, y)
//                     // 种下
//                     garden.clickTile(x, y)
//                 } else {
//                     const plotCropPercentage = plotTile[1]
//                     if (plotCropPercentage >= 75) {
//                         console.log(plotTile, x, y, '不对劲，要的，熟了，挖')
//                         garden.clickTile(x, y)
//                     } else if (plotCrop !== 0) {
//                         console.log(plotTile, x, y, '不对劲，要的，没熟，不挖')
//                     }
//                 }
//             } else if (plotCrop === 0) { // 自然死亡或者是别的情况挖掉的话
//                 // 种下
//                 console.log(plotTile, x, y, '毛得了，种回去')
//                 garden.clickTile(x, y)
//             }
//
//         } else {
//             const plotTile = garden.getTile(x, y)
//             const plotCrop = plotTile[0]
//             if (unwantedCrop.includes(plotCrop)) {
//                 console.log(plotTile, x, y, '不要的，挖掉')
//                 garden.clickTile(x, y)
//             } else {
//                 const plotCropPercentage = plotTile[1]
//                 if (plotCropPercentage >= 75) {
//                     console.log(plotTile, x, y, '要的，熟了，挖')
//                     garden.clickTile(x, y)
//                 } else if (plotCrop !== 0) {
//                     console.log(plotTile, x, y, '要的，没熟，不挖')
//                 }
//             }
//         }
//     }
// }
