'use strict';

const GroveDigitalIn = require('./driver/GroveDigitalIn.js');

module.exports = function(RED) {
    function Register(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this._ModuleInitialized = false;
        this._Module = new GroveDigitalIn(Number(config.pin));

        node.on('input', async function(msg, send, done) {
            try {
                if (!this._ModuleInitialized) {
                    await this._Module.Init();
                    this._ModuleInitialized = true;
                }

                msg.payload = this._Module.IsOn() === 1 ? true : false;
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

    RED.nodes.registerType("button", Register);
}
