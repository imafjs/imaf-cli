"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (api, options) => {
    api.registerCommand('help', {}, args => {
        const cmd = args._[0];
        console.log(cmd);
    });
    // return;
};
