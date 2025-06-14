let cart = [];
let total = 0;

function addToCart(name, price) {
  const product = { name, price };
  cart.push(product);
  updateCart();

  const notif = document.getElementById("notification");

  if (!notif) return; // kalau elemen notifikasi nggak ada, langsung stop

  // Reset
  notif.style.opacity = "1";
  notif.style.transition = "none";
  notif.style.display = "block";
  notif.textContent = `${name} berhasil ditambahkan ke keranjang!`;

  // Paksa reflow supaya animasi bisa jalan ulang
  void notif.offsetWidth;

  notif.style.transition = "opacity 0.5s ease";

  // Setelah 3 detik, mulai fade out
  setTimeout(() => {
    notif.style.opacity = "0";
    setTimeout(() => {
      notif.style.display = "none";
      notif.textContent = "";
      notif.style.opacity = "1"; // reset lagi
    }, 500);
  }, 3000);
}

function updateCart() {
    const cartList = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartList || !cartTotal) return;

    cartList.innerHTML = "";
    total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - Rp${item.price.toLocaleString("id-ID")}
            <button onclick="removeFromCart(${index})" style="margin-left: 10px; background-color: #e74c3c; color: white; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer;">Hapus</button>
        `;
        cartList.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = `Rp${total.toLocaleString("id-ID")}`;
}

function removeFromCart(index) {
    cart.splice(index, 1); // hapus 1 item dari posisi 'index'
    updateCart();          // perbarui tampilan
}

function toggleCart() {
    const cartSidebar = document.getElementById("cartSidebar");
    if (cartSidebar) cartSidebar.classList.toggle("active");
}

function showPayment() {
  const warningText = document.getElementById("checkoutWarning");
  const formContainer = document.getElementById("paymentFormContainer");
  const payBtn = document.getElementById("payButton");
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Reset semua form & warning
  document.getElementById("bankProof").value = "";
  document.getElementById("qrisProof").value = "";
  document.getElementById("bankInfo").style.display = "none";
  document.getElementById("qrisInfo").style.display = "none";
  document.getElementById("transferProofWarning").style.display = "none";

  const radios = document.querySelectorAll('input[name="paymentMethod"]');
  radios.forEach(r => r.checked = false);

  if (cart.length === 0) {
    warningText.textContent = "Keranjang masih kosong. Silakan tambahkan produk terlebih dahulu.";
    warningText.style.display = "block";

    formContainer.style.display = "none";
    payBtn.style.display = "none"; // Hanya sembunyikan tombol BAYAR
  } else {
    warningText.style.display = "none";
    formContainer.style.display = "block";
    payBtn.style.display = "inline-block";
  }

  document.getElementById("paymentTotal").textContent = `Rp${total.toLocaleString("id-ID")}`;
  document.getElementById("paymentModal").style.display = "flex";
}

function closePayment() {
  const paymentModal = document.getElementById("paymentModal");
  const formContainer = document.getElementById("paymentFormContainer");
  const payBtn = document.getElementById("payButton");

  if (paymentModal) paymentModal.style.display = "none";

  document.getElementById("bankProof").value = "";
  document.getElementById("qrisProof").value = "";
  document.getElementById("bankInfo").style.display = "none";
  document.getElementById("qrisInfo").style.display = "none";
  document.getElementById("transferProofWarning").style.display = "none";

  const radios = document.querySelectorAll('input[name="paymentMethod"]');
  radios.forEach(r => r.checked = false);

  formContainer.style.display = "none";
  payBtn.style.display = "none";
}

// Tambahan logika untuk menampilkan info metode pembayaran
function setupPaymentMethodListeners() {
    document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
        input.addEventListener('change', function () {
            const bankInfo = document.getElementById("bankInfo");
            const qrisInfo = document.getElementById("qrisInfo");

            if (bankInfo) bankInfo.style.display = "none";
            if (qrisInfo) qrisInfo.style.display = "none";

            if (this.value === "bank") {
                if (bankInfo) bankInfo.style.display = "block";
            } else if (this.value === "qris") {
                if (qrisInfo) qrisInfo.style.display = "block";
            }
        });
    });
}

function completePayment() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const bankProof = document.getElementById("bankProof");
    const qrisProof = document.getElementById("qrisProof");
    const errorText = document.getElementById("paymentError");

    // Reset error text
    errorText.textContent = "";
    errorText.style.display = "none";

    if (!selectedMethod) {
        errorText.textContent = "Pilih metode pembayaran terlebih dahulu.";
        errorText.style.display = "block";
        return;
    }

    if (selectedMethod.value === "bank" && (!bankProof || !bankProof.files.length)) {
        errorText.textContent = "Silakan upload bukti transfer bank terlebih dahulu.";
        errorText.style.display = "block";
        return;
    }

    if (selectedMethod.value === "qris" && (!qrisProof || !qrisProof.files.length)) {
        errorText.textContent = "Silakan upload bukti pembayaran QRIS terlebih dahulu.";
        errorText.style.display = "block";
        return;
    }

    const paymentTotal = document.getElementById("paymentTotal").innerText;

    // sukses terbayar
    showSuccessModal(selectedMethod.value, paymentTotal);

    cart = [];
    updateCart();
    closePayment();
    toggleCart();
}

function showSuccessModal(method, total) {
  const successModal = document.getElementById("successModal");
  const successMessage = document.getElementById("successMessage");
  successMessage.innerHTML = `
    <strong>Metode:</strong> ${method.toUpperCase()}<br>
    <strong>Total:</strong> ${total}<br><br>
    🎉 Terima kasih telah berbelanja di Sweet Dreams Bakery!
  `;
  successModal.style.display = "flex";
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Order button click handlers
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3')?.textContent || "Produk";
        const priceText = productCard.querySelector('.price')?.textContent || "Rp0";
        const priceNumber = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;

        // Tambahkan ke keranjang
        addToCart(productName, priceNumber);

        // Efek pesan
        this.textContent = 'Diproses...';
        this.style.background = '#28a745';

    setTimeout(() => {
        this.textContent = 'Tambahkan ke Keranjang';
        this.style.background = '';
        }, 1500);
    });
});

document.getElementById("closeCartBtn").addEventListener("click", toggleCart);

// Hover effect
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

function toggleWhatsAppDropdown() {
  const dropdown = document.getElementById("waDropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

// Nutup dropdown kalau klik di luar
window.addEventListener("click", function (e) {
  const waButton = document.getElementById("waToggle");
  const dropdown = document.getElementById("waDropdown");

  if (dropdown && !dropdown.contains(e.target) && !waButton.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});


// Jalankan setup saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
    setupPaymentMethodListeners();

  // Pastikan success modal tersembunyi saat halaman dimuat
  const successModal = document.getElementById("successModal");
  if (successModal) successModal.style.display = "none";
});

