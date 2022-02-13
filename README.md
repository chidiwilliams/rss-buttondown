# rss-buttondown

Publishes recent posts from an RSS feed to Buttondown.

## Installation

```bash
npm i https://github.com/chidiwilliams/rss-buttondown
```

## Environment variables

- `RSS_URL`: URL of the RSS feed
- `BUTTONDOWN_API_KEY`: [Buttondown API](https://api.buttondown.email/v1/schema) key
- `MAX_RECENT_POST_AGE`: Time difference to get the latest posts (in seconds). A value of "2592000", for example, will publish all posts from the last 30 days.
