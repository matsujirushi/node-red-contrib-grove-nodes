'use strict';

const GroveTempHumiSHT31 = require('./driver/GroveTempHumiSHT31.js');

module.exports = function(RED) {
    function TempHumiSHT31(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.repeatability = config.repeatability;

        this._Sensor = new GroveTempHumiSHT31(0, 0x44);
        this._Sensor.Init();
        switch (config.repeatability) {
            case 'High':
                this._Sensor.Repeatability = this._Sensor.REPEATABILITY_HIGH;
                break;
            case 'Medium':
                this._Sensor.Repeatability = this._Sensor.REPEATABILITY_MEDIUM;
                break;
            case 'Low':
                this._Sensor.Repeatability = this._Sensor.REPEATABILITY_LOW;
                break;
        }

        node.on('input', async function(msg, send, done) {
            try {
                await this._Sensor.Read();

                msg.payload = {
                    "temperature": this._Sensor.Temperature,
                    "humidity": this._Sensor.Humidity
                };
                send(msg);
            }
            catch (e) {
                if (done) {
                    done(e.message);
                } else {
                    node.error(e.message, msg);
                }
            }
            if (done) {
                done();
            }
        });
    }

    RED.nodes.registerType("temp-humi-sht31", TempHumiSHT31);
}
