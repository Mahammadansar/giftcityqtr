/**
 * Gift City Qatar — site configuration
 * ------------------------------------
 * Edit this object to update contact details across the page.
 *
 * Taken from the business card:
 *   +974 5555 1387   WhatsApp
 *   +974 6633 4429
 *   +974 3371 8277
 *   +974 5032 8433
 *   Email   info@giftcityqatar.com
 *   Address Building No. 541, Ground Floor, Office No. 7,
 *           Old Murrah, opposite Safari Hypermarket, Salwa Road, Doha
 *
 * Instagram was not printed on the card.
 * PLACEHOLDER: replace instagramUrl with the official profile when confirmed.
 */
const SITE = {
  phones: [
    { display: "+974 5555 1387", tel: "+97455551387" },
    { display: "+974 6633 4429", tel: "+97466334429" },
    { display: "+974 3371 8277", tel: "+97433718277" },
    { display: "+974 5032 8433", tel: "+97450328433" },
  ],
  whatsappNumber: "97455551387",
  whatsappMessage:
    "Hello Gift City, I would like to enquire about your printing and advertising materials.",
  email: "info@giftcityqatar.com",
  instagramUrl: "https://www.instagram.com/",
  instagramLabel: "Instagram",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Gift+City+Building+No.+541+Ground+Floor+Office+No.+7+Old+Murrah+opposite+Safari+Hypermarket+Salwa+Road+Doha+Qatar",
  addressHtml:
    "Building No. 541, Ground Floor, Office No. 7<br>Old Murrah, opposite Safari Hypermarket<br>Salwa Road, Doha, Qatar",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const whatsappHref = () =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

function applyContactDetails() {
  const map = {
    email: { href: `mailto:${SITE.email}`, text: SITE.email },
    whatsapp: { href: whatsappHref(), text: "WhatsApp" },
    instagram: { href: SITE.instagramUrl, text: SITE.instagramLabel },
    maps: { href: SITE.mapsUrl, text: "Google Maps" },
  };

  document.querySelectorAll("[data-contact]").forEach((node) => {
    const key = node.getAttribute("data-contact");
    const data = map[key];
    if (!data) return;

    if (node.tagName === "A") {
      node.href = data.href;
      if (key === "whatsapp" || key === "instagram" || key === "maps") {
        node.target = "_blank";
        node.rel = "noopener noreferrer";
      }
    }

    const label = node.querySelector("[data-contact-label]");
    if (label) {
      label.textContent = data.text;
    } else if (node.hasAttribute("data-fill")) {
      node.textContent = data.text;
    }
  });

  const address = document.querySelector("[data-address]");
  if (address) address.innerHTML = SITE.addressHtml;

  const phones = document.querySelector("[data-phones]");
  if (phones) {
    phones.replaceChildren(
      ...SITE.phones.map((item) => {
        const link = document.createElement("a");
        link.className = "footer-link";
        link.href = `tel:${item.tel}`;
        link.textContent = item.display;
        return link;
      })
    );
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initHeader() {
  const header = document.querySelector("[data-header]");
  const toTop = document.querySelector("[data-to-top]");
  if (!header) return;

  const whatsapp = document.querySelector(".wa-float");
  const hero = document.querySelector(".hero");

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", header.hasAttribute("data-solid") || y > 28);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
    if (whatsapp) {
      const threshold = hero ? hero.offsetHeight * 0.72 : 480;
      whatsapp.classList.toggle("is-visible", y > threshold);
    }
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    if ("inert" in panel) panel.inert = !open;
    document.body.classList.toggle("nav-open", open);
  };

  setOpen(false);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
    if (open) {
      const first = panel.querySelector("a");
      if (first) first.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

function initSmoothScroll() {
  const header = document.querySelector("[data-header]");

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const offset = header ? header.offsetHeight - 1 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  });
}

function initScrollSpy() {
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links
    .map((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return null;
      return document.querySelector(href);
    })
    .filter((section, index, list) => section && list.indexOf(section) === index);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActive(current.target.id);
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: [0.1, 0.25, 0.5],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

applyContactDetails();
initHeader();
initNavigation();
initSmoothScroll();
initScrollSpy();
initReveal();
