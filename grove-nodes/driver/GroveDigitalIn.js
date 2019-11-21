'use strict';

const mraa = require('mraa');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

module.exports = class GroveDigitalIn {
    constructor(pin) {
        this._Pin = pin;
    }

    async Init() {
        this._InOut = new mraa.Gpio(this._Pin);
        await sleep(100);
        if (this._InOut.dir(mraa.DIR_IN) !== mraa.SUCCESS) throw new Error('Error Gpio.dir()');
    }

    IsOn() {
        return this._InOut.read();
    }
}
