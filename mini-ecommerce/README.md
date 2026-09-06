# NovaShop - Mini E-Commerce Website

A complete front-end mini e-commerce project built with HTML, CSS, Bootstrap, and JavaScript.

## Pages
- `index.html` — Landing page
- `products.html` — Dynamic products page with search, category filtering, and sorting
- `about.html` — Company information, vision, mission, and contact details
- `dashboard.html` — Admin dashboard for product and user management

## Features
- Product data stored as an Array of Objects and persisted in `localStorage`
- Dynamic product rendering
- Search products
- Filter by category
- Sort by price or name
- Register / Login using Local Storage
- Current-user session using Local Storage
- Full shopping cart logic
  - Add to cart
  - Increase/decrease quantity
  - Remove items
  - Subtotal, tax, shipping, final total
- Admin dashboard
  - Product add/edit/delete/search
  - User add/edit/delete/search
  - Product/user/category/cart statistics
- Responsive Bootstrap design
- Bootstrap carousel on the home page

## Admin Login
- Email: `admin@novashop.com`
- Password: `admin123`

## How to Run
1. Extract the project folder.
2. Open `index.html` in a browser.
3. An internet connection is recommended because Bootstrap, Google Fonts, Bootstrap Icons, and product images are loaded from CDN/online URLs.
4. For the best development experience, open the folder in VS Code and run it with the Live Server extension.

## Reset Demo Data
Open the browser DevTools Console and run:

```js
localStorage.clear();
location.reload();
```

The default products and admin user will be created again automatically.
