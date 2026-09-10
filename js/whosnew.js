// Who's New page: three tiers built from js/comparison.js (derived from
// Clark's content doc, Section 4). Text links only, no headshots.
//   - New for 2026: people on the 2026 list who weren't on 2025.
//   - Returning from 2025: on both lists -- shows both profile links.
//   - Left the list after 2025: on 2025 but not on 2026.
// Counting is done per person (100 people), not per profile card (95
// cards -- a few cards are shared by 2-3 people).

(function () {
  const container = document.getElementById("whosNewContainer");

  const profilesById = {};
  PROFILES.forEach(function (p) { profilesById[p.id] = p; });

  function linkButton(href, label) {
    if (!href) return "";
    return '<a class="wn-link" href="' + href + '" target="_blank" rel="noopener">' + label + " &#8599;</a>";
  }

  function card(entry) {
    const profile = entry.profile_id ? profilesById[entry.profile_id] : null;
    const links = [];

    if (entry.status === "new") {
      if (profile && profile.time_article_url) {
        links.push(linkButton(profile.time_article_url, "2026 Profile"));
      }
    } else if (entry.status === "returning") {
      links.push(linkButton(entry.url_2025, entry.url_2025_label || "2025 Profile"));
      if (profile && profile.time_article_url) {
        links.push(linkButton(profile.time_article_url, "2026 Profile"));
      }
    } else if (entry.status === "dropped") {
      links.push(linkButton(entry.url_2025, entry.url_2025_label || "2025 Profile"));
    }

    const noteHtml = entry.note ? '<p class="wn-card-note">' + entry.note + "</p>" : "";

    const div = document.createElement("div");
    div.className = "wn-card";
    div.innerHTML =
      '<p class="wn-card-name">' + entry.name + "</p>" +
      noteHtml +
      '<div class="wn-card-links">' + links.join("") + "</div>";
    return div;
  }

  function section(title, blurb, entries, accent) {
    const section = document.createElement("section");
    section.className = "wn-section";
    section.style.setProperty("--tile-accent", accent);

    const heading = document.createElement("h3");
    heading.className = "wn-section-heading";
    heading.textContent = title + " (" + entries.length + ")";
    section.appendChild(heading);

    if (blurb) {
      const p = document.createElement("p");
      p.className = "wn-section-blurb";
      p.textContent = blurb;
      section.appendChild(p);
    }

    const grid = document.createElement("div");
    grid.className = "wn-grid";
    entries
      .slice()
      .sort(function (a, b) { return a.name.localeCompare(b.name); })
      .forEach(function (entry) { grid.appendChild(card(entry)); });
    section.appendChild(grid);

    return section;
  }

  container.appendChild(section(
    "New for 2026",
    "On the 2026 list for the first time.",
    COMPARISON.new,
    CATEGORY_COLORS.innovators
  ));
  container.appendChild(section(
    "Returning From 2025",
    "On both the 2025 and 2026 lists.",
    COMPARISON.returning,
    CATEGORY_COLORS.leaders
  ));
  container.appendChild(section(
    "Left the List After 2025",
    "On the 2025 list, but not on 2026.",
    COMPARISON.dropped,
    CATEGORY_COLORS.thinkers
  ));
})();
