const fetch = require('node-fetch');
const Parser = require('rss-parser');
const TurndownService = require('turndown');
const dotenv = require('dotenv');

dotenv.config();

var turndownService = new TurndownService();

const parser = new Parser();
const now = new Date();

const rssURL = process.env.RSS_URL;
const buttondownApiKey = process.env.BUTTONDOWN_API_KEY;
const maxRecentPostAge = Number(process.env.MAX_RECENT_POST_AGE) * 1000;

async function sendDrafts() {
  const feed = await getFeed(rssURL);

  // Remove posts older that minLastPostDiff
  const recentItems = feed.items.filter(
    (item) => now.getTime() - new Date(item.pubDate).getTime() < maxRecentPostAge,
  );

  const subject = 'Recent posts: ' + recentItems.map((item) => item.title).join(', ');
  const body = recentItems
    // Convert HTML back to Markdown, Buttondown doesn't play well with raw HTML
    .map((item) => ({ item, content: turndownService.turndown(item.content) }))
    // Add title block for each post
    .map(({ item, content }) => `## [${item.title}](${item.link})\n\n${content}`)
    // Add HR separator between posts
    .join('\n\n---\n\n');

  // writeFileSync('output.md', body);
  return sendDraft(subject, body).then((response) => {
    if (response.status !== 201) {
      return response.text().then((text) =>
        Promise.reject({
          status: response.status,
          body: text,
        }),
      );
    }
  });
}

function getFeed(url) {
  return parser.parseURL(url);
}

function sendDraft(subject, body) {
  return fetch('https://api.buttondown.email/v1/drafts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${buttondownApiKey}`,
    },
    body: JSON.stringify({ subject: subject, body: body }),
  });
}

sendDrafts().catch((error) => {
  console.error(error);
  process.exit(1);
});
