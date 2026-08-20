const productsData = {
    1: { name: 'پالت آرایشی حرفه‌ای', price: 450000 },
    2: { name: 'کرم مرطوب‌کننده روز', price: 320000 },
    3: { name: 'سایه چشم مات ۱۲ رنگ', price: 280000 },
    4: { name: 'رژ لب مات ماندگار', price: 190000 },
    5: { name: 'کرم پودر کاور کامل', price: 520000 },
    6: { name: 'سرم ویتامین C', price: 480000 }
};

let cart = JSON.parse(localStorage.getItem('cart')) || {};

const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartTotalItems = document.getElementById('cartTotalItems');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    function getCategoryFromButton(btn) {
        const text = btn.textContent.trim();
        const categories = {
            '💄 آرایشی': 'آرایشی',
            '🧴 مراقبتی': 'مراقبتی',
            '👁️ آرایش چشم': 'آرایش چشم',
            'همه': 'همه'
        };
        return categories[text] || text;
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = getCategoryFromButton(this);
            console.log('دسته‌بندی انتخاب شده:', category);

            productCards.forEach(card => {
                const cardCategory = card.dataset.category;
                if (category === 'همه' || cardCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const allBtn = document.querySelector('.filter-btn.active');
    if (allBtn) {
        allBtn.click();
    }
});
function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;
    let itemsHTML = '';

    for (const [id, count] of Object.entries(cart)) {
        if (count <= 0) {
            delete cart[id];
            continue;
        }
        const product = productsData[id];
        if (!product) continue;

        totalItems += count;
        totalPrice += product.price * count;

        itemsHTML += `
            <div class="cart-item" data-id="${id}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">${(product.price * count).toLocaleString()} <span>تومان</span></div>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-qty-btn" data-id="${id}" data-action="decrease">−</button>
                    <span class="cart-item-qty">${count}</span>
                    <button class="cart-qty-btn" data-id="${id}" data-action="increase">+</button>
                    <button class="cart-item-remove" data-id="${id}">✕</button>
                </div>
            </div>
        `;
    }
    cartItems.innerHTML = itemsHTML || '<div class="cart-empty">🛒 سبد خرید خالی است</div>';
    cartCount.textContent = totalItems;
    cartTotalPrice.textContent = totalPrice.toLocaleString();
    cartTotalItems.textContent = totalItems;

    saveCart();
    updateAddToCartButtons();
}
function updateAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        const id = btn.dataset.id;
        if (cart[id] && cart[id] > 0) {
            btn.textContent = `🛒 ${cart[id]} ×`;
            btn.style.background = 'rgba(167, 139, 250, 0.15)';
            btn.style.color = '#a78bfa';
            btn.style.borderColor = 'rgba(167, 139, 250, 0.2)';
        } else {
            btn.textContent = '➕ افزودن به سبد';
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    });
}
function addToCart(productId) {
    if (!cart[productId]) cart[productId] = 0;
    cart[productId]++;
    updateCartUI();

    const btn = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (btn) {
        btn.style.transform = 'scale(0.92)';
        setTimeout(() => btn.style.transform = '', 150);
    }
}
function removeFromCart(productId) {
    if (cart[productId] && cart[productId] > 0) {
        cart[productId]--;
        if (cart[productId] === 0) delete cart[productId];
        updateCartUI();
    }
}
function deleteFromCart(productId) {
    delete cart[productId];
    updateCartUI();
}
function clearCart() {
    if (Object.keys(cart).length === 0) return;
    if (confirm('آیا مطمئنی می‌خوای سبد رو خالی کنی؟')) {
        cart = {};
        updateCartUI();
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('open');
    }
}
function openCart() {
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
cartToggle.addEventListener('click', openCart);

cartClose.addEventListener('click', closeCart);

cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
});

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (btn && btn.dataset.id) {
        addToCart(btn.dataset.id);
    }
});

cartItems.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;
    if (!id) return;

    if (target.dataset.action === 'increase') {
        addToCart(id);
    } else if (target.dataset.action === 'decrease') {
        removeFromCart(id);
    } else if (target.classList.contains('cart-item-remove')) {
        deleteFromCart(id);
    }
});

clearCartBtn.addEventListener('click', clearCart);

checkoutBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
        alert('🛒 سبد خرید شما خالی است!');
        return;
    }
    const total = Object.entries(cart).reduce((sum, [id, count]) => {
        return sum + (productsData[id]?.price || 0) * count;
    }, 0);
    alert(`✅ سفارش شما با موفقیت ثبت شد!\n💰 مبلغ کل: ${total.toLocaleString()} تومان`);
    cart = {};
    updateCartUI();
    closeCart();
});

updateCartUI();

