const KEYS = {
  products: 'nova_products',
  users: 'nova_users',
  cart: 'nova_cart',
  currentUser: 'nova_current_user'
};

const DEFAULT_PRODUCTS = [
  { id: 1, title: 'Wireless Headphones', description: 'Comfortable over-ear headphones with rich sound and long battery life.', price: 1499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', category: 'Electronics' },
  { id: 2, title: 'Smart Watch', description: 'Track activity, notifications and daily goals with a clean modern display.', price: 2199, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', category: 'Electronics' },
  { id: 3, title: 'Classic Sneakers', description: 'Everyday sneakers designed for comfort, casual outfits and easy movement.', price: 1299, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', category: 'Fashion' },
  { id: 4, title: 'Leather Backpack', description: 'A practical urban backpack with roomy compartments and a premium look.', price: 1699, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', category: 'Fashion' },
  { id: 5, title: 'Minimal Desk Lamp', description: 'Warm adjustable lighting for study spaces, offices and bedside tables.', price: 799, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', category: 'Home' },
  { id: 6, title: 'Ceramic Mug Set', description: 'Simple ceramic mugs for coffee, tea and cozy everyday moments.', price: 449, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80', category: 'Home' },
  { id: 7, title: 'Skincare Essentials', description: 'A basic daily skincare set focused on hydration and gentle care.', price: 999, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80', category: 'Beauty' },
  { id: 8, title: 'Signature Perfume', description: 'A balanced modern fragrance with fresh, warm and elegant notes.', price: 1899, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80', category: 'Beauty' },
  { id: 9, title: 'Mechanical Keyboard', description: 'Responsive keyboard with tactile switches for work, study and gaming.', price: 1799, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80', category: 'Electronics' },
  { id: 10, title: 'Denim Jacket', description: 'A timeless denim jacket that works across seasons and casual styles.', price: 1499, image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80', category: 'Fashion' },
  { id: 11, title: 'Decorative Plant', description: 'A fresh green accent that adds life and calm to your room or workspace.', price: 599, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80', category: 'Home' },
  { id: 12, title: 'Makeup Brush Set', description: 'Soft everyday makeup brushes in a compact, easy-to-store collection.', price: 699, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80', category: 'Beauty' }
];

const ADMIN_USER = {
  id: 1,
  name: 'Admin',
  email: 'admin@novashop.com',
  password: 'admin123',
  role: 'admin'
};

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

function seedData() {
  if (!localStorage.getItem(KEYS.products)) {
    localStorage.setItem(KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
  }

  let users = safeParse(localStorage.getItem(KEYS.users), []);
  if (!users.some(u => u.email.toLowerCase() === ADMIN_USER.email)) {
    users.unshift(ADMIN_USER);
    localStorage.setItem(KEYS.users, JSON.stringify(users));
  }

  if (!localStorage.getItem(KEYS.cart)) {
    localStorage.setItem(KEYS.cart, JSON.stringify([]));
  }
}

function getProducts() { return safeParse(localStorage.getItem(KEYS.products), []); }
function setProducts(products) { localStorage.setItem(KEYS.products, JSON.stringify(products)); }
function getUsers() { return safeParse(localStorage.getItem(KEYS.users), []); }
function setUsers(users) { localStorage.setItem(KEYS.users, JSON.stringify(users)); }
function getCart() { return safeParse(localStorage.getItem(KEYS.cart), []); }
function setCart(cart) { localStorage.setItem(KEYS.cart, JSON.stringify(cart)); updateCartCount(); renderCart(); }
function getCurrentUser() { return safeParse(localStorage.getItem(KEYS.currentUser), null); }

function money(value) {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(value);
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const id = `toast-${Date.now()}`;
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${escapeHTML(message)}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`);
  const el = document.getElementById(id);
  const toast = new bootstrap.Toast(el, { delay: 2200 });
  toast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

function injectSharedUI() {
  const body = document.body;
  body.insertAdjacentHTML('beforeend', `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartLabel">
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title fw-bold" id="cartLabel"><i class="bi bi-bag me-2"></i>Your Cart</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column">
        <div id="cartBody" class="flex-grow-1"></div>
        <div id="cartSummary" class="border-top pt-3 mt-3"></div>
      </div>
    </div>

    <div class="modal fade" id="loginModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">Login to NovaShop</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form id="loginForm">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="loginEmail" required>
              </div>
              <div class="mb-2">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" id="loginPassword" required>
              </div>
              <div class="small text-muted mt-3 p-3 bg-light rounded-3">
                Admin demo: <strong>admin@novashop.com</strong> / <strong>admin123</strong>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="submit" class="btn btn-brand w-100">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="registerModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">Create Account</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form id="registerForm">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" id="registerName" minlength="2" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="registerEmail" required>
              </div>
              <div class="mb-2">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" id="registerPassword" minlength="4" required>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="submit" class="btn btn-brand w-100">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastContainer"></div>
  `);
}

function updateAuthUI() {
  const user = getCurrentUser();
  document.querySelectorAll('[data-auth-guest]').forEach(el => el.classList.toggle('d-none', !!user));
  document.querySelectorAll('[data-auth-user]').forEach(el => el.classList.toggle('d-none', !user));
  document.querySelectorAll('[data-admin-only]').forEach(el => el.classList.toggle('d-none', user?.role !== 'admin'));
  document.querySelectorAll('[data-current-user-name]').forEach(el => el.textContent = user?.name || '');
}

function setupAuth() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const user = getUsers().find(u => u.email.toLowerCase() === email && u.password === password);
    if (!user) return showToast('Invalid email or password.', 'danger');

    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
    bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
    loginForm.reset();
    updateAuthUI();
    showToast(`Welcome back, ${user.name}!`);
    if (document.body.dataset.page === 'dashboard') initDashboard();
  });

  registerForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const users = getUsers();

    if (users.some(u => u.email.toLowerCase() === email)) {
      return showToast('This email is already registered.', 'danger');
    }

    const user = { id: Date.now(), name, email, password, role: 'user' };
    users.push(user);
    setUsers(users);
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
    bootstrap.Modal.getInstance(document.getElementById('registerModal'))?.hide();
    registerForm.reset();
    updateAuthUI();
    showToast('Account created successfully.');
  });

  document.addEventListener('click', e => {
    const logout = e.target.closest('[data-action="logout"]');
    if (!logout) return;
    localStorage.removeItem(KEYS.currentUser);
    updateAuthUI();
    showToast('Logged out successfully.', 'secondary');
    if (document.body.dataset.page === 'dashboard') setTimeout(() => location.reload(), 450);
  });
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
}

function addToCart(productId) {
  const product = getProducts().find(p => p.id === Number(productId));
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  setCart(cart);
  showToast(`${product.title} added to cart.`);
}

function changeCartQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === Number(productId));
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== Number(productId));
  setCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== Number(productId));
  setCart(cart);
  showToast('Product removed from cart.', 'secondary');
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const summary = document.getElementById('cartSummary');
  if (!body || !summary) return;
  const cart = getCart();
  if (!cart.length) {
    body.innerHTML = `<div class="empty-state"><i class="bi bi-bag-x"></i><h6 class="mt-3 fw-bold">Your cart is empty</h6><p class="small">Add products to see them here.</p></div>`;
    summary.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="d-flex gap-3 mb-4">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" class="cart-thumb">
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between gap-2">
          <h6 class="mb-1 fw-bold">${escapeHTML(item.title)}</h6>
          <button class="btn btn-sm text-danger p-0" data-cart-remove="${item.id}" title="Remove"><i class="bi bi-trash3"></i></button>
        </div>
        <div class="small text-muted mb-2">${money(item.price)} each</div>
        <div class="d-flex justify-content-between align-items-center gap-2">
          <div class="btn-group btn-group-sm quantity-control">
            <button class="btn btn-outline-secondary" data-cart-delta="-1" data-id="${item.id}">−</button>
            <button class="btn btn-outline-secondary disabled">${item.quantity}</button>
            <button class="btn btn-outline-secondary" data-cart-delta="1" data-id="${item.id}">+</button>
          </div>
          <strong>${money(item.price * item.quantity)}</strong>
        </div>
      </div>
    </div>`).join('');

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * .05;
  const shipping = subtotal >= 3000 ? 0 : 60;
  const total = subtotal + tax + shipping;
  summary.innerHTML = `
    <div class="d-flex justify-content-between mb-2"><span class="text-muted">Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="d-flex justify-content-between mb-2"><span class="text-muted">Tax (5%)</span><strong>${money(tax)}</strong></div>
    <div class="d-flex justify-content-between mb-3"><span class="text-muted">Shipping</span><strong>${shipping ? money(shipping) : 'Free'}</strong></div>
    <div class="d-flex justify-content-between fs-5 border-top pt-3"><span class="fw-bold">Total</span><strong class="text-brand">${money(total)}</strong></div>
    <button class="btn btn-brand w-100 mt-3" id="checkoutBtn">Checkout</button>`;
}

function setupCartEvents() {
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add-cart]');
    if (add) addToCart(add.dataset.addCart);

    const delta = e.target.closest('[data-cart-delta]');
    if (delta) changeCartQty(delta.dataset.id, Number(delta.dataset.cartDelta));

    const remove = e.target.closest('[data-cart-remove]');
    if (remove) removeFromCart(remove.dataset.cartRemove);

    if (e.target.closest('#checkoutBtn')) showToast('Demo checkout completed successfully.');
  });
}

function productCard(product) {
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card product-card">
        <img src="${escapeHTML(product.image)}" class="card-img-top" alt="${escapeHTML(product.title)}">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <span class="category-badge">${escapeHTML(product.category)}</span>
            <span class="price-tag">${money(product.price)}</span>
          </div>
          <h5 class="card-title fw-bold mt-1">${escapeHTML(product.title)}</h5>
          <p class="product-description">${escapeHTML(product.description)}</p>
          <button class="btn btn-brand mt-auto" data-add-cart="${product.id}"><i class="bi bi-bag-plus me-2"></i>Add to Cart</button>
        </div>
      </div>
    </div>`;
}

function initHome() {
  const featured = document.getElementById('featuredProducts');
  if (featured) featured.innerHTML = getProducts().slice(0, 4).map(productCard).join('');

  const categoriesEl = document.getElementById('categoryCards');
  if (categoriesEl) {
    const icons = { Electronics: 'bi-laptop', Fashion: 'bi-bag-heart', Home: 'bi-house-heart', Beauty: 'bi-stars' };
    const counts = getProducts().reduce((acc, p) => (acc[p.category] = (acc[p.category] || 0) + 1, acc), {});
    categoriesEl.innerHTML = Object.entries(counts).map(([category, count]) => `
      <div class="col-sm-6 col-lg-3">
        <a class="category-card d-block text-dark" href="products.html?category=${encodeURIComponent(category)}">
          <div class="category-icon mb-3"><i class="bi ${icons[category] || 'bi-grid'}"></i></div>
          <h5 class="fw-bold mb-1">${escapeHTML(category)}</h5>
          <div class="text-muted small">${count} products</div>
        </a>
      </div>`).join('');
  }
}

function initProductsPage() {
  const grid = document.getElementById('productsGrid');
  const search = document.getElementById('productSearch');
  const category = document.getElementById('categoryFilter');
  const sort = document.getElementById('sortProducts');
  const count = document.getElementById('productsCount');
  if (!grid) return;

  const categories = [...new Set(getProducts().map(p => p.category))].sort();
  category.innerHTML = `<option value="">All Categories</option>` + categories.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');

  const fromQuery = new URLSearchParams(location.search).get('category');
  if (fromQuery && categories.includes(fromQuery)) category.value = fromQuery;

  const apply = () => {
    let products = [...getProducts()];
    const q = search.value.trim().toLowerCase();
    const cat = category.value;
    if (q) products = products.filter(p => `${p.title} ${p.description} ${p.category}`.toLowerCase().includes(q));
    if (cat) products = products.filter(p => p.category === cat);
    if (sort.value === 'price-asc') products.sort((a,b) => a.price - b.price);
    if (sort.value === 'price-desc') products.sort((a,b) => b.price - a.price);
    if (sort.value === 'name-asc') products.sort((a,b) => a.title.localeCompare(b.title));
    if (sort.value === 'name-desc') products.sort((a,b) => b.title.localeCompare(a.title));
    count.textContent = `${products.length} product${products.length === 1 ? '' : 's'}`;
    grid.innerHTML = products.length ? products.map(productCard).join('') : `<div class="col-12"><div class="empty-state"><i class="bi bi-search"></i><h5 class="mt-3 fw-bold">No products found</h5><p>Try another search or category.</p></div></div>`;
  };

  [search, category, sort].forEach(el => el.addEventListener(el === search ? 'input' : 'change', apply));
  apply();
}

function openProductModal(product = null) {
  const form = document.getElementById('productForm');
  form.reset();
  document.getElementById('productId').value = product?.id || '';
  document.getElementById('productTitle').value = product?.title || '';
  document.getElementById('productDescription').value = product?.description || '';
  document.getElementById('productPrice').value = product?.price || '';
  document.getElementById('productCategory').value = product?.category || '';
  document.getElementById('productImage').value = product?.image || '';
  document.getElementById('productModalTitle').textContent = product ? 'Edit Product' : 'Add Product';
  bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal')).show();
}

function openUserModal(user = null) {
  const form = document.getElementById('userForm');
  form.reset();
  document.getElementById('userId').value = user?.id || '';
  document.getElementById('userName').value = user?.name || '';
  document.getElementById('userEmail').value = user?.email || '';
  document.getElementById('userPassword').value = user?.password || '';
  document.getElementById('userRole').value = user?.role || 'user';
  document.getElementById('userModalTitle').textContent = user ? 'Edit User' : 'Add User';
  bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal')).show();
}

function renderDashboard() {
  const products = getProducts();
  const users = getUsers();
  document.getElementById('statProducts').textContent = products.length;
  document.getElementById('statUsers').textContent = users.length;
  document.getElementById('statCategories').textContent = new Set(products.map(p => p.category)).size;
  document.getElementById('statCartItems').textContent = getCart().reduce((sum, i) => sum + i.quantity, 0);

  const productQ = (document.getElementById('adminProductSearch')?.value || '').trim().toLowerCase();
  const filteredProducts = products.filter(p => `${p.title} ${p.category}`.toLowerCase().includes(productQ));
  document.getElementById('adminProductsBody').innerHTML = filteredProducts.length ? filteredProducts.map(p => `
    <tr>
      <td><img src="${escapeHTML(p.image)}" class="table-product-img" alt=""></td>
      <td><strong>${escapeHTML(p.title)}</strong><div class="small text-muted">#${p.id}</div></td>
      <td>${escapeHTML(p.category)}</td>
      <td>${money(p.price)}</td>
      <td class="text-nowrap">
        <button class="btn btn-sm btn-outline-primary" data-edit-product="${p.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-delete-product="${p.id}"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('') : `<tr><td colspan="5" class="text-center text-muted py-4">No products found.</td></tr>`;

  const userQ = (document.getElementById('adminUserSearch')?.value || '').trim().toLowerCase();
  const filteredUsers = users.filter(u => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(userQ));
  document.getElementById('adminUsersBody').innerHTML = filteredUsers.length ? filteredUsers.map(u => `
    <tr>
      <td><strong>${escapeHTML(u.name)}</strong><div class="small text-muted">#${u.id}</div></td>
      <td>${escapeHTML(u.email)}</td>
      <td><span class="badge ${u.role === 'admin' ? 'text-bg-dark' : 'text-bg-light'}">${escapeHTML(u.role)}</span></td>
      <td class="text-nowrap">
        <button class="btn btn-sm btn-outline-primary" data-edit-user="${u.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-delete-user="${u.id}" ${u.email === ADMIN_USER.email ? 'disabled title="Default admin cannot be deleted"' : ''}><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('') : `<tr><td colspan="4" class="text-center text-muted py-4">No users found.</td></tr>`;
}

function initDashboard() {
  const user = getCurrentUser();
  const app = document.getElementById('dashboardApp');
  const denied = document.getElementById('accessDenied');
  if (!app || !denied) return;

  if (!user || user.role !== 'admin') {
    app.classList.add('d-none');
    denied.classList.remove('d-none');
    return;
  }

  denied.classList.add('d-none');
  app.classList.remove('d-none');
  renderDashboard();

  const productSearch = document.getElementById('adminProductSearch');
  const userSearch = document.getElementById('adminUserSearch');
  if (!productSearch.dataset.bound) {
    productSearch.addEventListener('input', renderDashboard);
    userSearch.addEventListener('input', renderDashboard);
    productSearch.dataset.bound = userSearch.dataset.bound = '1';
  }

  const productForm = document.getElementById('productForm');
  if (!productForm.dataset.bound) {
    productForm.addEventListener('submit', e => {
      e.preventDefault();
      const idValue = document.getElementById('productId').value;
      const products = getProducts();
      const data = {
        id: idValue ? Number(idValue) : Date.now(),
        title: document.getElementById('productTitle').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        price: Number(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value.trim(),
        image: document.getElementById('productImage').value.trim()
      };
      const index = products.findIndex(p => p.id === data.id);
      if (index >= 0) products[index] = data; else products.push(data);
      setProducts(products);
      bootstrap.Modal.getInstance(document.getElementById('productModal'))?.hide();
      renderDashboard();
      showToast(index >= 0 ? 'Product updated.' : 'Product added.');
    });
    productForm.dataset.bound = '1';
  }

  const userForm = document.getElementById('userForm');
  if (!userForm.dataset.bound) {
    userForm.addEventListener('submit', e => {
      e.preventDefault();
      const idValue = document.getElementById('userId').value;
      const users = getUsers();
      const email = document.getElementById('userEmail').value.trim().toLowerCase();
      const duplicate = users.find(u => u.email.toLowerCase() === email && u.id !== Number(idValue));
      if (duplicate) return showToast('A user with this email already exists.', 'danger');

      const data = {
        id: idValue ? Number(idValue) : Date.now(),
        name: document.getElementById('userName').value.trim(),
        email,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value
      };
      const index = users.findIndex(u => u.id === data.id);
      if (index >= 0) users[index] = data; else users.push(data);
      setUsers(users);
      bootstrap.Modal.getInstance(document.getElementById('userModal'))?.hide();
      renderDashboard();
      showToast(index >= 0 ? 'User updated.' : 'User added.');
    });
    userForm.dataset.bound = '1';
  }
}

function setupDashboardActions() {
  document.addEventListener('click', e => {
    if (e.target.closest('#addProductBtn')) openProductModal();
    if (e.target.closest('#addUserBtn')) openUserModal();

    const editProduct = e.target.closest('[data-edit-product]');
    if (editProduct) openProductModal(getProducts().find(p => p.id === Number(editProduct.dataset.editProduct)));

    const deleteProduct = e.target.closest('[data-delete-product]');
    if (deleteProduct && confirm('Delete this product?')) {
      const id = Number(deleteProduct.dataset.deleteProduct);
      setProducts(getProducts().filter(p => p.id !== id));
      setCart(getCart().filter(p => p.id !== id));
      renderDashboard();
      showToast('Product deleted.', 'secondary');
    }

    const editUser = e.target.closest('[data-edit-user]');
    if (editUser) openUserModal(getUsers().find(u => u.id === Number(editUser.dataset.editUser)));

    const deleteUser = e.target.closest('[data-delete-user]');
    if (deleteUser && !deleteUser.disabled && confirm('Delete this user?')) {
      const id = Number(deleteUser.dataset.deleteUser);
      setUsers(getUsers().filter(u => u.id !== id));
      renderDashboard();
      showToast('User deleted.', 'secondary');
    }
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => link.classList.toggle('active', link.dataset.nav === page));
}

function init() {
  seedData();
  injectSharedUI();
  updateAuthUI();
  setupAuth();
  setupCartEvents();
  setupDashboardActions();
  updateCartCount();
  renderCart();
  setActiveNav();

  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'products') initProductsPage();
  if (page === 'dashboard') initDashboard();

  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', init);
