const SITE_CONFIG = {
  businessName: "Doce Café",
  whatsappNumber: "",
  currency: "BRL",
  locale: "pt-BR",
  carouselInterval: 3500,
  cartStorageKey: "doce-cafe-cart",
};

const PRODUCTS = Array.isArray(window.CONFEITARIA_PRODUCTS)
  ? window.CONFEITARIA_PRODUCTS
  : [];

const state = {
  currentSlide: 0,
  carouselTimer: null,
  carouselVisible: true,
  activeCategory: "todos",
  searchTerm: "",
  cart: loadCart(),
};

const elements = {
  header: document.querySelector(".site-header"),
  menuButton: document.querySelector(".mobile-menu-button"),
  mobileNav: document.querySelector(".mobile-nav"),
  slides: [...document.querySelectorAll("[data-slide]")],
  dots: [...document.querySelectorAll("[data-slide-to]")],
  productsGrid: document.querySelector("[data-store-products]"),
  resultsText: document.querySelector("[data-results-text]"),
  searchInput: document.querySelector("[data-product-search]"),
  cartDrawer: document.querySelector("[data-cart-drawer]"),
  cartBackdrop: document.querySelector("[data-cart-backdrop]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartTotal: document.querySelector("[data-cart-total]"),
  checkoutButton: document.querySelector("[data-checkout]"),
  toast: document.querySelector("[data-toast]"),
};

initialize();

function initialize() {
  applyBusinessConfiguration();
  initializeHeader();
  initializeMobileMenu();
  initializeCarousel();
  initializeWhatsAppLinks();
  initializeStore();
  initializeCart();
  initializeRevealAnimations();
  renderCart();
}

function applyBusinessConfiguration() {
  document.querySelectorAll("[data-business-name]").forEach((element) => {
    element.textContent = SITE_CONFIG.businessName;
  });

  const pageTitle = document.body.classList.contains("shop-page")
    ? `Peça online | ${SITE_CONFIG.businessName}`
    : `${SITE_CONFIG.businessName} | Feito com carinho`;
  document.title = pageTitle;
}

function initializeHeader() {
  let framePending = false;

  const updateHeader = () => {
    elements.header?.classList.toggle("is-scrolled", window.scrollY > 24);
    framePending = false;
  };

  const requestHeaderUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
}

function initializeMobileMenu() {
  if (!elements.menuButton || !elements.mobileNav || !elements.header) return;

  elements.menuButton.addEventListener("click", () => {
    const isOpen = elements.menuButton.getAttribute("aria-expanded") === "true";
    setMobileMenu(!isOpen);
  });

  elements.mobileNav.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", () => setMobileMenu(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMobileMenu(false);
  });
}

function setMobileMenu(open) {
  elements.menuButton?.setAttribute("aria-expanded", String(open));
  elements.menuButton?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  elements.mobileNav?.classList.toggle("is-open", open);
  elements.header?.classList.toggle("menu-open", open);
}

function initializeCarousel() {
  if (elements.slides.length < 2) return;

  document.querySelector("[data-prev-slide]")?.addEventListener("click", () => {
    showSlide(state.currentSlide - 1);
    restartCarousel();
  });

  document.querySelector("[data-next-slide]")?.addEventListener("click", () => {
    showSlide(state.currentSlide + 1);
    restartCarousel();
  });

  elements.dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideTo));
      restartCarousel();
    });
  });

  const hero = document.querySelector(".hero");
  hero?.addEventListener("mouseenter", stopCarousel);
  hero?.addEventListener("mouseleave", startCarousel);
  hero?.addEventListener("focusin", stopCarousel);
  hero?.addEventListener("focusout", startCarousel);

  let touchStartX = 0;
  hero?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });
  hero?.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) > 50) {
      showSlide(state.currentSlide + (distance < 0 ? 1 : -1));
      restartCarousel();
    }
  }, { passive: true });

  if (hero && "IntersectionObserver" in window) {
    const carouselObserver = new IntersectionObserver((entries) => {
      state.carouselVisible = entries[0]?.isIntersecting ?? true;
      state.carouselVisible ? startCarousel() : stopCarousel();
    }, { threshold: 0.05 });

    carouselObserver.observe(hero);
  }

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopCarousel() : startCarousel();
  });

  startCarousel();
}

function showSlide(index) {
  const total = elements.slides.length;
  if (!total || !Number.isFinite(index)) return;
  state.currentSlide = (index + total) % total;

  elements.slides.forEach((slide, slideIndex) => {
    const active = slideIndex === state.currentSlide;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });

  elements.dots.forEach((dot, dotIndex) => {
    const active = dotIndex === state.currentSlide;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-selected", String(active));
  });
}

function startCarousel() {
  stopCarousel();
  if (document.hidden || !state.carouselVisible) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  state.carouselTimer = window.setInterval(() => {
    showSlide(state.currentSlide + 1);
  }, SITE_CONFIG.carouselInterval);
}

function stopCarousel() {
  if (!state.carouselTimer) return;
  window.clearInterval(state.carouselTimer);
  state.carouselTimer = null;
}

