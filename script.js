const products = [
    {
        name: "Brewed Coffee",
        category: "Coffee",
        price: 45,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
        description: "Freshly brewed classic coffee."
    },
    {
        name: "French Vanilla",
        category: "Special",
        price: 55,
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600",
        description: "Smooth and creamy vanilla coffee."
    },
    {
        name: "Hot Chocolate",
        category: "Special",
        price: 50,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIAzew2iqeE-0MyOjNKT2JZkS95RAsYGD2WxC467M51g&s=10",
        description: "Rich chocolate in every sip."
    },
    {
        name: "Hot Matcha Latte",
        category: "Special",
        price: 65,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600",
        description: "Creamy matcha with a smooth finish."
    },
    {
        name: "Espresso Shot",
        category: "Coffee",
        price: 40,
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600",
        description: "A bold and concentrated coffee."
    },
    {
        name: "Iced Americano",
        category: "Iced",
        price: 55,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600",
        description: "Refreshing espresso over ice."
    },
    {
        name: "Iced French Vanilla",
        category: "Iced",
        price: 65,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
        description: "Cold and creamy vanilla coffee."
    }
];

let cart = [];
let selectedProduct = null;

function renderMenu(items = products) {
    document.getElementById("menu").innerHTML = items.map(p => `
        <article class="product">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>

            <h3>${p.name}</h3>
            <p>${p.description}</p>

            <div class="product-bottom">
                <span class="price">₱${p.price.toFixed(2)}</span>
                <button class="add-button" onclick="openModal(${products.indexOf(p)})">
                    + Add
                </button>
            </div>
        </article>
    `).join("");
}

function filterMenu(category, button) {
    document.querySelectorAll(".category").forEach(b => {
        b.classList.remove("active");
    });

    button.classList.add("active");

    renderMenu(
        category === "All"
            ? products
            : products.filter(p => p.category === category)
    );
}

function openModal(index) {
    selectedProduct = products[index];

    document.getElementById("modal-title").textContent = selectedProduct.name;
    document.getElementById("temperature").value = "Hot";
    document.getElementById("size").value = "Medium";

    document.getElementById("overlay").classList.add("show");
    document.getElementById("modal").classList.add("show");
}

function addToCart() {
    if (!selectedProduct) return;

    const temperature = document.getElementById("temperature").value;
    const size = document.getElementById("size").value;

    const extra = size === "Small" ? -10 : size === "Large" ? 15 : 0;
    const icedExtra = temperature === "Iced" ? 5 : 0;

    const price = Math.max(0, selectedProduct.price + extra + icedExtra);

    const key = `${selectedProduct.name}-${temperature}-${size}`;

    const existing = cart.find(item => item.key === key);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            key,
            name: selectedProduct.name,
            temperature,
            size,
            price,
            quantity: 1
        });
    }

    updateCart();
    closeAll();
}

function updateCart() {
    const container = document.getElementById("cart-items");

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    document.getElementById("cart-count").textContent = count;
    document.getElementById("total").textContent = `₱${total.toFixed(2)}`;

    if (cart.length === 0) {
        container.innerHTML = `
            <p style="text-align:center;color:#758078;padding:35px 0">
                Your cart is empty.
            </p>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <small>
                    ${item.temperature} · ${item.size} · ₱${item.price.toFixed(2)}
                </small>
            </div>

            <div class="quantity">
                <button onclick="changeQuantity('${item.key}', -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.key}', 1)">+</button>
            </div>
        </div>
    `).join("");
}

function changeQuantity(key, amount) {
    const item = cart.find(i => i.key === key);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.key !== key);
    }

    updateCart();
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("show");
    document.getElementById("overlay").classList.toggle("show");
    document.getElementById("modal").classList.remove("show");
}

function closeAll() {
    document.getElementById("cart").classList.remove("show");
    document.getElementById("modal").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
}

function checkout() {
    if (cart.length === 0) {
        alert("Please add a drink to your cart first.");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    alert(
        `Thank you for ordering at CITY CAFE!\n\n` +
        `Your total is ₱${total.toFixed(2)}.\n\n` +
        `This is a demo checkout. No payment has been processed.`
    );

    cart = [];
    updateCart();
    closeAll();
}

renderMenu();