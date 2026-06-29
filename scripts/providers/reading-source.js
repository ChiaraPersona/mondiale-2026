const fs = require("fs");

function text(html) {
  return String(html ?? "")
    .replace(/&middot;/gi, "·")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readPage(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const match = text(
    html.match(/class=["'][^"']*reading-versus[^"']*["'][\s\S]*?<b>([\s\S]*?)<\/b>/i)?.[1]
  );
  const teams = [...html.matchAll(
    /class=["'][^"']*reading-team[^"']*["'][\s\S]*?<strong>([\s\S]*?)<\/strong>/gi
  )].map(item => text(item[1])).slice(0, 2);
  const kicker = text(
    html.match(/class=["'][^"']*reading-kicker[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]
  );
  const sections = [...html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/gi)]
    .map(item => {
      const body = item[1];
      const title = text(body.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1]);
      const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(paragraph => text(paragraph[1]))
        .filter(Boolean);
      return { title, paragraphs };
    })
    .filter(section => section.title);
  return { match, teams, kicker, sections };
}

function section(source, expression) {
  return source.sections.find(item => expression.test(item.title)) || null;
}

function teamParagraph(sourceSection, team, fallback) {
  if (!sourceSection) return null;
  return sourceSection.paragraphs.find(value =>
    value.toLocaleLowerCase("it").includes(team.toLocaleLowerCase("it"))
  ) || sourceSection.paragraphs[fallback] || null;
}

module.exports = { readPage, section, teamParagraph, text };
