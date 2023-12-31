if (!FortuneHelper) var FortuneHelper = {
    name: 'FortuneHelper',

    config: {
        fortune: 0,
        fortuneall: 0,
        golden: 0,
        alsowrath: 1,
        reindeer: 0,
        wrinkler: 0,
        research: 0,
        toddsresearch: 0,
        toddsbuild: 0,
        toddsgcs: 0,
        toddsspell: 0,
        toddsplant: 0,
        autoPlantId: 1,
        toddsAutoReincarnate: 0,
        toddsfertilizer: 0,
        pledge: 0,
        click: 10,
        clickalways: 0,
        fortunesound: 1,
        goldensound: 1,
        muteclick: 0,
        chocolateegg: 1,
        plantId: 1,
        matureP: 70
    },

    isLoaded: false,
    playedfortune: false,
    playedgolden: false,
    clickInterval: null,
    toddsLoopCounter: 0,

    init: function () {
        Game.customOptionsMenu.push(this.addOptionsMenu);
        setInterval(this.logicLoop, 200);

        setInterval(this.toddsLoop, 5000);
        this.updateAutoclicker();
        CCSE.SpliceCodeIntoFunction('Game.playCookieClickSound', 2, 'if (FortuneHelper.config.muteclick) return;');
        CCSE.SpliceCodeIntoFunction('Game.Ascend', 5, 'FortuneHelper.preAscend();');
        this.isLoaded = true;
    },

    load: function (str) {
        const config = JSON.parse(str);
        for (const c in config) this.config[c] = config[c];
        this.updateAutoclicker();
    },

    save: function () {
        return JSON.stringify(this.config);
    },

    register: function () {
        Game.registerMod(this.name, this);
    },

    logicLoop: function () {
        // Fortune tickers
        if (Game.TickerEffect && Game.TickerEffect.type === 'fortune') {
            if (this.config.fortune && (this.config.fortuneall || Game.TickerEffect.sub !== 'fortuneGC' && Game.TickerEffect.sub !== 'fortuneCPS')) {
                Game.tickerL.click();
            } else if (this.config.fortunesound && !this.playedfortune) {
                PlaySound('snd/fortune.mp3');
                this.playedfortune = true;
            }
        } else {
            this.playedfortune = false;
        }

        // Golden cookies and reindeers
        let anygolden = false;
        for (const shimmer of Game.shimmers) {
            if (shimmer.type === 'golden') {
                anygolden = true;
                if (this.config.golden && (!shimmer.wrath || shimmer.force === 'cookie storm drop' || this.config.alsowrath)) {
                    shimmer.pop();
                } else if (this.config.goldensound && !Game.chimeType && !this.playedgolden && shimmer.force !== 'cookie storm drop') {
                    PlaySound('snd/chime.mp3');
                    this.playedgolden = true;
                }
            } else if (shimmer.type === 'reindeer' && this.config.reindeer) {
                shimmer.pop();
            }
        }
        if (!anygolden) this.playedgolden = false;

        // Wrinklers
        if (this.config.wrinkler) {
            for (const wrinkler of Game.wrinklers) {
                if (wrinkler.hp > 0.5 && wrinkler.sucked > 0.5 && wrinkler.type !== 1) { // preserve shiny wrinklers
                    wrinkler.hp = -10;
                }
            }
        }

        // Research
        if (this.config.research || this.config.pledge) {
            for (const upgrade of Game.UpgradesInStore) {
                if (this.config.research && upgrade.pool === 'tech'
                    || this.config.pledge && upgrade.name === 'Elder Pledge'
                    || upgrade.name === 'Sacrificial rolling pins') {
                    upgrade.buy(1);
                }
            }
        }

        // Chocolate egg
        if (this.config.chocolateegg && Game.Has('Inspired checklist') && !Game.Upgrades['Chocolate egg'].isVaulted()) {
            Game.Upgrades['Chocolate egg'].vault();
            Game.upgradesToRebuild = 1;
        }
    },

    toddsLoop: function () {
        // always add counter
        this.toddsLoopCounter++;

        if (this.config.toddsAutoReincarnate) {
            FortuneHelper.mightyClick(2400);
            if (this.toddsLoopCounter % 20 === 0) {
                Game.Ascend(1);
                setTimeout(function() {
                    Game.Reincarnate(1); // Similarly, replace with the actual game command.
                }, 9000);
            }
        }

        if (this.config.toddsgcs) {
            FortuneHelper.spawnGoldenCookie(5)
        }

        if (this.config.toddsbuild) {
            const buildingNameList = ['You', 'Cortex baker', 'Idleverse', 'Javascript console', 'Fractal engine', 'Chancemaker', 'Prism', 'Antimatter condenser', 'Time machine', 'Portal', 'Alchemy lab', 'Shipment', 'Wizard tower', 'Temple', 'Bank', 'Factory', 'Mine', 'Farm', 'Grandma', 'Cursor'];

            function execBuy(build, count) {
                if (Game.cookies > build.getSumPrice(count)) {
                    build.buy(count)
                }
            }

            function affordableCheck(build, count) {
                return (Game.cookies > build.getSumPrice(count))
            }

            for (const buildingName of buildingNameList) {
                const build = Game.Objects[buildingName]

                const curAmount = build.amount

                const buildStepList = [700, 650, 600, 550, 500,
                    450, 400, 350, 300, 250, 200, 150, 100, 50, 25, 10, 5, 1]

                if (curAmount < 701) {
                    for (const stepLevel of buildStepList) {
                        const diff = stepLevel - curAmount
                        if (affordableCheck(build, diff)) {
                            execBuy(build, diff)
                            break
                        }
                    }
                }
                if ((Game.cookies * 0.75) > build.getSumPrice(10)) {
                    execBuy(build, 10)
                }
            }
        }

        if (this.config.toddsresearch) {
            for (const upgrade of Game.UpgradesInStore) {
                if (this.config.toddsresearch && upgrade.pool !== 'tech' && upgrade.pool !== 'toggle') {
                    upgrade.buy(1);
                }
            }
            const sl = Game.santaLevel

            if (sl < 14) {
                for (let i = 0; i < 14 - sl; i++) {
                    Game.UpgradeSanta();
                    Game.ToggleSpecialMenu(0);
                }
            }
            const dl = Game.dragonLevel
            if (dl < 27) {
                for (let i = 0; i < 27 - dl; i++) {
                    Game.UpgradeDragon();
                    Game.ToggleSpecialMenu(0);
                }
            }
            Game.ToggleSpecialMenu(0);
        }

        // if (this.config.toddsspell && this.toddsLoopCounter % 10 === 0) {

        const grimoire = Game.Objects["Wizard tower"].minigame;
        const spell = "hand of fate";
        if (this.config.toddsspell) {
            grimoire.magic = 500;
            grimoire.castSpell(grimoire.spells[spell]);
        } else if (this.toddsLoopCounter % 10 === 0) {
            const spellCost = 10 + parseInt(grimoire.magicM) * 0.6;
            if (grimoire.magic >= spellCost) {
                grimoire.castSpell(grimoire.spells[spell]);
            }
        }
        const garden = Game.ObjectsById[2].minigame

        // old code
        /*if (this.config.toddsplant) {
            const unwantedCrop = [1, 2, 3, 14]
            for (let x = 0; x < 6; x++) {
                for (let y = 0; y < 6; y++) {

                    // 确保种下去的是wheat
                    if (garden.seedSelected !== 0) {
                        garden.seedSelected = 0
                    }

                    //     基础planted列
                    if ((x === 1 & y !== 3) || (x === 4 & y !== 3)) {
                        const plotTile = garden.getTile(x, y)
                        const plotCrop = plotTile[0]
                        if (plotCrop !== 1 && plotCrop !== 0) {

                            if (unwantedCrop.includes(plotCrop)) {
                                // 挖掉
                                garden.clickTile(x, y)
                                // 种下
                                garden.clickTile(x, y)
                            } else {
                                const plotCropPercentage = plotTile[1]
                                if (plotCropPercentage >= 75) {
                                    garden.clickTile(x, y)
                                } else if (plotCrop !== 0) {
                                }
                            }
                        } else if (plotCrop === 0) { // 自然死亡或者是别的情况挖掉的话
                            // 种下
                            garden.clickTile(x, y)
                        }

                    } else {
                        const plotTile = garden.getTile(x, y)
                        const plotCrop = plotTile[0]
                        const plotPercentage = plotTile[1]
                        if (unwantedCrop.includes(plotCrop)) {
                            garden.clickTile(x, y)
                        } else {
                            if (plotPercentage >= 75) {
                                garden.clickTile(x, y)
                            } else if (plotCrop !== 0) {
                            }
                        }
                    }
                }
            }
        }*/

        if (this.config.toddsplant) {
            console.log('auto plant id:' + this.config.autoPlantId)
            for (let x = 0; x < 6; x++) {
                for (let y = 0; y < 6; y++) {

                    garden.seedSelected = parseInt(this.config.autoPlantId)

                    const plotTile = garden.getTile(x, y)
                    const cropId = parseInt(garden.seedSelected) + 1

                    console.log('plotTile:', plotTile[0])
                    console.log('cropId:', cropId)

                    if (parseInt(plotTile[0]) !== cropId) {
                        garden.clickTile(x, y)
                    }
                }
            }
        }

        if (this.config.toddsfertilizer) {
            garden.soils.fertilizer.tick = 0.05
            garden.soils.woodchips.tick = 0.05
        } else {
            garden.soils.fertilizer.tick = 3
            garden.soils.woodchips.tick = 5
        }

        // Game.Objects['Grandma']
        // reset counter
        if (this.toddsLoopCounter === 19999) {
            this.toddsLoopCounter = 0;
            // Game.Notify("Here is Todd!",'',[29,27]);
        }
    },

    updateAutoclicker: function () {
        const value = this.config.click;
        if (this.clickInterval != null) {
            clearInterval(this.clickInterval);
        }
        if (value > 0) {
            this.clickInterval = setInterval(function () {
                if (FortuneHelper.config.clickalways) {
                    Game.ClickCookie(0);
                } else {
                    let totalMultCPS = 1;
                    for (const i in Game.buffs) { // Can't use "of" because it's not an array
                        const buff = Game.buffs[i];
                        if (buff.multCpS > 1) totalMultCPS *= buff.multCpS;
                        if (totalMultCPS > 50 || buff.multClick > 1 || buff.name == 'Cursed finger') {
                            Game.ClickCookie(0);
                            break;
                        }
                    }
                }
            }, 1000 / value);
        } else {
            this.clickInterval = null;
        }
    },

    preAscend: function () {
        const egg = Game.Upgrades['Chocolate egg'];
        if (this.config.chocolateegg && egg.unlocked && !egg.bought) {
            // Switch aura
            if (Game.dragonLevel >= 8 && !Game.hasAura('Earth Shatterer')) {
                const earthShatterer = 5, realityBending = 18;
                Game.SelectingDragonAura = earthShatterer;
                if (Game.dragonAura === realityBending) Game.dragonAura2 = earthShatterer;
                else Game.dragonAura = earthShatterer;
                let highestBuilding = null;
                for (var i in Game.Objects) {
                    if (Game.Objects[i].amount) highestBuilding = Game.Objects[i];
                }
                if (highestBuilding) {
                    Game.ObjectsById[highestBuilding.id].sacrifice(1);
                }
            }
            // Sell buildings
            for (var i in Game.Objects) {
                const building = Game.Objects[i];
                if (building.amount) building.sell(building.amount);
            }
            // Profit
            egg.buy(1);
        }
    },

    updateGameLumpTime: function () {
        const inputHour = document.getElementById('inputHour').value;
        const inputMinute = document.getElementById('inputMinute').value;
        const inputType = document.getElementById('inputType').value;

        const hour = 3600000;
        const minute = 60000;

        Game.lumpT = Date.now() - inputHour * hour - inputMinute * minute;
        Game.lumpCurrentType = inputType;

        // Display the result or do something else as needed
        Game.Notify('Game.lumpT updated to: ' + Game.lumpT, 'gg', [1, 33], false);
    },

    updateAutoPlantId: function () {
        this.config.autoPlantId = document.getElementById('autoPlantId').value;
    },

    updatePlot1: function () {
        const garden1 = Game.ObjectsById[2].minigame

        this.config.plantId = document.getElementById('plantId').value;
        this.config.matureP = document.getElementById('matureP').value;

        var plantId = document.getElementById('plantId').value;
        const matureP = document.getElementById('matureP').value;
        plantId = parseInt(plantId) + 1;
        garden1.plot[0][0] = [plantId, matureP];
        Game.Notify('plot0,0 plant updated to: [' + plantId + ', ' + matureP + ']', 'gg', [1, 33], false);
    },

    /* Menu */

    addOptionsMenu: function () {
        const body = `
        ${this.header('Sounds')}
        <div class="listing">
            ${this.button('goldensound', 'Golden Cookie Alert ON (override)', 'Golden Cookie Alert OFF (default)')}
        </div><div class="listing">
            ${this.button('fortunesound', 'Fortune Ticker Alert ON', 'Fortune Ticker Alert OFF')}
        </div><div class="listing">
            ${this.button('muteclick', 'Mute Big Cookie ON', 'Mute Big Cookie OFF')}
        </div>
        <br>
        ${this.header('Auto-Clicker')}
        <div class="listing">
            ${this.slider('click', 'Clicks Per Second', 0, 30)}
        </div><div class="listing">
            ${this.button('clickalways', 'Mode: Always active', 'Mode: Only active during big buffs')}
        </div>
        <br>
        ${this.header('Other Clickers')}
        <div class="listing">
            ${this.button('golden', 'Click Golden Cookies ON', 'Click Golden Cookies OFF')}
            ${this.button('alsowrath', 'Mode: Include Wrath Cookies', 'Mode: Exclude Wrath Cookies', 9)}
        </div><div class="listing">
            ${this.button('fortune', 'Click Fortune Tickers ON', 'Click Fortune Tickers OFF')}
            ${this.button('fortuneall', 'Mode: All Fortunes', 'Mode: Unlockable Fortunes Only', 9)}
        </div><div class="listing">
            ${this.button('research', 'Auto-Research ON', 'Auto-Research OFF')}
            ${this.button('pledge', 'Auto-Pledge ON', 'Auto-Pledge OFF')}
        </div><div class="listing">
            ${this.button('reindeer', 'Click Reindeer ON', 'Click Reindeer OFF')}
            ${this.button('wrinkler', 'Pop Wrinklers ON', 'Pop Wrinklers OFF')}
        </div>
        ${this.header("Todd's Automation")}
        <div class="listing">
            ${this.button('toddsresearch', 'Todds-Research ON', 'Todds-Research OFF')}
            ${this.button('toddsbuild', 'Todds-Build ON', 'Todds-Build OFF')}
            ${this.button('toddsgcs', 'Todds-GoldCookie ON', 'Todds-GoldCookie OFF')}
            ${this.button('toddsAutoReincarnate', 'Todds-Reincarnate ON', 'Todds-Reincarnate OFF')}
        </div>
        <div class="listing">
            ${this.button('toddsspell', 'Todds-Spell ON', 'Todds-Spell OFF')}
            <label>开则无限蓝点金手指，关则正常等蓝够了点金手指</label>
            <a class="option" id="lumpClicker" onclick="Game.gainLumps(25);" >click me gain lump</a>
        </div>
        <div class="listing">
            <label for="autoPlantId">auto plant id:</label>
            <input type="number" id="autoPlantId" min="0" max="33" value="${this.config.autoPlantId}">
            <button onclick="FortuneHelper.updateAutoPlantId()">Apply</button>
            ${this.button('toddsplant', 'Todds-AutoPlant ON', 'Todds-AutoPlant OFF')}
            ${this.button('toddsfertilizer', 'Todds-Fertilizer ON', 'Todds-Fertilizer OFF')}
        </div>
        <div class="listing">
        
        <label for="inputHour">Hour(set hours from now):</label>
        <input type="number" id="inputHour" min="0" max="23" value="21">
        <label for="inputMinute">Minute(set minutes from now):</label>
        <input type="number" id="inputMinute" min="0" max="59" value="0"><br><br>
        <label for="inputType">Lump Type(0-default, 1-bi, 2-gold, 3-meat, 4-cara):</label>
        <input type="number" id="inputType" min="0" max="4" value="0"><br><br>
        <button onclick="FortuneHelper.updateGameLumpTime()">Apply Update</button>
        <hr/>

        </div>
        
        <div class="listing">
        <p>plot [0,0] changer(freeze garden before use)</p>
        <label for="plantId">plant id:</label>
        <input type="number" id="plantId" min="0" max="33" value="${this.config.plantId}">
        <label for="matureP">mature:</label>
        <input type="number" id="matureP" min="1" max="100" value="${this.config.matureP}">
        <button onclick="FortuneHelper.updatePlot1()">Apply Plant Changer</button>
        </div>
        
        <br>
        ${this.header('Cheat')}
        <div class="listing">
        <button onclick="FortuneHelper.mightyClick(24000)">24hrs cookies!</button>
        <button onclick="FortuneHelper.cheaperStuff()">make stuff cheaper</button>
        <button onclick="FortuneHelper.popProfit()">check my profit</button>
        <button onclick="FortuneHelper.popSpell()">check my spell</button>
        <button onclick="FortuneHelper.popHarvest()">check my harvest</button>
        <button onclick="FortuneHelper.popResets()">check my resets</button>
        <button onclick="FortuneHelper.popGoldCookieClick()">check my gcc</button>
        <button onclick="FortuneHelper.spawnGoldenCookie()">golden cookie</button>
        <button onclick="FortuneHelper.spawnWrinklers()">spawn wrinklers</button>
        <button onclick="FortuneHelper.timeWarp()">go back in time</button>
        <button onclick="FortuneHelper.checkGFD()">checkGFD</button>
        </div>
        
        
        <br>
        ${this.header('Advanced')}
        <div class="listing">
            ${this.button('chocolateegg', 'Automatic Chocolate Egg ON', 'Automatic Chocolate Egg OFF')}
            <label>Vaults the chocolate egg upgrade if unlocked. On ascend, buys it at max efficiency to get you some extra prestige levels.</label>
        </div>`;

        CCSE.AppendCollapsibleOptionsMenu(this.name, body)
    },

    header: function (title) {
        return `<div class="listing" style="padding: 5px 16px; opacity: 0.7; font-size: 17px; font-family: Kavoon, Georgia, serif;">${title}</div>`
    },

    slider: function (config, text, min, max) {
        const name = `FortuneHelper${config}slider`;
        const value = this.config[config];
        const callback = `FortuneHelper.sliderCallback('${config}', '${name}');`
        return `
        <div class="sliderBox">
            <div style="float:left;">${text}</div>
            <div style="float:right;" id="${name}Value">${value}</div>
            <input class="slider" id="${name}" style="clear:both;" type="range" min="${min}" max="${max}" step="1" value="${value}" 
                onchange="${callback}" oninput="${callback}" onmouseup="PlaySound(\'snd/tick.mp3\');"/>
        </div>`;
    },

    sliderCallback: function (config, slider) {
        const value = Math.round(l(slider).value);
        l(slider + 'Value').innerHTML = value;
        this.config[config] = value;

        if (config === 'click') this.updateAutoclicker();
    },

    button: function (config, texton, textoff, size) {
        const name = `FortuneHelper${config}button`;
        const callback = `FortuneHelper.buttonCallback('${config}', '${name}', '${texton}', '${textoff}');`
        const value = this.config[config];
        return `<a class="${value ? 'option' : 'option off'}" id="${name}" style="font-size:${size ? size : 12}px;"
            ${Game.clickStr}="${callback}">${value ? texton : textoff}</a>`
    },

    buttonCallback: function (config, button, texton, textoff) {
        const value = !this.config[config];
        this.config[config] = value;
        l(button).innerHTML = value ? texton : textoff
        l(button).className = value ? 'option' : 'option off'
        PlaySound('snd/tick.mp3');
    },

    mightyClick: function (hours) {
        var seconds = hours * 3600; // Convert hours to seconds
        if (Game.cookiesPs > 0) {
            var cookiesToAdd = Game.cookiesPs * seconds; // Calculate total cookies = CPS * Total Seconds
            Game.Earn(cookiesToAdd); // Add the calculated cookies to the current total
        } else {
            Game.Earn(10000);
        }

    },

    cheaperStuff: function () {

        Game.ObjectsById[5].minigame.getBrokerPrice = function () {
            return 1;
        };

        Game.getLumpRefillMax = function () {
            return 1;
        };

        for (let i = 0; i < 34; i++) {
            Game.ObjectsById[2].minigame.plantsById[i].cost = 0
            Game.ObjectsById[2].minigame.plantsById[i].costM = 0
        }

        Game.Notify('零元购', 'seed and broker is now much cheaper! garden lump refill faster.', [1, 33], false);
    },

    popSpell: function () {
        const curSpellCasted = Game.Objects["Wizard tower"].minigame.spellsCastTotal;
        Game.Notify('check spell', 'current spell casted:' + curSpellCasted,
            [1, 33], false);
    },

    popHarvest: function () {
        const ht = Game.ObjectsById[2].minigame.harvestsTotal
        Game.Notify('check spell', 'garden total harvests:' + ht,
            [1, 33], false);
    },

    popProfit: function () {
        const curProfit = Game.ObjectsById[5].minigame.profit;
        if (curProfit < 0) {
            Game.ObjectsById[5].minigame.profit = 10;
        }
        const morProfit = 31536000 - parseInt(curProfit);
        Game.Notify('check profit', 'current profit:' + curProfit + '. you need ' + morProfit + ' more profit',
            [1, 33], false);
    },

    popResets: function () {
        const rt = Game.resets
        Game.Notify('check resets', 'total reincarnation count:' + rt,
            [1, 33], false);
    },

    spawnGoldenCookie: function (spawnCount) {
        // var newShimmer = new Game.shimmer("golden");

        for (var i = 0; i < spawnCount; i++) {
            var newShimmer = new Game.shimmer('golden',{noWrath:true});
            newShimmer.spawnLead=1;
            // newShimmer.pop();
        }
    },
    popGoldCookieClick: function () {
        const rt = Game.goldenClicks
        Game.Notify('check gcc', 'total golden cookie clicks:' + rt,
            [1, 33], false);
    },
    spawnWrinklers: function () {
        for (i = 0; i < Game.wrinklers.length; i++) { Game.wrinklers[i].phase = 1; }
    },
    timeWarp: function () {
        Game.fullDate = Date.now() - 365 * 24 * 60 * 60 * 1000 + 125 * 60 * 1000
        Game.Notify('time warp', 'game start time went back in time',
            [1, 33], false);
    },
    checkGFD: function () {
        Game.Notify('checkGFD', 'game start time: ' + Game.fullDate,
            [1, 33], false);
    },
};

// Bind methods
for (func of Object.getOwnPropertyNames(FortuneHelper).filter(m => typeof FortuneHelper[m] === 'function')) {
    FortuneHelper[func] = FortuneHelper[func].bind(FortuneHelper);
}

// Load mod
if (!FortuneHelper.isLoaded) {
    if (CCSE && CCSE.isLoaded) {
        FortuneHelper.register();
    } else {
        if (!CCSE) var CCSE = {};
        if (!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
        CCSE.postLoadHooks.push(FortuneHelper.register);
    }
}
