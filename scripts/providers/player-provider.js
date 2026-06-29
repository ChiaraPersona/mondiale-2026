const { section } = require("./reading-source");

module.exports = function PlayerProvider(source) {
  const volume = section(source, /tiri e corner/i);
  const discipline = source.sections.filter(item => /ammon|disciplin|cartell/i.test(item.title));
  return {
    keyPlayers: source.sections
      .flatMap(item => item.paragraphs)
      .filter(value => /\b(principale|chiave|può decidere|vantaggio individuale)\b/i.test(value)),
    playersToWatch: [
      ...(volume?.paragraphs || []),
      ...discipline.flatMap(item => item.paragraphs),
    ].filter(value => /\b(candidat[oa]|outsider|tiri|ammonit)\b/i.test(value)),
  };
};
