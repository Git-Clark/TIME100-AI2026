// "Choose a profile" popup. Lets a student pick any of the 95 profiles
// directly, in case they lose track of the one they were originally
// assigned (for example, an accidental page refresh). Only appears after
// the first spin. Uses no cookies or local storage: this only works
// within the current page load, and picking a profile from the grid
// applies it instantly, the same as a spin result.

(function () {
  const chooseButton = document.getElementById("chooseButton");
  const overlay = document.getElementById("chooserOverlay");
  const grid = document.getElementById("chooserGrid");
  const closeButton = document.getElementById("chooserClose");

  let built = false;

  function buildGrid() {
    if (built) return;
    built = true;

    CATEGORY_ORDER.forEach(function (cat) {
      const people = PROFILES.filter(function (p) { return p.category === cat; })
        .slice()
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (people.length === 0) return;

      const section = document.createElement("div");
      section.className = "chooser-section";

      const heading = document.createElement("div");
      heading.className = "chooser-section-heading";
      heading.innerHTML =
        '<span class="category-accent" style="background:' + CATEGORY_COLORS[cat] + '"></span>' +
        CATEGORY_LABELS[cat] + " (" + people.length + ")";
      section.appendChild(heading);

      const tiles = document.createElement("div");
      tiles.className = "chooser-tiles";
      people.forEach(function (p) {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "chooser-tile";
        tile.innerHTML = '<img src="' + p.photo + '" alt="">' + "<span>" + p.name + "</span>";
        tile.addEventListener("click", function () {
          window.applyProfile(p);
          closeModal();
        });
        tiles.appendChild(tile);
      });
      section.appendChild(tiles);

      grid.appendChild(section);
    });
  }

  function openModal() {
    buildGrid();
    overlay.hidden = false;
  }

  function closeModal() {
    overlay.hidden = true;
  }

  chooseButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
})();
