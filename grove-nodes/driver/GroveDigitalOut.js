'use strict';

const mraa = require('mraa');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

module.exports = class GroveDigitalOut {
    constructor(pin) {
        this._Pin = pin;
    }

    async Init() {
        this._InOut = new mraa.Gpio(this._Pin);
        await sleep(100);
        if (this._InOut.dir(mraa.DIR_OUT_LOW) !== mraa.SUCCESS) throw new Error('Error Gpio.dir()');
    }

    On() {
        if (this._InOut.write(1) !== mraa.SUCCESS) throw new Error('Error Gpio.write()');
    }

    Off() {
        if (this._InOut.write(0) !== mraa.SUCCESS) throw new Error('Error Gpio.write()');
    }
}