function restartCarousel() {
  startCarousel();
}

function initializeWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const message = link.dataset.message || "Olá! Gostaria de fazer um pedido.";
      openWhatsApp(message);
    });
  });
}

function openWhatsApp(message) {
  const number = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
  const baseUrl = number ? `https://wa.me/${number}` : "https://wa.me/";
  window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function initializeStore() {
  if (!elements.productsGrid) return;

  const categoryFromUrl = new URLSearchParams(window.location.search).get("categoria");
  const validCategories = new Set(["bolos", "doces", "paes", "salgados", "kits"]);
  if (categoryFromUrl && validCategories.has(categoryFromUrl)) {
    state.activeCategory = categoryFromUrl;
  }

  document.querySelectorAll("[data-category-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.categoryFilter || "todos";
      updateFilterButtons();
      renderStoreProducts();
    });
  });

  elements.searchInput?.addEventListener("input", () => {
    state.searchTerm = elements.searchInput.value.trim().toLocaleLowerCase("pt-BR");
    renderStoreProducts();
  });

  updateFilterButtons();
  renderStoreProducts();
}

function updateFilterButtons() {
  document.querySelectorAll("[data-category-filter]").forEach((button) => {
    const active = button.dataset.categoryFilter === state.activeCategory;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderStoreProducts() {
  if (!elements.productsGrid) return;

  const filteredProducts = PRODUCTS.filter((product) => {
    const categoryMatches = state.activeCategory === "todos" || product.category === state.activeCategory;
    const searchableText = `${product.name} ${product.description} ${product.categoryLabel}`.toLocaleLowerCase("pt-BR");
    const searchMatches = !state.searchTerm || searchableText.includes(state.searchTerm);
    return categoryMatches && searchMatches;
  });

  if (elements.resultsText) {
    elements.resultsText.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
  }

  if (!filteredProducts.length) {
    elements.productsGrid.innerHTML = `
      <div class="no-results">
        <span>🍰</span>
        <h2>Nenhum produto encontrado</h2>
        <p>Tente escolher outra categoria ou pesquisar com outro termo.</p>
      </div>`;
    return;
  }

  elements.productsGrid.innerHTML = filteredProducts.map((product) => `
    <article class="store-product-card" data-store-product="${escapeHtml(product.id)}">
      <div class="store-product-image">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" width="1200" height="900">
        <span>${escapeHtml(product.badge)}</span>
      </div>
      <div class="store-product-content">
        <p class="store-product-category">${escapeHtml(product.categoryLabel)}</p>
        <h2>${escapeHtml(product.name)}</h2>
        <p class="store-product-description">${escapeHtml(product.description)}</p>
        <div class="store-product-bottom">
          <div class="store-product-price">
            <strong>${formatCurrency(product.price)}</strong>
            <span>por ${escapeHtml(product.unit)}</span>
          </div>
          <div class="store-product-actions">
            <div class="card-quantity" aria-label="Quantidade de ${escapeHtml(product.name)}">
              <button type="button" data-card-decrease aria-label="Diminuir quantidade">−</button>
              <span data-card-quantity>1</span>
              <button type="button" data-card-increase aria-label="Aumentar quantidade">+</button>
            </div>
            <button class="add-product-button" type="button" data-add-product="${escapeHtml(product.id)}">Adicionar</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  bindStoreProductActions();
}

function bindStoreProductActions() {
  elements.productsGrid?.querySelectorAll("[data-store-product]").forEach((card) => {
    const quantityElement = card.querySelector("[data-card-quantity]");
    let quantity = 1;

    const renderQuantity = () => {
      if (quantityElement) quantityElement.textContent = String(quantity);
    };

    card.querySelector("[data-card-decrease]")?.addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1);
      renderQuantity();
    });

    card.querySelector("[data-card-increase]")?.addEventListener("click", () => {
      quantity = Math.min(99, quantity + 1);
      renderQuantity();
    });

    card.querySelector("[data-add-product]")?.addEventListener("click", (event) => {
      const product = PRODUCTS.find((item) => item.id === event.currentTarget.dataset.addProduct);
      if (!product) return;
      addToCart(product, quantity);
      quantity = 1;
      renderQuantity();
    });
  });
}

function initializeCart() {
  document.querySelectorAll("[data-open-cart]").forEach((button) => {
    button.addEventListener("click", openCart);
  });

  document.querySelector("[data-close-cart]")?.addEventListener("click", closeCart);
  elements.cartBackdrop?.addEventListener("click", closeCart);
  document.querySelector("[data-clear-cart]")?.addEventListener("click", clearCart);
  elements.checkoutButton?.addEventListener("click", checkoutCart);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.cartDrawer?.classList.contains("is-open")) {
      closeCart();
    }
  });
}

function openCart() {
  setMobileMenu(false);
  elements.cartDrawer?.classList.add("is-open");
  elements.cartDrawer?.setAttribute("aria-hidden", "false");
  elements.cartBackdrop?.classList.add("is-visible");
  document.body.classList.add("cart-open");
  document.querySelector("[data-close-cart]")?.focus();
}

function closeCart() {
  elements.cartDrawer?.classList.remove("is-open");
  elements.cartDrawer?.setAttribute("aria-hidden", "true");
  elements.cartBackdrop?.classList.remove("is-visible");
  document.body.classList.remove("cart-open");
}

function addToCart(product, quantity = 1) {
  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const existingItem = state.cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += safeQuantity;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      unit: product.unit || "unidade",
      image: product.image || "",
      quantity: safeQuantity,
    });
  }

  persistCart();
  renderCart();
  showToast(`${safeQuantity}x ${product.name} adicionado ao carrinho.`);
}

function updateQuantity(productId, change) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== productId);
  }

  persistCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  persistCart();
  renderCart();
}

function clearCart() {
  if (!state.cart.length) return;
  state.cart = [];
  persistCart();
  renderCart();
  showToast("Carrinho esvaziado.");
}

function renderCart() {
  const quantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.querySelectorAll("[data-cart-count]").forEach((counter) => {
    counter.textContent = String(quantity);
  });

  if (elements.cartTotal) elements.cartTotal.textContent = formatCurrency(total);
  if (elements.checkoutButton) elements.checkoutButton.disabled = !state.cart.length;
  if (!elements.cartItems) return;

  if (!state.cart.length) {
    elements.cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🧁</span>
        <strong>Seu carrinho está vazio</strong>
        <p>Acesse “Peça online” para escolher produtos e quantidades.</p>
        <a href="../loja.html" class="empty-cart-link">Ver produtos</a>
      </div>`;
    return;
  }

  elements.cartItems.innerHTML = state.cart.map((item) => `
    <article class="cart-item" data-cart-item="${escapeHtml(item.id)}">
      <img class="cart-item-image" src="${escapeHtml(item.image || "assets/logo-doce-cafe.png")}" alt="" loading="lazy" decoding="async">
      <div class="cart-item-content">
        <p class="cart-item-name">${escapeHtml(item.name)}</p>
        <p class="cart-item-price">${formatCurrency(item.price)} por ${escapeHtml(item.unit || "unidade")}</p>
        <div class="quantity-control" aria-label="Quantidade de ${escapeHtml(item.name)}">
          <button type="button" data-decrease="${escapeHtml(item.id)}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-increase="${escapeHtml(item.id)}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove="${escapeHtml(item.id)}">Remover</button>
    </article>
  `).join("");

  elements.cartItems.querySelectorAll("[data-decrease]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.decrease, -1));
  });
  elements.cartItems.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.increase, 1));
  });
  elements.cartItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.remove));
  });
}

