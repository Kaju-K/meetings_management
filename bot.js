const TelegramBot = require("node-telegram-bot-api");

const token = process.env.telegram_token;

const bot = new TelegramBot(token, { polling: true });

module.exports = bot;
