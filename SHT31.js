'use strict';

const mraa = require('mraa');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

module.exports = class SHT31 {
    constructor(bus, slaveAddress) {
        this._Bus = bus;
        this._SlaveAddress = slaveAddress;
    }

    Init() {
        this._Device = new mraa.I2c(this._Bus);
        this._Device.address(this._SlaveAddress);
    }

    async Read() {
        const sendData = Buffer.from([ 0x24, 0x00 ]);
        this._Device.write(sendData);
        await sleep(15);

        const recvData = this._Device.read(2 + 1 + 2 + 1);

        // TODO Check CRC8

        const ST = recvData.readUInt16BE(0);
        const SRH = recvData.readUInt16BE(3);

        this._Temperature = ST * 175 / 0xffff - 45;
        this._Humidity = SRH * 100 / 0xffff;
    }

    get Temperature() {
        return this._Temperature;
    }

    get Humidity() {
        return this._Humidity;
    }
}
