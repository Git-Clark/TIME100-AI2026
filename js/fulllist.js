// Full List page: renders key-stats tiles (people / countries / industries)
// above a collapsible section per category, each with its own accent color
// matching that category's original card background, and a 6-column table
// (thumbnail, Name, Title, Country, Industry, link to the TIME100 AI 2026
// article).
//
// Each stat tile shows a detail breakdown: on a device with a mouse
// (hover-capable), hovering the tile reveals an inline popover. On a
// touch device, tapping the tile opens a modal with the same content and
// an X close button.

(function () {
  const container = document.getElementById("listContainer");
  const statsContainer = document.getElementById("statsContainer");

  // CATEGORY_ORDER, CATEGORY_LABELS, and CATEGORY_COLORS are shared
  // globals defined in js/data.js (loaded before this file).

  // ---------- Key stats tiles ----------
  // Country and industry counts are derived live from PROFILES (one count
  // per profile card; a few cards represent 2-3 people, so these reflect
  // the 95 published cards rather than the 100 individual people).
  // Gender is not tracked per-profile in the data, so the split below is
  // the aggregate figure Clark supplied for the list as a whole (31
  // female / 69 male out of the 100 people on the list) rather than a
  // count derived from PROFILES.
  const GENDER_SPLIT = { female: 31, male: 69 };

  function countBy(key) {
    const counts = {};
    PROFILES.forEach(function (p) {
      const v = (p[key] || "").trim();
      if (!v) return;
      counts[v] = (counts[v] || 0) + 1;
    });
    return counts;
  }

  // Returns [[key, count], ...] sorted by count descending, ties broken
  // alphabetically so the order is stable.
  function sortedByCount(counts) {
    return Object.keys(counts)
      .map(function (k) { return [k, counts[k]]; })
      .sort(function (a, b) {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      });
  }

  function rowsHtml(pairs) {
    return pairs.map(function (pair) {
      return '<div class="stat-popover-row"><span>' + pair[0] + "</span><span>" + pair[1] + "</span></div>";
    }).join("");
  }

  const countryCounts = countBy("country");
  const industryCounts = countBy("industry");

  const tiles = [
    {
      value: "100",
      label: "People Featured",
      accent: CATEGORY_COLORS.leaders,
      title: "Gender Split",
      rows: rowsHtml([
        ["Female", GENDER_SPLIT.female + "%"],
        ["Male", GENDER_SPLIT.male + "%"],
      ]),
    },
    {
      value: String(Object.keys(countryCounts).length),
      label: "Countries Represented",
      accent: CATEGORY_COLORS.innovators,
      title: "Countries, Most to Fewest",
      rows: rowsHtml(sortedByCount(countryCounts)),
    },
    {
      value: String(Object.keys(industryCounts).length),
      label: "Industries Represented",
      accent: CATEGORY_COLORS.shapers,
      title: "Industries, Most to Fewest",
      rows: rowsHtml(sortedByCount(industryCounts)),
    },
  ];

  // Shared modal used for the mobile/touch tap-to-view popup.
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "stat-modal-overlay";
  modalOverlay.hidden = true;
  modalOverlay.innerHTML =
    '<div class="stat-modal-panel">' +
      '<div class="stat-modal-header">' +
        '<h3 id="statModalTitle"></h3>' +
        '<button class="stat-modal-close" type="button" aria-label="Close">&times;</button>' +
      "</div>" +
      '<div class="stat-modal-body" id="statModalBody"></div>' +
    "</div>";
  document.body.appendChild(modalOverlay);
  const modalTitle = modalOverlay.querySelector("#statModalTitle");
  const modalBody = modalOverlay.querySelector("#statModalBody");
  const modalClose = modalOverlay.querySelector(".stat-modal-close");

  function openModal(title, rowsHtmlStr) {
    modalTitle.textContent = title;
    modalBody.innerHTML = rowsHtmlStr;
    modalOverlay.hidden = false;
  }

  function closeModal() {
    modalOverlay.hidden = true;
  }

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  tiles.forEach(function (t) {
    const tile = document.createElement("div");
    tile.className = "stat-tile";
    tile.style.setProperty("--tile-accent", t.accent);
    tile.innerHTML =
      '<div class="stat-value">' + t.value + "</div>" +
      '<div class="stat-label">' + t.label + "</div>" +
      '<div class="stat-popover">' +
        '<div class="stat-popover-title">' + t.title + "</div>" +
        t.rows +
      "</div>";
    if (!canHover) {
      tile.addEventListener("click", function () {
        openModal(t.title, t.rows);
      });
    }
    statsContainer.appendChild(tile);
  });

  // ---------- Category tables ----------
  CATEGORY_ORDER.forEach(function (cat, index) {
    const people = PROFILES.filter(function (p) { return p.category === cat; })
      .slice()
      .sort(function (a, b) { return a.name.localeCompare(b.name); });

    if (people.length === 0) return;

    const details = document.createElement("details");
    details.className = "category-block";
    if (index === 0) details.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML =
      '<span class="category-badge">' +
        '<span class="category-accent" style="background:' + CATEGORY_COLORS[cat] + '"></span>' +
        '<span class="category-label">' + CATEGORY_LABELS[cat] + " (" + people.length + ")</span>" +
      "</span>" +
      '<span class="category-chevron">&#9656;</span>';
    details.appendChild(summary);

    const table = document.createElement("table");
    table.className = "people-table";
    table.innerHTML =
      '<thead><tr><th class="thumb-cell"></th><th class="name-col">Name</th><th class="title-col">Title</th>' +
      '<th class="country-col">Country of Origin</th>' +
      '<th class="industry-col">Industry</th><th class="link-col">TIME100 AI 2026 Article</th></tr></thead>';

    const tbody = document.createElement("tbody");
    people.forEach(function (p) {
      const tr = document.createElement("tr");
      const countryCell = p.country
        ? p.country
        : '<span class="industry-blank">&mdash;</span>';
      const industryCell = p.industry
        ? p.industry
        : '<span class="industry-blank">&mdash;</span>';
      const linkCell = p.time_article_url
        ? '<a class="article-link" href="' + p.time_article_url + '" target="_blank" rel="noopener">View profile &#8599;</a>'
        : '<span class="industry-blank">&mdash;</span>';
      tr.innerHTML =
        '<td class="thumb-cell"><img class="thumb" src="' + p.photo + '" alt=""></td>' +
        '<td class="name-col">' + p.name + "</td>" +
        '<td class="title-col">' + p.title + "</td>" +
        '<td class="country-col">' + countryCell + "</td>" +
        '<td class="industry-col">' + industryCell + "</td>" +
        '<td class="link-col">' + linkCell + "</td>";
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    details.appendChild(table);
    container.appendChild(details);
  });
})();
