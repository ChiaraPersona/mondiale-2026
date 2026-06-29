const { section } = require("./reading-source");

module.exports = function RiskProvider(source) {
  const motivation = section(source, /motivaz/i);
  const volume = section(source, /tiri e corner/i);
  const discipline = source.sections.filter(item => /ammon|disciplin|cartell/i.test(item.title));
  return {
    upset: (motivation?.paragraphs || []).filter(value => /rischio sorpresa/i.test(value)),
    corners: volume?.paragraphs.filter(value => /corner/i.test(value)) || [],
    cards: discipline.flatMap(item => item.paragraphs).filter(value => /cartell|giall|ammon/i.test(value)),
    goals: source.sections.flatMap(item => item.paragraphs).filter(value =>
      /\b(goleada|molti gol|pochi gol)\b/i.test(value)
    ),
  };
};
