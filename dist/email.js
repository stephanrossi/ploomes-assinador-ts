"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Assinador = __importStar(require("./assinador.js"));
const imap_simple_1 = __importDefault(require("imap-simple"));
const logger_js_1 = require("./helpers/logger.js");
const sendMail_js_1 = require("./helpers/sendMail.js");
const html_to_text_1 = require("html-to-text");
const config_1 = require("./config");
const readMail = async () => {
    try {
        const connection = await imap_simple_1.default.connect(config_1.READ_MAIL_CONFIG);
        logger_js_1.mailLogger.info('CONNECTION SUCCESSFUL.');
        const box = await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
        };
        const results = await connection.search(searchCriteria, fetchOptions);
        if (results.length === 0) {
            logger_js_1.mailLogger.info('No unread messages were found.');
            connection.end();
            return false;
        }
        results.forEach(async (res) => {
            const text = res.parts.filter((part) => {
                return part.which === 'TEXT';
            });
            let emailHTML = text[0].body;
            let emailText = (0, html_to_text_1.convert)(emailHTML);
            let obj = {};
            emailText.split('\n').forEach(v => v.replace(/\s*(.*)\s*:\s*(.*)\s*/, (s, key, val) => {
                obj[key] = isNaN(val) || val.length < 1 ? val || undefined : Number(val);
            }));
            let clientName = obj.Cliente.toUpperCase();
            let clientCPF = obj.CPF_do_contato;
            let contractId = parseInt(obj.id_contrato);
            if (clientCPF == null || clientCPF == '' || clientCPF == undefined) {
                logger_js_1.mailLogger.error(`readMail: CPF on contract ${contractId} is missing.`);
                await (0, sendMail_js_1.sendingEmail)(clientName);
                return false;
            }
            let proposeId = parseInt(obj.Proposta_codigo);
            await Assinador.createDocument(contractId, clientName, proposeId);
        });
        connection.end();
    }
    catch (error) {
        logger_js_1.mailLogger.error(`readMail: ${error}`);
        return false;
    }
};
readMail();
