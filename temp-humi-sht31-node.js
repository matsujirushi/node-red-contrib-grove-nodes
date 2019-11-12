'use strict';

const SHT31 = require('./SHT31.js');

module.exports = function(RED) {
    function TempHumiSHT31Node(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this._Sensor = new SHT31(0, 0x45);
        this._Sensor.Init();

        node.on('input', async function(msg, send, done) {
            await this._Sensor.Read();

            msg.payload = {
                "temperature": this._Sensor.Temperature,
                "humidity": this._Sensor.Humidity
            };
            send(msg);
            
            if (done) {
                done();
            }
        });
    }

    RED.nodes.registerType("temp-humi-sht31", TempHumiSHT31Node);
}
