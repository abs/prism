"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const createServer_1 = require("../util/createServer");
const sharedOptions_1 = require("./sharedOptions");
const runner_1 = require("../util/runner");
const mockCommand = {
    describe: 'Start a mock server with the given document file',
    command: 'mock <document>',
    builder: yargs => yargs
        .positional('document', {
        description: 'Path to a document file. Can be both a file or a fetchable resource on the web.',
        type: 'string',
    })
        .options({
        ...sharedOptions_1.default,
        dynamic: {
            alias: 'd',
            description: 'Dynamically generate examples.',
            boolean: true,
            default: false,
        },
        explicit: {
            alias: 'e',
            description: 'Explicit response specification file or URL',
            type: 'string',
            default: undefined,
        },
        'json-schema-faker-fillProperties': {
            description: 'Generate additional properties when using dynamic generation.',
            default: undefined,
            boolean: true,
        },
        ignoreExamples: {
            description: `Tell Prism to treat the spec as though it has no examples. When in static mode,
                        returns an example that has not been generated using json-schema-faker, but was 
                        created by Prism. When in dynamic mode, this flag is ignored, since in dynamic mode,
                        examples are not consulted and json-schema-faker is used to generate a response based 
                        on the schema defined in the spec`,
            boolean: true,
            default: false,
        },
    }),
    handler: async (parsedArgs) => {
        parsedArgs.jsonSchemaFakerFillProperties = parsedArgs['json-schema-faker-fillProperties'];
        const { multiprocess, dynamic, explicit: explicitRelative, port, host, cors, document, errors, verboseLevel, ignoreExamples, jsonSchemaFakerFillProperties } = parsedArgs;
        const createPrism = multiprocess ? createServer_1.createMultiProcessPrism : createServer_1.createSingleProcessPrism;
        const options = {
            cors,
            dynamic,
            explicit: (0, path_1.resolve)(explicitRelative),
            port,
            host,
            document,
            multiprocess,
            errors,
            verboseLevel,
            ignoreExamples,
            jsonSchemaFakerFillProperties,
        };
        await (0, runner_1.runPrismAndSetupWatcher)(createPrism, options);
    },
};
exports.default = mockCommand;
