const bot = require("../bot.js");

bot.setMyCommands([
  { command: "start", description: "Welcome Message" },
  { command: "help", description: "Returns the list of available commands" }
]);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to the Meeting Management Bot!\nHere you'll be able to check the attendance of the people on your meetings/events.\nType /help to see the list of keywords that are available."
  );
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Available Commands:\nEvents {year}: It will return a list of the names of all events that happened on the specified year\nEvents {month} {year}: It will return a list of the names of all the events that happened on the specified month (it can be written as a number or as the name of the month) and year.\n{event name}: it will return a list of the people who attended the event."
  );
});
