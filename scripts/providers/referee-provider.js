const { section } = require("./reading-source");

module.exports = function RefereeProvider(source) {
  const block = source.sections.find(item => /ammon|disciplin|cartell/i.test(item.title));
  const content = block?.paragraphs.join(" ") || "";
  const average = content.match(/(?:media|dato)[^.]{0,50}?(\d+(?:[.,]\d+)?)\s+gialli/i);
  const numeric = average ? Number(average[1].replace(",", ".")) : null;
  return {
    strictness: numeric === null ? null : numeric >= 5 ? "high" : numeric >= 3.5 ? "medium" : "low",
    yellowAverage: numeric,
  };
};
