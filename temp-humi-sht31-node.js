module.exports = function(RED) {
    function TempHumiSHT31Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg, send, done) {
            send(msg);
            if (done) {
                done();
            }
        });
    }

    RED.nodes.registerType("temp-humi-sht31", TempHumiSHT31Node);
}
