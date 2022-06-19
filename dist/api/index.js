"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiPloomes = exports.apiSigner = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.apiSigner = axios_1.default.create({
    baseURL: 'https://assinador.previsa.com.br/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.SIGNER_KEY
    }
});
exports.apiPloomes = axios_1.default.create({
    baseURL: 'https://api2.ploomes.com/',
    headers: {
        'Content-Type': 'application/json',
        'user-key': process.env.PLOOMES_KEY
    }
});
