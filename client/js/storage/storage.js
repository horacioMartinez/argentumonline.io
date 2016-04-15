
define(['storage/defaultsettings'], function (DefaultSettings) {
    var Storage = Class.extend({
        init: function() {
            if(this.hasLocalStorage() && localStorage.data) {
                this._data = JSON.parse(localStorage.data);
            } else {
                this.resetData();
            }
        },

        resetData: function() {
            this._data = {settings: DefaultSettings};
        },

        getSettings: function(){
          return this._data.settings;
        },

        getKeys: function(){
          return this._data.settings.keys;
        },

        setKeys: function(keys){
            this._data.settings.keys = keys;
            this.save();
        },

        hasLocalStorage: function() {
            return Modernizr.localstorage;
        },

        save: function() {
            if(this.hasLocalStorage()) {
                localStorage.data = JSON.stringify(this._data);
            }
        },

        clear: function() {
            if(this.hasLocalStorage()) {
                localStorage.data = "";
                this.resetData();
            }
        },

        // Player

        hasAlreadyPlayed: function() {
            return this._data.hasAlreadyPlayed;
        },

        initPlayer: function(name) {
            this._data.hasAlreadyPlayed = true;
            this.setPlayerName(name);
        },

        setPlayerName: function(name) {
            this._data.player.name = name;
            this.save();
        },

        setPlayerImage: function(img) {
            this._data.player.image = img;
            this.save();
        },

        setPlayerArmor: function(armor) {
            this._data.player.armor = armor;
            this.save();
        },

        setPlayerWeapon: function(weapon) {
            this._data.player.weapon = weapon;
            this.save();
        },
        
        setPlayerGuild: function(guild) {
			if(typeof guild !== "undefined") {
				this._data.player.guild={id:guild.id, name:guild.name,members:JSON.stringify(guild.members)};
				this.save();
			}
			else{
				delete this._data.player.guild;
				this.save();
			}
		},

        savePlayer: function(img, armor, weapon, guild) {
            this.setPlayerImage(img);
            this.setPlayerArmor(armor);
            this.setPlayerWeapon(weapon);
            this.setPlayerGuild(guild);
        },

        // Achievements

        hasUnlockedAchievement: function(id) {
            return _.include(this._data.achievements.unlocked, id);
        },

        unlockAchievement: function(id) {
            if(!this.hasUnlockedAchievement(id)) {
                this._data.achievements.unlocked.push(id);
                this.save();
                return true;
            }
            return false;
        },

        getAchievementCount: function() {
            return _.size(this._data.achievements.unlocked);
        },

        // Angry rats
        getRatCount: function() {
            return this._data.achievements.ratCount;
        },

        incrementRatCount: function() {
            if(this._data.achievements.ratCount < 10) {
                this._data.achievements.ratCount++;
                this.save();
            }
        },

        // Skull Collector
        getSkeletonCount: function() {
            return this._data.achievements.skeletonCount;
        },

        incrementSkeletonCount: function() {
            if(this._data.achievements.skeletonCount < 10) {
                this._data.achievements.skeletonCount++;
                this.save();
            }
        },

        // Meatshield
        getTotalDamageTaken: function() {
            return this._data.achievements.totalDmg;
        },

        addDamage: function(damage) {
            if(this._data.achievements.totalDmg < 5000) {
                this._data.achievements.totalDmg += damage;
                this.save();
            }
        },

        // Hunter
        getTotalKills: function() {
            return this._data.achievements.totalKills;
        },

        incrementTotalKills: function() {
            if(this._data.achievements.totalKills < 50) {
                this._data.achievements.totalKills++;
                this.save();
            }
        },

        // Still Alive
        getTotalRevives: function() {
            return this._data.achievements.totalRevives;
        },

        incrementRevives: function() {
            if(this._data.achievements.totalRevives < 5) {
                this._data.achievements.totalRevives++;
                this.save();
            }
        },
    });

    return Storage;
});
