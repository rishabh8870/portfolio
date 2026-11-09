// ---- Edit these to match your own work ----
const projects = [
  {
    title: "Project One",
    description: "Short description of what it does and why it matters.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/YOUR_USERNAME/project-one",
  },
  {
    title: "Project Two",
    description: "Another project you're proud of.",
    tags: ["Python", "API"],
    link: "https://github.com/YOUR_USERNAME/project-two",
  },
];

const skills = ["HTML", "CSS", "JavaScript", "Python", "Git", "SQL"];

// ---- Render projects & skills ----
const grid = document.getElementById("project-grid");
projects.forEach((p) => {
  const card = document.createElement("a");
  card.className = "card";
  card.href = p.link;
  card.target = "_blank";
  card.rel = "noopener";

  const h3 = document.createElement("h3");
  h3.textContent = p.title;
  const desc = document.createElement("p");
  desc.textContent = p.description;
  const tags = document.createElement("div");
  tags.className = "tags";
  p.tags.forEach((t) => {
    const s = document.createElement("span");
    s.textContent = t;
    tags.appendChild(s);
  });

  card.append(h3, desc, tags);
  grid.appendChild(card);
});

const skillList = document.getElementById("skill-list");
skills.forEach((s) => {
  const li = document.createElement("li");
  li.textContent = s;
  skillList.appendChild(li);
});

// ---- Theme toggle (remembered across visits) ----
const root = document.documentElement;
const saved = localStorage.getItem("theme");
if (saved) root.dataset.theme = saved;
document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

// ---- Contact form: opens the visitor's email client ----
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get("message")}\n\nFrom: ${f.get("name")} (${f.get("email")})`;
  window.location.href =
    "mailto:rishabhtripathi8858@gmail.com?subject=" +
    encodeURIComponent("Portfolio contact from " + f.get("name")) +
    "&body=" + encodeURIComponent(body);
});

document.getElementById("year").textContent = new Date().getFullYear();
