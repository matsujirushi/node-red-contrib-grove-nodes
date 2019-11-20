'use strict';

const GroveTempHumiSHT31 = require('./driver/GroveTempHumiSHT31.js');

module.exports = function(RED) {
    function Register(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this._Repeatability = config.repeatability;

        this._ModuleInitialized = false;
        this._Module = new GroveTempHumiSHT31(0, 0x44);

        node.on('input', async function(msg, send, done) {
            try {
                if (!this._ModuleInitialized) {
                    this._Module.Init();
                    switch (this._Repeatability) {
                        case 'High':
                            this._Module.Repeatability = this._Module.REPEATABILITY_HIGH;
                            break;
                        case 'Medium':
                            this._Module.Repeatability = this._Module.REPEATABILITY_MEDIUM;
                            break;
                        case 'Low':
                            this._Module.Repeatability = this._Module.REPEATABILITY_LOW;
                            break;
                    }
                    this._ModuleInitialized = true;
                }

                await this._Module.Read();

                msg.payload = {
                    "temperature": this._Module.Temperature,
                    "humidity": this._Module.Humidity
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

    RED.nodes.registerType("temp-humi-sht31", Register);
}
