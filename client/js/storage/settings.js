/**
 * Created by horacio on 07/09/2016.
 */

define(['storage/defaultsettings', 'storage/storage'], function (DefaultSettings, Storage) {
    class Settings {
        constructor() {
            this.storage = new Storage();
            var defaultSettings = this._getDefaultData();
            this._settings = this.storage.getItem('settings', defaultSettings);
        }

        _getDefaultData() {
            return $.extend(true, {}, DefaultSettings);
        }

        getDefaultKeys() {
            return this._getDefaultData().keys;
        }

        getKeys() {
            return this._settings.keys;
        }

        getSoundMuted() {
            return this._settings.audio.soundMuted;
        }

        getMusicMuted() {
            return this._settings.audio.musicMuted;
        }

        getSoundVolume() {
            return this._settings.audio.soundVolume;
        }

        getMusicVolume() {
            return this._settings.audio.musicVolume;
        }

        setSoundMuted(muted) {
            this._settings.audio.soundMuted = muted;
            this.save();
        }

        setMusicMuted(muted) {
            this._settings.audio.musicMuted = muted;
            this.save();
        }

        setSoundVolume(vol) {
            this._settings.audio.soundVolume = vol;
            this.save();
        }

        setMusicVolume(vol) {
            this._settings.audio.musicVolume = vol;
            this.save();
        }

        setKeys(keys) {
            this._settings.keys = keys;
            this.save();
        }

        save() {
            this.storage.setItem('settings', this._settings);
        }

        clear() {
            this.storage.removeItem('settings');
        }

    }

    return Settings;
});
