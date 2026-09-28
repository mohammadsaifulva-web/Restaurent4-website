// ═══════════════════════════════════
// SHARED SCRIPT — সব page এ কাজ করবে
// ═══════════════════════════════════

// ১। NAVBAR SCROLL EFFECT
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });
}

// ২। ACTIVE NAV LINK — current page highlight
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// ৩। SCROLL REVEAL ANIMATION
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
    revealObserver.observe(el);
});

// ৪। COUNTER ANIMATION
function animateCounter(el, target, suffix = '') {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            const suffix = entry.target.dataset.suffix || '';
            animateCounter(entry.target, target, suffix);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ৫। TOAST NOTIFICATION
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// ৬। CART SYSTEM
let cart = JSON.parse(localStorage.getItem('saifCart')) || [];

function saveCart() {
    localStorage.setItem('saifCart', JSON.stringify(cart));
    updateCartUI();
    updateCartCount();
}

function addToCart(name, price, img) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }
    saveCart();
    showToast(`🍽️ ${name} added to cart!`);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(name);
    else saveCart();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-msg">
                <div class="empty-icon">🍽️</div>
                <p>Your cart is empty</p>
                <p style="font-size:13px;margin-top:8px">Add some delicious dishes!</p>
            </div>`;
        document.getElementById('cartSubtotal').textContent = 'SAR 0.00';
        document.getElementById('cartTotal').textContent = 'SAR 0.00';
        return;
    }

    let subtotal = 0;
    container.innerHTML = '';

    cart.forEach(item => {
        subtotal += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">SAR ${(item.price * item.qty).toFixed(2)}</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });

    const delivery = subtotal > 150 ? 0 : 15;
    document.getElementById('cartSubtotal').textContent = `SAR ${subtotal.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `SAR ${(subtotal + delivery).toFixed(2)}`;
}

// Cart open/close
function openCart() {
    document.getElementById('cartOverlay').classList.add('show');
    document.getElementById('cartDrawer').classList.add('open');
    document.body.style.overflow = 'hidden';
    updateCartUI();
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('show');
    document.getElementById('cartDrawer').classList.remove('open');
    document.body.style.overflow = '';
}

// Init
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
updateCartCount();

// ৭। SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});