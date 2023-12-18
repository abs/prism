"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPrismAndSetupWatcher = void 0;
const chokidar = require("chokidar");
const os = require("os");
const operations_1 = require("../operations");
function runPrismAndSetupWatcher(createPrism, options) {
    return createPrism(options).then(possibleServer => {
        if (possibleServer) {
            let server = possibleServer;
            const watcher = chokidar.watch(options.document, {
                persistent: os.platform() === 'darwin',
                disableGlobbing: true,
                awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
            });
            watcher.on('change', () => {
                server.logger.info('Restarting Prism...');
                (0, operations_1.getHttpOperationsFromSpec)(options.document)
                    .then(operations => {
                    if (operations.length === 0) {
                        server.logger.info('No operations found in the current file, continuing with the previously loaded spec.');
                    }
                    else {
                        return server
                            .close()
                            .then(() => {
                            server.logger.info('Loading the updated operations...');
                            return createPrism(options);
                        })
                            .then(newServer => {
                            if (newServer) {
                                server = newServer;
                            }
                        });
                    }
                })
                    .catch(() => {
                    server.logger.warn('Something went terribly wrong, trying to start Prism with the original document.');
                    return server
                        .close()
                        .then(() => createPrism(options))
                        .catch(() => process.exit(1));
                });
            });
            return new Promise(resolve => watcher.once('ready', () => resolve(server)));
        }
    });
}
exports.runPrismAndSetupWatcher = runPrismAndSetupWatcher;
