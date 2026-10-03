/* BuildWave — app logic
 * No framework, no build step. State persists in localStorage for the prototype.
 *
 * PRODUCTION SWAP: every read/write goes through `Store` below. Replace its four
 * methods with Supabase/Firestore calls and the rest of the app is unchanged —
 * that's the only file that knows where data lives.
 */
(function () {
  "use strict";

  var D = window.BW;
  var KEY = "buildwave.v1";

  /* ---------------- Store (the one place data lives) ---------------- */
  var Store = {
    _state: null,
    load: function () {
      if (this._state) return this._state;
      var fresh = {
        seatsExtra: 0, // real signups on top of the seed
        leaders: D.SEED_LEADERS.map(function (l) { return Object.assign({}, l); }),
        me: null, // { name, college, code, invites, seat }
        referralRegs: 0, // total registrations attributed to a referral link
      };
      try {
        var raw = localStorage.getItem(KEY);
        this._state = raw ? JSON.parse(raw) : fresh;
      } catch (e) {
        this._state = fresh;
      }
      return this._state;
    },
    save: function () {
      try { localStorage.setItem(KEY, JSON.stringify(this._state)); } catch (e) {}
    },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      this._state = null;
      this.load();
    },
    get: function () { return this.load(); },
  };

  /* ---------------- helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function seatsTaken() { return D.SEATS_SEED + Store.get().seatsExtra; }
  function seatsLeft() { return Math.max(0, D.SEATS_TOTAL - seatsTaken()); }

  function makeCode(name) {
    var base = (name || "builder").replace(/[^a-z]/gi, "").slice(0, 4).toUpperCase() || "BLDR";
    return base + Math.floor(1000 + Math.random() * 9000);
  }

  function refLinkFor(code) {
    var url = location.origin + location.pathname;
    return url + "?ref=" + encodeURIComponent(code);
  }

  /* ---------------- idea generator (hero) ---------------- */
  function buildChips() {
    var box = $("#chips");
    var sel = $("#fBuild");
    D.PROJECTS.forEach(function (p, i) {
      var b = document.createElement("button");
      b.className = "chip";
      b.type = "button";
      b.textContent = p.label;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        $all(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        showProject(p);
      });
      box.appendChild(b);

      var opt = document.createElement("option");
      opt.value = p.key;
      opt.textContent = p.label + " — " + p.build;
      sel.appendChild(opt);
    });
    showProject(D.PROJECTS[0]);
  }

  function showProject(p) {
    $("#projText").textContent = p.build.charAt(0).toUpperCase() + p.build.slice(1) + ".";
    $("#stackText").innerHTML = "You'll use <span>" + p.stack + "</span>";
  }

  /* ---------------- seats + countdown ---------------- */
  function renderSeats() {
    var taken = seatsTaken();
    var left = seatsLeft();
    $("#seatsTotal").textContent = D.SEATS_TOTAL;
    $("#seatsLeft").textContent = left;
    $("#pillSeats").textContent = left;
    // animated count-up (the one orchestrated page-load motion)
    animateNumber($("#seatsTaken"), 0, taken, 1100);
    requestAnimationFrame(function () {
      $("#seatsFill").style.width = (taken / D.SEATS_TOTAL) * 100 + "%";
    });
  }

  function animateNumber(el, from, to, ms) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = to; return;
    }
    var start = performance.now();
    function tick(now) {
      var t = Math.min(1, (now - start) / ms);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderCountdown() {
    var target = D.workshopDate().getTime();
    var box = $("#countdown");
    function paint() {
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var cells = [["Days", d], ["Hrs", h], ["Min", m], ["Sec", s]];
      box.innerHTML = cells.map(function (c) {
        return '<div class="count__cell"><b>' + String(c[1]).padStart(2, "0") + "</b><span>" + c[0] + "</span></div>";
      }).join("");
    }
    paint();
    setInterval(paint, 1000);
  }

  /* ---------------- leaderboard ---------------- */
  function renderBoard() {
    var s = Store.get();
    var rows = s.leaders.slice();
    if (s.me) {
      // show "me" merged into the ranking
      var exists = rows.some(function (r) { return r.me; });
      if (!exists) rows.push({ name: s.me.name + " (you)", college: s.me.college, invites: s.me.invites, me: true });
    }
    rows.sort(function (a, b) { return b.invites - a.invites; });
    var top = rows.slice(0, 10);
    $("#board").innerHTML = top.map(function (r, i) {
      var cls = "board__row" + (i === 0 ? " top" : "") + (r.me ? " is-me" : "");
      var badge = i < 3 ? '<span class="badge">Verified Builder</span>' : "";
      return (
        '<div class="' + cls + '">' +
        '<div class="board__rank">#' + (i + 1) + "</div>" +
        '<div class="board__who"><b>' + escapeHtml(r.name) + "</b>" + badge + "<span>" + escapeHtml(r.college || "") + "</span></div>" +
        '<div class="board__inv">' + r.invites + ' <small>invites</small></div>' +
        "</div>"
      );
    }).join("");

    // update "my rank" line if present in the modal
    if (s.me) {
      var myRank = top.findIndex(function (r) { return r.me; });
      var line = $("#refRankLine");
      if (line) line.textContent = myRank >= 0 ? "ranked #" + (myRank + 1) : "on the board";
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- modal + registration ---------------- */
  var modal = $("#modal");

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    var s = Store.get();
    // returning registrant lands straight on their referral screen
    if (s.me) { showRefStep(); } else { showFormStep(); $("#fName").focus(); }
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  function showFormStep() { $("#formStep").style.display = ""; $("#refStep").style.display = "none"; }
  function showRefStep() {
    $("#formStep").style.display = "none";
    $("#refStep").style.display = "";
    var s = Store.get();
    $("#refName").textContent = s.me.name.split(" ")[0];
    $("#refSeat").textContent = s.me.seat;
    var link = refLinkFor(s.me.code);
    $("#refLink").value = link;
    $("#waBtn").href = "https://wa.me/?text=" + encodeURIComponent(D.shareText(s.me.name, link));
    renderUnlock();
    renderBoard();
  }

  function renderUnlock() {
    var s = Store.get();
    var inv = s.me ? s.me.invites : 0;
    var pct = Math.min(100, (inv / D.UNLOCK_AT) * 100);
    $("#unlockFill").style.width = pct + "%";
    var done = inv >= D.UNLOCK_AT;
    $("#unlock").classList.toggle("is-done", done);
    $("#unlockTitle").textContent = done
      ? "Kit unlocked 🎉 — you're in the priority batch"
      : inv + " of " + D.UNLOCK_AT + " friends joined — kit locked";
  }

  function validate(data) {
    var errs = {};
    if (!data.name || data.name.trim().length < 2) errs.name = "Tell us your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || "")) errs.email = "That email doesn't look right.";
    if (!data.college || data.college.trim().length < 2) errs.college = "Which college?";
    return errs;
  }

  function register(data) {
    var s = Store.get();
    s.seatsExtra += 1;
    var seat = seatsTaken();
    s.me = { name: data.name.trim(), college: data.college.trim(), email: data.email.trim(), code: makeCode(data.name), invites: 0, seat: seat };

    // credit a referrer if this visit came from someone's link
    var ref = new URLSearchParams(location.search).get("ref");
    if (ref) {
      s.referralRegs += 1;
      var leader = s.leaders.find(function (l) { return l.code === ref; });
      if (leader) { leader.invites += 1; }
      else {
        // referrer wasn't seeded — add them so the chain is visible
        s.leaders.push({ name: "Builder " + ref, college: "", invites: 1, code: ref });
      }
    }
    Store.save();
    renderSeats();
    renderBoard();
    renderTracker();
    confettiBurst();
    showRefStep();
  }

  /* ---------------- tracker (organizer view) ---------------- */
  function renderTracker() {
    var s = Store.get();
    var regs = seatsTaken();
    var referred = s.referralRegs;
    var totalInvites = s.leaders.reduce(function (a, l) { return a + l.invites; }, 0) + (s.me ? s.me.invites : 0);
    var builders = s.leaders.length + (s.me ? 1 : 0);
    var k = builders ? (totalInvites / builders) : 0;
    var referredPct = regs ? Math.round((referred / (regs - D.SEATS_SEED || 1)) * 100) : 0;
    referredPct = Math.max(0, Math.min(100, referredPct));

    $("#stRegs").textContent = regs;
    $("#stReferred").textContent = (isFinite(referredPct) ? referredPct : 0) + "%";
    $("#stK").textContent = k.toFixed(1);
    $("#stCost").textContent = "₹" + (regs ? Math.round(2000 / regs) : 0);

    // illustrative funnel split toward the 500 target
    var seed = 60;
    var r1 = Math.round((regs - seed) * 0.62);
    var r2 = Math.round((regs - seed) * 0.38);
    r1 = Math.max(0, r1); r2 = Math.max(0, r2);
    var max = Math.max(seed, r1, r2, 1);
    $("#fSeed").style.width = (seed / max) * 100 + "%"; $("#fSeedV").textContent = seed;
    $("#fR1").style.width = (r1 / max) * 100 + "%"; $("#fR1V").textContent = r1;
    $("#fR2").style.width = (r2 / max) * 100 + "%"; $("#fR2V").textContent = r2;
  }

  function simulateReferrals(n) {
    var s = Store.get();
    for (var i = 0; i < n; i++) {
      s.seatsExtra += 1;
      s.referralRegs += 1;
      // attribute to "me" if registered, else to a random seeded leader
      if (s.me) { s.me.invites += 1; }
      else { s.leaders[Math.floor(Math.random() * s.leaders.length)].invites += 1; }
    }
    Store.save();
    renderSeats(); renderBoard(); renderTracker();
    if (s.me) renderUnlock();
  }

  /* ---------------- confetti ---------------- */
  function confettiBurst() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = $("#confetti");
    var colors = ["#4a3aff", "#7a6bff", "#ff4d4d", "#f4b740", "#10b981"];
    for (var i = 0; i < 80; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      var dur = 1.4 + Math.random() * 1.2;
      p.animate(
        [
          { transform: "translateY(0) rotate(0)", opacity: 1 },
          { transform: "translateY(100vh) rotate(" + (360 + Math.random() * 360) + "deg)", opacity: 0.9 },
        ],
        { duration: dur * 1000, easing: "cubic-bezier(.3,.6,.4,1)", delay: Math.random() * 250 }
      );
      box.appendChild(p);
      setTimeout((function (el) { return function () { el.remove(); }; })(p), (dur + 0.4) * 1000);
    }
  }

  /* ---------------- wiring ---------------- */
  function wire() {
    $all("[data-open-register]").forEach(function (b) { b.addEventListener("click", openModal); });
    $all("[data-close]").forEach(function (b) { b.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    $("#regForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      var data = { name: fd.get("name"), email: fd.get("email"), college: fd.get("college"), build: fd.get("build") };
      $all("[data-err]").forEach(function (el) { el.textContent = ""; });
      var errs = validate(data);
      if (Object.keys(errs).length) {
        Object.keys(errs).forEach(function (k) { var el = $('[data-err="' + k + '"]'); if (el) el.textContent = errs[k]; });
        return;
      }
      register(data);
    });

    $("#copyBtn").addEventListener("click", function () {
      var input = $("#refLink");
      input.select();
      try { navigator.clipboard.writeText(input.value); } catch (e) { document.execCommand("copy"); }
      this.textContent = "Copied";
      var self = this;
      setTimeout(function () { self.textContent = "Copy"; }, 1600);
    });

    // tracker tabs
    $all(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        $all(".tab").forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        var v = t.getAttribute("data-view");
        $("#view-student").classList.toggle("active", v === "student");
        $("#view-organizer").classList.toggle("active", v === "organizer");
      });
    });

    $("#simBtn").addEventListener("click", function () { simulateReferrals(5); });
    $("#resetBtn").addEventListener("click", function () {
      Store.reset();
      renderSeats(); renderBoard(); renderTracker(); showFormStep();
    });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildChips();
    renderSeats();
    renderCountdown();
    renderBoard();
    renderTracker();
    wire();

    // if arriving on a referral link, nudge toward registering
    if (new URLSearchParams(location.search).get("ref")) {
      var k = $(".kicker");
      if (k) k.innerHTML = '<span class="livedot"></span> A friend saved you a seat · register free';
    }
  });
})();
