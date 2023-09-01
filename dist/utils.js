"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fmtDuration = void 0;
const handler_1 = require("@sern/handler");
function fmtDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration / 60) - hours * 60);
    const seconds = Math.floor(duration - (hours * 3600) - (minutes * 60));
    let durationString = "";
    const logger = (0, handler_1.Service)("@sern/logger");
    logger.info({ message: `${hours} ${minutes} ${seconds}` });
    if (hours > 0)
        durationString += `${hours}`;
    if (minutes > 0)
        durationString += `:${minutes}`;
    if (seconds > 0)
        durationString += `:${seconds}`;
    return durationString;
}
exports.fmtDuration = fmtDuration;
