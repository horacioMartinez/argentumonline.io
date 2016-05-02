define(['storage/defaultsettings','jquery-ui'], function (DefaultSettings) {
    var Storage = Class.extend({
        init: function () {
            if (this.hasLocalStorage() && localStorage.data) {
                var userData = JSON.parse(localStorage.data);
                var defaultData = this._getDefaultData();
                this._data = $.extend(true,defaultData, userData); // agrega los userData a defaultData, es por si falta algun campo en userData que este en default
            } else {
                this.resetData();
            }
        },

        resetData: function () {
            this._data = this._getDefaultData();
        },

        _getDefaultData: function(){
            var defSettings = $.extend(true,{},DefaultSettings);
            return {
                settings: defSettings
            };
        },

        getDefaultKeys: function(){
            return this._getDefaultData().settings.keys;
        },

        getKeys: function () {
            return this._data.settings.keys;
        },

        getSoundMuted: function(){
            return this._data.settings.audio.soundMuted;
        },

        getMusicMuted: function(){
            return this._data.settings.audio.musicMuted;
        },

        getSoundVolume: function () {
            return this._data.settings.audio.soundVolume;
        },

        getMusicVolume: function () {
            return this._data.settings.audio.musicVolume;
        },

        setSoundMuted: function(muted){
            this._data.settings.audio.soundMuted = muted;
            this.save();
        },

        setMusicMuted: function(muted){
            this._data.settings.audio.musicMuted = muted;
            this.save();
        },

        setSoundVolume: function (vol) {
            this._data.settings.audio.soundVolume = vol;
            this.save();
        },

        setMusicVolume: function (vol) {
            this._data.settings.audio.musicVolume = vol;
            this.save();
        },

        setKeys: function (keys) {
            this._data.settings.keys = keys;
            this.save();
        },

        hasLocalStorage: function () {
            return Modernizr.localstorage;
        },

        save: function () {
            if (this.hasLocalStorage()) {
                localStorage.data = JSON.stringify(this._data);
            }
        },

        clear: function () {
            if (this.hasLocalStorage()) {
                localStorage.data = "";
                this.resetData();
            }
        },
/*
        hasAlreadyPlayed: function () {
            return this._data.hasAlreadyPlayed;
        },*/
    });

    return Storage;
});
