# Elevate-Craft

The first static homepage for Elevate-Craft, intended as the starting point for the elevate-craft.com website. The site currently uses plain HTML, CSS, and JavaScript; there is no build step or package installation.

## Current Page

`index.html` is a single-page homepage with sections for the brand purpose, books, ventures, community, and contact information. The navigation currently links to sections on this page. As the site grows, these can become links to separate pages.

## Project Files

- `index.html` - page structure and content
- `style.css` - layout, visual styling, and responsive rules
- `script.js` - rotating hero call-to-action text
- `images/` - brand artwork, logos, and book covers used by the page

Keep the relative paths between the HTML, CSS, JavaScript, and `images/` folder intact when moving or uploading the site.

## Preview Locally

Open `index.html` in a browser. Google Fonts, the community photos from Unsplash, and the published books on Google Docs require an internet connection.

## Deploy to Cloudflare Pages

For a first deployment, create a Cloudflare Pages project and use Direct Upload. Upload the site files together, including `index.html`, `style.css`, `script.js`, and the complete `images/` folder. Do not upload only `index.html`; the page depends on those other files.

This is a plain static site, so it does not need a build command. After deployment, check the generated Pages URL and confirm that the page artwork, book covers, and venture logos load. Add `elevate-craft.com` as a custom domain in the Pages project settings when the domain is ready.

For future updates, deploy the changed site files again or connect a Git repository to Cloudflare Pages for automatic deployments.
