// load required packages
const logger = require("elogger");
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
const endpoint = "localhost:9090";
const serviceStub = new sampleProto.SampleService(endpoint, grpc.credentials.createInsecure());

// create custom metadata/header object to pass into the request
const metadata = new grpc.Metadata();
metadata.set("company", "TECHUNITS");

const payload = {
    "key": "Foo bar"
}

serviceStub.ping(payload, metadata, (err, response) => {
    if(err) {
        logger.error(err);
    }

    console.log(response);
});