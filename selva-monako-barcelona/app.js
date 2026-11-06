// Drobne udogodnienia: wielkość liter, najtańszy termin, powiększanie mapy, przycisk "do góry".
(function () {
  "use strict";

  // ---------- Wielkość liter ----------
  var SIZES = { normal: "112.5%", big: "128%", huge: "145%" };
  var KEY = "wycieczki-wielkosc-liter";

  function setSize(name) {
    if (!SIZES[name]) name = "normal";
    document.documentElement.style.fontSize = SIZES[name];
    var btns = document.querySelectorAll("[data-size]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-size") === name ? "true" : "false");
    }
    try { localStorage.setItem(KEY, name); } catch (e) { /* bez zapamiętywania */ }
  }

  var saved = "normal";
  try { saved = localStorage.getItem(KEY) || "normal"; } catch (e) {}
  setSize(saved);

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-size]");
    if (b) setSize(b.getAttribute("data-size"));
  });

  // ---------- Ceny: suma za 2 osoby + najtańszy termin ----------
  function zl(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " zł";
  }

  var terms = document.querySelectorAll(".term[data-price]");
  var best = null;
  for (var i = 0; i < terms.length; i++) {
    var t = terms[i];
    var price = parseInt(t.getAttribute("data-price"), 10);
    var tot = t.querySelector(".tot");
    if (tot) tot.textContent = "Za 2 osoby razem: ok. " + zl(price * 2);
    if (!best || price < parseInt(best.getAttribute("data-price"), 10)) best = t;
  }
  if (best) {
    best.classList.add("best");
    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Najtaniej";
    best.appendChild(badge);
    var out = document.querySelectorAll("[data-cheapest]");
    for (var j = 0; j < out.length; j++) {
      out[j].textContent = zl(parseInt(best.getAttribute("data-price"), 10));
    }
    var outDates = document.querySelectorAll("[data-cheapest-dates]");
    for (var k = 0; k < outDates.length; k++) {
      outDates[k].textContent = best.querySelector(".dates").textContent;
    }
  }

  // ---------- Powiększanie mapy ----------
  var lb = document.getElementById("lightbox");
  var lbImg = lb ? lb.querySelector("img") : null;
  document.addEventListener("click", function (ev) {
    var opener = ev.target.closest("[data-zoom]");
    if (opener && lb) {
      lbImg.src = opener.getAttribute("data-zoom");
      lbImg.alt = opener.getAttribute("data-alt") || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lb.scrollLeft = (lbImg.scrollWidth - lb.clientWidth) / 4;
      return;
    }
    if (ev.target.closest("[data-close]") && lb) {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && lb && lb.classList.contains("open")) {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  // ---------- Przycisk "do góry" ----------
  var top = document.getElementById("top");
  if (top) {
    window.addEventListener("scroll", function () {
      top.classList.toggle("show", window.scrollY > 900);
    }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo(0, 0); });
  }
})();
