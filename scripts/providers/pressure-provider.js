const { section } = require("./reading-source");

module.exports = function PressureProvider(source) {
  const motivation = section(source, /motivaz/i);
  const verdict = section(source, /verdetto/i);
  const text = [...(motivation?.paragraphs || []), ...(verdict?.paragraphs || [])].join(" ");
  return {
    mustWin: /\b(deve vincere|devono vincere|obbligat[oaie])\b/i.test(text),
    canSettle: /\b(può accontentarsi|nulla da perdere|pressione (?:limitata|inferiore))\b/i.test(text),
    knockout: /eliminazione diretta/i.test(source.kicker),
  };
};
