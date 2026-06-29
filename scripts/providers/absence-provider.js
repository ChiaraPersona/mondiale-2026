module.exports = function AbsenceProvider(source) {
  const evidence = source.sections.flatMap(item => item.paragraphs).filter(value =>
    /\b(assenz[ae]|assente|indisponibil[ei]|infortunat[oaie]|squalificat[oaie])\b/i.test(value)
  );
  const turnover = source.sections.flatMap(item => item.paragraphs).filter(value =>
    /\b(turnover|rotazion[ei])\b/i.test(value)
  );
  return { important: evidence, turnover };
};
