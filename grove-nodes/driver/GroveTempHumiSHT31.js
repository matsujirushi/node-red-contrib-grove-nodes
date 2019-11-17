'use strict';

const mraa = require('mraa');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

module.exports = class GroveTempHumiSHT31 {
    constructor(bus, slaveAddress) {
        this.REPEATABILITY_HIGH = 0;
        this.REPEATABILITY_MEDIUM = 1;
        this.REPEATABILITY_LOW = 2;

        this._Bus = bus;
        this._SlaveAddress = slaveAddress;
        this.Repeatability = this.REPEATABILITY_HIGH;
    }

    Init() {
        this._Device = new mraa.I2c(this._Bus);
        this._Device.address(this._SlaveAddress);
    }

    async Read() {
        function CalcCRC8(data, offset, length) {
            let crc = 0xff;

            for (let j = 0; j < length; j++) {
                crc ^= data.readUInt8(j + offset);

                for (let i = 8; i > 0; i--) {
                    crc = (crc & 0x80 ? crc << 1 ^ 0x31 : crc << 1) & 0xff;
                }
            }

            return crc;
        }

        const sendData = Buffer.from([ 0x24, 0x00 ]);
        let duration;
        switch (this.Repeatability) {
            case this.REPEATABILITY_HIGH:
                sendData[1] = 0x00;
                duration = 15;
                break;
            case this.REPEATABILITY_MEDIUM:
                sendData[1] = 0x0b;
                duration = 6;
                break;
            case this.REPEATABILITY_LOW:
                sendData[1] = 0x16;
                duration = 4;
                break;
        }
        this._Device.write(sendData);
        await sleep(duration);

        const recvData = this._Device.read(2 + 1 + 2 + 1);

        if (recvData[2] != CalcCRC8(recvData, 0, 2)) console.log('ERROR!'); // TODO
        if (recvData[5] != CalcCRC8(recvData, 3, 2)) console.log('ERROR!'); // TODO

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