const productsFullData = {
    1: {
        name: 'پالت آرایشی حرفه‌ای',
        price: '450,000 تومان',
        category: '💄 آرایشی',
        description: 'پالت آرایشی با 45 رنگ مات و براق، ماندگاری بالا و مناسب برای انواع پوست.',
        ingredients: 'پودر میکرونیزه، ویتامین E، روغن‌های طبیعی',
        benefits: 'رنگ‌دهی عالی، ماندگاری 12 ساعته، مناسب برای مهمانی‌ها',
        image: '/pictures/PA.jpg'
    },
    2: {
        name: 'کرم مرطوب‌کننده روز',
        price: '320,000 تومان',
        category: '🧴 مراقبتی',
        description: 'کرم مرطوب‌کننده با SPF 30، مناسب برای پوست‌های خشک و حساس.',
        ingredients: 'آب معدنی، گلیسیرین، روغن آرگان، ویتامین B5',
        benefits: 'آبرسانی عمیق، جلوگیری از چین و چروک، مناسب برای استفاده روزانه',
        image: '/pictures/km'
    },
    3: {
        name: 'سایه چشم',
        price: '280,000 تومان',
        category: '👁️ آرایش چشم',
        description: 'سایه چشم مات با 12 رنگ شیک و ماندگار، مناسب برای چشم‌های حساس.',
        ingredients: 'پودر تالک، اکسید آهن، ویتامین A',
        benefits: 'رنگ‌دهی فوق‌العاده، ضد حساسیت، ماندگاری 10 ساعته',
        image: '/pictures/SCH.jpg'
    },
    4: {
        name: 'رژ لب مات ماندگار',
        price: '190,000 تومان',
        category: '💋 لب',
        description: 'رژ لب مات با بافت کرمی، ماندگاری بالا و رنگ‌های جذاب.',
        ingredients: 'موم طبیعی، روغن جوجوبا، ویتامین E',
        benefits: 'رنگ‌دهی عالی، مرطوب‌کننده، ماندگاری 8 ساعته',
        image: '/pictures/RL'
    },
    5: {
        name: 'کرم پودر کاور کامل',
        price: '520,000 تومان',
        category: '💄 آرایشی',
        description: 'کرم پودر با پوشش کامل، مناسب برای پوست‌های مختلط و چرب.',
        ingredients: 'سیلیکون، ویتامین C، عصاره‌های گیاهی',
        benefits: 'پوشش عالی لک‌ها، کنترل چربی، ماندگاری 14 ساعته',
        image: '/pictures/KP.jpg'
    },
    6: {
        name: 'سرم ویتامین C',
        price: '480,000 تومان',
        category: '🧴 مراقبتی',
        description: 'سرم ویتامین C با غلظت 20%، روشن‌کننده و ضد پیری.',
        ingredients: 'ویتامین C پایدار، اسید هیالورونیک، ویتامین E',
        benefits: 'روشن‌کننده قوی، کاهش لک‌های تیره، افزایش کلاژن‌سازی',
        image: '/pictures/VC.jpg'
    }
};

function createModal() {
    if (document.querySelector('.product-modal')) return;

    const modalHTML = `
        <div class="product-modal" id="productModal">
            <div class="modal-overlay" id="modalOverlay"></div>
            <div class="modal-content">
                <button class="modal-close" id="modalClose">✕</button>
                <div class="modal-body" id="modalBody">
                    <!-- محتوا توسط JS ساخته میشه -->
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('modalOverlay').addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(productId) {
    const product = productsFullData[productId];
    if (!product) return;
    createModal();

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="modal-info">
                <span class="modal-category">${product.category}</span>
                <h2 class="modal-title">${product.name}</h2>
                <div class="modal-price">💰 ${product.price}</div>
                
                <div class="modal-section">
                    <h3>📝 توضیحات</h3>
                    <p>${product.description}</p>
                </div>
                
                <div class="modal-section">
                    <h3>🧪 ترکیبات</h3>
                    <p>${product.ingredients}</p>
                </div>
                
                <div class="modal-section">
                    <h3>✨ مزایا</h3>
                    <ul>
                        ${product.benefits.split('،').map(b => `<li>✅ ${b.trim()}</li>`).join('')}
                    </ul>
                </div>
                
                <button class="modal-add-to-cart" data-id="${productId}">
                    🛒 افزودن به سبد خرید
                </button>
            </div>
        </div>
    `;

    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';

    modalBody.querySelector('.modal-add-to-cart').addEventListener('click', function() {
        const id = this.dataset.id;
        addToCart(id);
        closeModal();
    });
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

document.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card');
    if (!productCard) return;

    const addBtn = productCard.querySelector('.add-to-cart');
    if (!addBtn) return;

    if (e.target.closest('.add-to-cart')) return;

    const productId = addBtn.dataset.id;
    if (productId) {
        openModal(productId);
    }
});