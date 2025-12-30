"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBase24Id = generateBase24Id;
const crypto_1 = __importDefault(require("crypto"));
const BASE24_CHARS = "0123456789abcdefghijkmnpqrs";
const BASE = BASE24_CHARS.length;
function generateBase24Id(minLength = 6) {
    let id = "";
    while (id.length < minLength) {
        const byte = crypto_1.default.randomBytes(1)[0];
        id += BASE24_CHARS[byte % BASE];
    }
    return id;
}
