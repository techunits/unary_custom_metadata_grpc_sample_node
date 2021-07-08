// load required packages
const logger = require("elogger");
const uuid = require("uuid");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// load article.proto to load the gRPC data contract
const packageDefinition = protoLoader.loadSync("./sample.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const sampleProto = grpc.loadPackageDefinition(packageDefinition).SamplePackage;

// define pingHandler method
const pingHandler = (call, callback) => {
    logger.debug(`gRPC ${call.call.handler.path}`);
    
    callback(null, {
        request_id: uuid.v4(),
        value: call.request.key,
        client: call.metadata.internalRepr.has("company") ? call.metadata.internalRepr.get("company")[0] : null
    });
};

// initialize server and register handlers for the respective RPC methods
const server = new grpc.Server();        
server.addService(sampleProto.SampleService.service, {
    ping: pingHandler
});

// bind & start the server process to port: 9111
const bindEndpoint = `0.0.0.0:9090`;
server.bindAsync(bindEndpoint, grpc.ServerCredentials.createInsecure(), (err, response) => {
    if(err) {
        logger.error(err);
    }
    else {
        server.start();
        logger.info(`Sample gRPC service started on grpc://${bindEndpoint}`);
        
    }
});