# TIME100 AI 2026 Warm-up Spinner

A one-time, in-class warm-up activity for JMSC6140. Students press Spin,
get a random profile from the TIME100 AI 2026 list, research 3 questions
about that person, then post their answer on Padlet.

This is a plain static site: HTML, CSS, and JavaScript only, no build step,
no server required. It is built from the 95 profile card screenshots you
uploaded (OCR'd for name/title, categorized by card background color:
green = Leaders, blue = Innovators, yellow/tan = Shapers, pale purple =
Thinkers), then filled in with the real Key Questions, Country, and
Industry data from your content doc, and cross-checked against TIME's own
2025 and 2026 list pages.

## Pages

- **Spinner** (`index.html`): press Spin for a random profile, see their
  3 Key Questions (real, category-specific), a link to their TIME100 AI
  2026 article, and whether they were on the 2025 list. A "Choose Profile"
  button lets a student who refreshed the page pick their original result
  back from a popup grouped by category, no cookies or local storage used.
- **Full List** (`full-list.html`): every profile in a collapsible section
  per category, with an intro line and 3 key-stats tiles above the table
  (People Featured, Countries Represented, Industries Represented).
  Hovering a tile (desktop) or tapping it (mobile, with an X to close)
  shows the underlying breakdown: gender split, the full country list, or
  the full industry list, both sorted most to fewest. Each row shows a
  thumbnail, Name, Title, Country of Origin, Industry, and a link to the
  person's 2026 article; the columns keep a fixed 1:1:1:2:2:3 width ratio
  (thumbnail/Country/Industry : Name/2026 link : Title).
- **Who's New** (`whos-new.html`): three tiers built from Section 4 of
  your content doc (New for 2026 / Returning From 2025 / Left the List
  After 2025). Each person is a small uniform card stacking their name,
  company/position, and profile link(s); 2 columns on mobile, a natural
  multi-column flow on desktop. Counting is done per person (100 people),
  not per profile card (95 cards -- a few cards are shared by 2-3 people).
  Returning people show both their 2025 and 2026 profile links.
- **About the List** (`about.html`): your own write-up on the list, plus
  links to TIME's official "how we chose" methodology article and the
  full 2026 collection.

## Known limitations and judgment calls

- A handful of cards profile more than one person together (Mark Chen /
  Sam Altman / Greg Brockman; Dario and Daniela Amodei; Azalia Mirhoseini
  and Anna Goldie; Pat Grady and Alfred Lin). This matches how TIME itself
  grouped them, so each still counts as one spin result. The OpenAI trio
  card has a mixed 2025 status (Sam Altman returning, the other two new),
  shown as a note instead of a plain yes/no on the Spinner page.
- While researching individual 2025 profile links, 14 of the 34 people
  your doc listed as "returning from 2025" or "dropped after 2025" turned
  out not to be on TIME's actual 2025 list when checked directly against
  it. Most of those were reclassified as new for 2026; Demis Hassabis and
  Andrej Karpathy were kept in "left the list" but link to their 2024
  profile instead, labeled as such, since that's the list they were
  actually on. This was confirmed with you before building the page.
- Full List key-stats tiles (countries, industries) are counted per
  profile card (95), not per person (100), since country and industry are
  recorded once per card. The gender split shown on the People Featured
  tile (31% female / 69% male) is the aggregate figure you supplied for
  the list as a whole; there's no per-person gender field in the data.
- Industry values are TIME's/your doc's own free-text labels (e.g. "AI/
  Research" vs. "AI" vs. "Technology" appear as separate values), not
  normalized into broader buckets.
- Headshots are JPEGs (converted from the original PNG screenshots to cut
  file size for faster loading -- same images, no visible quality loss).
  If you ever add a new headshot, save it as a .jpg to keep the page fast.
- The page background now fills the whole browser window (no bordered
  frame), with the content itself capped at a readable width and centered.
  This was changed from an earlier framed-box look that left large black
  bars on wide monitors.

## Running it locally

No installation needed. Just open `index.html` in a browser (double-click
it, or right-click > Open With). Every page loads the same profile data
from `js/data.js`, plus `js/comparison.js` on the Who's New page.

## Deploying to GitHub + Vercel

1. Create a new, empty repository on GitHub (no README/license, so it's
   truly empty).
2. From this folder, run:
   ```
   git init
   git add .
   git commit -m "TIME100 AI 2026 warm-up spinner"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. Go to vercel.com, "Add New Project," and import that GitHub repo.
   Vercel will detect it as a static site automatically, no build
   command or output directory needed, just click Deploy.
4. Vercel gives you a live URL. Any future `git push` to `main`
   redeploys it automatically.

## Editing the data later

All profile data lives in `js/data.js` as a plain JavaScript array. Each
entry looks like:

```js
{
  "id": "elon-musk",
  "name": "Elon Musk",
  "title": "CEO, SPACEX",
  "category": "leaders",
  "category_label": "Leaders",
  "photo": "images/headshots/elon-musk.jpg",
  "on_list_2025": true,
  "questions": [ ... ],
  "time_article_url": "https://time.com/collection/time100-ai/2026/elon-musk/",
  "industry": "Aerospace",
  "country": "USA"
}
```

A few profiles also carry an `on_list_2025_note` field (only the OpenAI
trio card right now) that overrides the plain yes/no display with an
explanatory sentence.

The Who's New page's three tiers come from `js/comparison.js`, a separate
list of `{ name, note, status, profile_id, url_2025, url_2025_label }`
entries built from Section 4 of your content doc. To move someone between
tiers, or fix a link, edit their entry there (`status` is `"new"`,
`"returning"`, or `"dropped"`; `profile_id` links back to their entry in
`js/data.js` for the 2026 link).
