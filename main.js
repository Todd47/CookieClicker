if (ToddsMod === undefined) var ToddsMod = {
    name: 'ToddsMod',

    register: function() {
        Game.registerMod(this.name, this);
    },



};
if (typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

ToddsMod.launch = function () {
    this.register()
    Game.Notify(`==========Todd's mod loaded!==========`,[16,5]);
    console.log("Todd's mod loaded!!!!")

    /**

     All the code you want to delay goes here
     Put "ToddsMod.isLoaded = 1;" somewhere within

     **/
    ToddsMod.isLoaded = 1;
}

// Load mod
if (!ToddsMod.isLoaded) {
    if (CCSE && CCSE.isLoaded) {
        ToddsMod.launch();
    } else {
        if (!CCSE) var CCSE = {};
        if (!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
        CCSE.postLoadHooks.push(ToddsMod.launch);
    }
}
