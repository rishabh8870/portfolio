// Motion & interaction layer: clock, scroll effects, reveals, counters,
// terminal run, spotlight cards, magnetic buttons, copy-to-clipboard.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---- Live New Delhi clock ----
  const clock = $("#clock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false,
    });
    const tick = () => (clock.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 1000);
  }

  // ---- Scroll: header shadow, progress bar, active nav link ----
  const bar = $(".topbar");
  const links = $$(".main-nav a");
  const navFor = { education: "skills" };
  const sections = ["home", "about", "experience", "projects", "skills", "education", "contact"]
    .map((id) => $("#" + id))
    .filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    bar.classList.toggle("is-scrolled", y > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty("--p", max > 0 ? Math.min(y / max, 1) : 0);

    let current = sections[0].id;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
    }
    if (max > 0 && y >= max - 4) current = "contact";

    const target = navFor[current] || current;
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + target));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // ---- Count-up numbers ----
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end; return; }
    const dur = 1400, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ---- Terminal: lines "run" one by one ----
  const runTerminal = (term) => {
    $$(".term-body li", term).forEach((li, i) =>
      setTimeout(() => li.classList.add("on"), reduceMotion ? 0 : 500 + i * 450)
    );
  };

  // ---- Reveal on scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);

      if (el.matches("[data-terminal]")) { runTerminal(el); return; }

      el.classList.add("in");
      $$("[data-count]", el).forEach(countUp);

      // once the entrance has finished, drop the stagger delay so hovers feel instant
      const delay = parseFloat(el.style.getPropertyValue("--d")) || 0;
      setTimeout(() => el.classList.add("done"), (delay + 1) * 1000);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });

  $$(".sr, [data-terminal]").forEach((el) => io.observe(el));

  // ---- Copy email ----
  const copyBtn = $("#copy-email");
  const toast = $("#toast");
  if (copyBtn && toast) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        toast.textContent = "Email copied";
      } catch {
        toast.textContent = "Copy failed: " + copyBtn.dataset.email;
      }
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2200);
    });
  }

  if (reduceMotion) return;

  // ---- Spotlight follows the pointer on cards ----
  $$(".spot").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    });
  });

  // ---- Portrait parallax follows the pointer ----
  const art = $(".hero-art");
  if (art && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      art.style.setProperty("--px", `${x * 14}px`);
      art.style.setProperty("--py", `${y * 10}px`);
    });
    document.addEventListener("mouseleave", () => {
      art.style.setProperty("--px", "0px");
      art.style.setProperty("--py", "0px");
    });
  }

  // ---- Magnetic buttons ----
  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(e.clientX - (r.left + r.width / 2)) * 0.25}px`);
      el.style.setProperty("--my", `${(e.clientY - (r.top + r.height / 2)) * 0.35}px`);
    });
    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    });
  });
})();
