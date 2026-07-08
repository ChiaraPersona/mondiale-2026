const DEFAULT_HEADERS = {
  "accept": "text/html,application/json;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9,it;q=0.8",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
};

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    redirect: "follow"
  });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    url: response.url,
    headers: Object.fromEntries(response.headers.entries()),
    text
  };
}

async function fetchJson(url, options = {}) {
  const result = await fetchText(url, {
    headers: {
      "accept": "application/json,text/plain,*/*",
      ...(options.headers || {})
    }
  });

  try {
    return { ...result, json: JSON.parse(result.text) };
  } catch (error) {
    return { ...result, json: null, parseError: error.message };
  }
}

async function fetchRenderedHtml(url, options = {}) {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (error) {
    return {
      ok: false,
      status: null,
      url,
      html: null,
      error: "Playwright non installato. Installa playwright per abilitare il rendering JS."
    };
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ userAgent: DEFAULT_HEADERS["user-agent"] });
    await page.goto(url, { waitUntil: options.waitUntil || "networkidle", timeout: options.timeout || 45000 });
    return {
      ok: true,
      status: null,
      url: page.url(),
      html: await page.content()
    };
  } finally {
    await browser.close();
  }
}

module.exports = {
  fetchJson,
  fetchRenderedHtml,
  fetchText
};
