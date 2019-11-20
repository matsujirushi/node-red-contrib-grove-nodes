'use strict';

const GroveDigitalOut = require('./driver/GroveDigitalOut.js');

module.exports = function(RED) {
    function Register(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this._ModuleInitialized = false;
        this._Module = new GroveDigitalOut(Number(config.pin));

        node.on('input', async function(msg, send, done) {
            try {
                if (!this._ModuleInitialized) {
                    await this._Module.Init();
                    this._ModuleInitialized = true;
                }

                switch (msg.payload) {
                    case true:
                        this._Module.On();
                        break;
                    case false:
                        this._Module.Off();
                        break;
                }

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

    RED.nodes.registerType("buzzer", Register);
}
