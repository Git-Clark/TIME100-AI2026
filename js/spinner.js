// Spinner page logic.
// Behavior: fully random every press (no memory of past picks), ~3 second
// slot-machine style spin before landing on the result.

(function () {
  const spinButton = document.getElementById("spinButton");
  const chooseButton = document.getElementById("chooseButton");
  const photoImg = document.getElementById("photoImg");
  const framePlaceholderImg = document.getElementById("framePlaceholderImg");
  const introBlock = document.getElementById("introBlock");
  const resultPanel = document.getElementById("resultPanel");
  const resultName = document.getElementById("resultName");
  const resultTitle = document.getElementById("resultTitle");
  const resultCategory = document.getElementById("resultCategory");
  const resultArticleLink = document.getElementById("resultArticleLink");
  const resultQuestions = document.getElementById("resultQuestions");
  const resultOnList = document.getElementById("resultOnList");

  const SPIN_DURATION_MS = 3000;
  const FLIP_INTERVAL_MS = 90;

  function randomProfile() {
    return PROFILES[Math.floor(Math.random() * PROFILES.length)];
  }

  function showFlash(profile) {
    photoImg.src = profile.photo;
    photoImg.style.display = "block";
    framePlaceholderImg.style.display = "none";
  }

  function renderResult(profile) {
    photoImg.src = profile.photo;
    photoImg.style.display = "block";
    framePlaceholderImg.style.display = "none";

    resultName.textContent = profile.name;
    resultTitle.textContent = profile.title;
    resultCategory.textContent = profile.category_label;

    if (profile.time_article_url) {
      resultArticleLink.href = profile.time_article_url;
      resultArticleLink.style.display = "inline-block";
    } else {
      resultArticleLink.style.display = "none";
    }

    resultQuestions.innerHTML = "";
    profile.questions.forEach(function (q) {
      const li = document.createElement("li");
      const isPlaceholder = q.indexOf("PLACEHOLDER") === 0;
      if (isPlaceholder) {
        li.innerHTML = '<span class="placeholder-flag">[placeholder question, to be replaced]</span> ' +
          q.replace(/^PLACEHOLDER:\s*/, "");
      } else {
        li.textContent = q;
      }
      resultQuestions.appendChild(li);
    });

    if (profile.on_list_2025_note) {
      resultOnList.textContent = "On the TIME100 AI list last year (2025)? " + profile.on_list_2025_note;
    } else if (profile.on_list_2025 === true) {
      resultOnList.textContent = "On the TIME100 AI list last year (2025)? Yes.";
    } else if (profile.on_list_2025 === false) {
      resultOnList.textContent = "On the TIME100 AI list last year (2025)? No, new for 2026.";
    } else {
      resultOnList.innerHTML = 'On the TIME100 AI list last year (2025)? <span class="placeholder-flag">Data pending.</span>';
    }

    introBlock.style.display = "none";
    resultPanel.classList.add("visible");
  }

  function spin() {
    spinButton.disabled = true;
    spinButton.textContent = "Spinning...";

    const flipTimer = setInterval(function () {
      showFlash(randomProfile());
    }, FLIP_INTERVAL_MS);

    setTimeout(function () {
      clearInterval(flipTimer);
      const finalProfile = randomProfile();
      renderResult(finalProfile);
      spinButton.disabled = false;
      spinButton.textContent = "Spin Again";
      chooseButton.hidden = false;
    }, SPIN_DURATION_MS);
  }

  spinButton.addEventListener("click", spin);

  // Exposed so the "choose a profile" popup (js/chooser.js) can set a
  // profile directly, exactly as if it had just been spun, without any
  // cookies or local storage involved.
  window.applyProfile = renderResult;
})();
