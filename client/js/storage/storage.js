define(['storage/defaultsettings'], function (DefaultSettings) {
    class Storage {
        constructor() {
            if (this.hasLocalStorage() && localStorage.data) {
                var userData = JSON.parse(localStorage.data);
                var defaultData = this._getDefaultData();
                this._data = $.extend(true, defaultData, userData); // agrega los userData a defaultData, es por si falta algun campo en userData que este en default
            } else {
                this.resetData();
            }
        }

        resetData() {
            this._data = this._getDefaultData();
        }

        _getDefaultData() {
            var defSettings = $.extend(true, {}, DefaultSettings);
            return {
                settings: defSettings
            };
        }

        getDefaultKeys() {
            return this._getDefaultData().settings.keys;
        }

        getKeys() {
            return this._data.settings.keys;
        }

        getSoundMuted() {
            return this._data.settings.audio.soundMuted;
        }

        getMusicMuted() {
            return this._data.settings.audio.musicMuted;
        }

        getSoundVolume() {
            return this._data.settings.audio.soundVolume;
        }

        getMusicVolume() {
            return this._data.settings.audio.musicVolume;
        }

        setSoundMuted(muted) {
            this._data.settings.audio.soundMuted = muted;
            this.save();
        }

        setMusicMuted(muted) {
            this._data.settings.audio.musicMuted = muted;
            this.save();
        }

        setSoundVolume(vol) {
            this._data.settings.audio.soundVolume = vol;
            this.save();
        }

        setMusicVolume(vol) {
            this._data.settings.audio.musicVolume = vol;
            this.save();
        }

        setKeys(keys) {
            this._data.settings.keys = keys;
            this.save();
        }

        hasLocalStorage() {
            return Modernizr.localstorage;
        }

        save() {
            if (this.hasLocalStorage()) {
                localStorage.data = JSON.stringify(this._data);
            }
        }

        clear() {
            if (this.hasLocalStorage()) {
                localStorage.data = "";
                this.resetData();
            }
            this.save();
        }

        /*
         hasAlreadyPlayed() {
         return this._data.hasAlreadyPlayed;
         }*/
    }

    return Storage;
});
