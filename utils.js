module.exports = {
  monthsToNumber: {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11
  },

  capitalizeEachWord: (str) => {
    if (!str) return "";
    if (typeof str !== "string") return str;
    const parts = str
      .trim()
      .split(" ")
      .filter((part) => part !== "");
    return parts.map((part) => part[0].toUpperCase() + part.substring(1).toLowerCase()).join(" ");
  }
};