function checkoutCart() {
  if (!state.cart.length) return;

  const customerName = document.querySelector("[data-customer-name]")?.value.trim();
  const fulfillment = document.querySelector("[data-fulfillment]")?.value || "A combinar";
  const desiredDate = document.querySelector("[data-desired-date]")?.value;
  const notes = document.querySelector("[data-order-notes]")?.value.trim();
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const items = state.cart.map((item) => {
    const subtotal = item.price * item.quantity;
    return `• ${item.quantity}x ${item.name} — ${formatCurrency(subtotal)}`;
  }).join("\n");

  const details = [
    customerName ? `Nome: ${customerName}` : "",
    `Recebimento: ${fulfillment}`,
    desiredDate ? `Data desejada: ${formatDate(desiredDate)}` : "Data desejada: a combinar",
    notes ? `Observações: ${notes}` : "",
  ].filter(Boolean).join("\n");

  const message = [
    `Olá! Gostaria de fazer um pedido na ${SITE_CONFIG.businessName}:`,
    "",
    items,
    "",
    `Total estimado: ${formatCurrency(total)}`,
    "",
    details,
    "",
    "Podemos confirmar a disponibilidade, o prazo e o valor final?",
  ].join("\n");

  openWhatsApp(message);
}

function persistCart() {
  try {
    localStorage.setItem(SITE_CONFIG.cartStorageKey, JSON.stringify(state.cart));
  } catch (error) {
    console.warn("Não foi possível salvar o carrinho no navegador.", error);
  }
}

function loadCart() {
  try {
    const storedCart = JSON.parse(localStorage.getItem(SITE_CONFIG.cartStorageKey) || "[]");
    if (!Array.isArray(storedCart)) return [];

    return storedCart.filter((item) => (
      item &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.price)) &&
      Number.isFinite(Number(item.quantity)) &&
      Number(item.quantity) > 0
    )).map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      unit: typeof item.unit === "string" ? item.unit : "unidade",
      image: typeof item.image === "string" ? item.image : "",
      quantity: Math.floor(Number(item.quantity)),
    }));
  } catch (error) {
    return [];
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat(SITE_CONFIG.locale, {
    style: "currency",
    currency: SITE_CONFIG.currency,
  }).format(value);
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function initializeRevealAnimations() {
  const targets = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  targets.forEach((target) => observer.observe(target));
}

let toastTimer;
function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast?.classList.remove("is-visible"), 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
