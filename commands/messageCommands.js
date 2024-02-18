const moment = require("moment");
const bot = require("../bot.js");
const { monthsToNumber, capitalizeEachWord } = require("../utils.js");
const fs = require("fs");
const { readGoogleSheet, writeGoogleSheet, clearGoogleSheet } = require("../services/googleSheetService.js");

const eventsData = JSON.parse(fs.readFileSync("./eventsInfo.json", "utf8"));

bot.on("message", async (msg) => {
  let userMessage = msg.text.trim();
  let events = "events";

  // Events...
  if (userMessage.toLowerCase().indexOf(events) === 0) {
    let splittedMessage = userMessage.split(" ");
    // Events {month} {year}
    if (splittedMessage.length === 3) {
      if ((1 <= parseInt(splittedMessage[1]) <= 12 || monthsToNumber[splittedMessage[1]]) && parseInt(splittedMessage[2])) {
        let month = parseInt(splittedMessage[1]) - 1 >= 0 ? parseInt(splittedMessage[1]) - 1 : monthsToNumber[splittedMessage[1]];
        let year = parseInt(splittedMessage[2]);
        let allEventsFromMonthAndYear = eventsData.filter(
          (event) => moment(event.date, "DD/MM/YYYY").month() === month && moment(event.date, "DD/MM/YYYY").year() === year
        );
        if (allEventsFromMonthAndYear.length) {
          bot.sendMessage(
            msg.chat.id,
            `List of the events from ${(month + 1).toString().padStart(2, "0")}/${year}:\n${allEventsFromMonthAndYear
              .map((event) => `${event.name}\n`)
              .join("\n")}`
          );
        } else {
          bot.sendMessage(msg.chat.id, `There were no events on ${(month + 1).toString().padStart(2, "0")}/${year}`);
        }
      } else {
        bot.sendMessage(msg.chat.id, "Check if the dates were written correctly");
      }
      // Events {year}
    } else if (splittedMessage.length === 2) {
      if (!parseInt(splittedMessage[1])) {
        bot.sendMessage(msg.chat.id, "The year must be a number");
      } else {
        let year = parseInt(splittedMessage[1]);
        let allEventsFromYear = eventsData.filter((event) => moment(event.date, "DD/MM/YYYY").year() === year);
        if (allEventsFromYear.length) {
          bot.sendMessage(msg.chat.id, `List of events from ${year}:\n${allEventsFromYear.map((event) => `${event.name}`).join("\n")}`);
        } else {
          bot.sendMessage(msg.chat.id, `There were no events on ${year}`);
        }
      }
    } else {
      bot.sendMessage(msg.chat.id, "Check if the dates were written correctly");
    }
  }

  const selectedEvent = eventsData.find((event) => event.name.toLowerCase() === userMessage.toLowerCase());
  if (selectedEvent) {
    bot.sendMessage(msg.chat.id, `Attendees for ${capitalizeEachWord(userMessage)}:\n${selectedEvent.attendees.join("\n")}`);
    const sheetsReading = await readGoogleSheet();
    const rows = sheetsReading.values;
    const filteredRows = rows.filter((row) => row[0]?.toLowerCase() === userMessage.toLowerCase());
    if (filteredRows.length) {
      const firstAppearance = rows.indexOf(filteredRows[0]);
      const lastAppearance = rows.indexOf(filteredRows[filteredRows.length - 1]) + 1;
      await clearGoogleSheet(firstAppearance, lastAppearance);
    }

    const dataToSave = selectedEvent.attendees.map((attendee) => [selectedEvent.name, selectedEvent.date, attendee]);
    writeGoogleSheet(dataToSave);
  }
});
