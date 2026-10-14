// Import required modules from node-opcua and Node.js
const { OPCUAServer, Variant, DataType } = require("node-opcua");
const fs = require("fs");
const path = require("path");

// Load configuration from config.json
const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Create a new OPC UA server instance with config options
const server = new OPCUAServer({
    port: config.port, // Port from config.json
    resourcePath: "/UA/Server", // Path for the server endpoint
    buildInfo: {
        productName: "Custom OPC UA Server",
        buildNumber: "1",
        buildDate: new Date()
    },
    userManager: {
        // Simple username/password authentication
        isValidUser: (username, password) => {
            return username === config.username && password === config.password;
        }
    },
    allowAnonymous: false // Disable anonymous access
});

// Main async function to initialize and start the server
(async () => {
    await server.initialize();
    const addressSpace = server.addressSpace;
    if (!addressSpace) {
        console.error("addressSpace is undefined after initialize.");
        return;
    }
    const namespaceIndex = 1; // Use default namespace

    // Create the parent folder as specified in config.json
    const parentFolder = addressSpace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: config.parentFolder,
        nodeId: `ns=${namespaceIndex};s=${config.parentFolder}`
    });

    // Add each tag from config.json as a variable under the parent folder
    config.tags.forEach(tag => {
        // Store value in a local variable so it can be updated by OPC UA client writes
        let tagValue = tag.value;
        addressSpace.addVariable({
            componentOf: parentFolder,
            browseName: tag.name,
            nodeId: `ns=${namespaceIndex};s=${tag.name}`,
            dataType: DataType[tag.dataType],
            value: {
                // Allow both reading and writing the value
                get: () => new Variant({ dataType: DataType[tag.dataType], value: tagValue }),
                set: (variant) => {
                    tagValue = variant.value;
                    return opcua.StatusCodes.Good;
                }
            }
        });
    });

    // Start the OPC UA server and print endpoint info
    server.start(() => {
        console.log(`OPC UA Server is now listening on port ${config.port}`);
        // Print all available endpoint URLs
        let endpointPrinted = false;
        if (server.endpoints && server.endpoints.length > 0) {
            server.endpoints.forEach(endpoint => {
                endpoint.endpointDescriptions().forEach(desc => {
                    console.log(`Endpoint URL: ${desc.endpointUrl}`);
                    endpointPrinted = true;
                });
            });
        }
        // Fallback: print getEndpointUrl if nothing else was printed
        if (!endpointPrinted && typeof server.getEndpointUrl === 'function') {
            try {
                const url = server.getEndpointUrl();
                if (url) console.log(`Endpoint URL: ${url}`);
            } catch (e) {
                console.log("No endpoints available yet.");
            }
        }
    });
})();
