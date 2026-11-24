// ============================================
// js/main.js
// Shared utilities used across all pages
// ============================================

// ============================================
// TOAST NOTIFICATIONS
// ============================================
// Creates a notification that appears at bottom-right and disappears after 3 seconds

const showToast = (message, type = 'info') => {
  // Create container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Icon based on type
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Auto-remove after 3.5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// ============================================
// NAVBAR: Setup based on login state
// ============================================
const setupNavbar = () => {
  const user = getCurrentUser();
  const actionsEl = document.getElementById('navbar-actions');
  if (!actionsEl) return;

  if (user) {
    // Show user avatar and dashboard link
    actionsEl.innerHTML = `
      <a href="${getDashboardLink(user.role)}" class="btn btn-secondary btn-sm">Dashboard</a>
      <div class="navbar__user" id="user-menu-btn">
        <div class="navbar__user-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <span>${user.name.split(' ')[0]}</span>
      </div>
      <button class="btn btn-sm" id="logout-btn" onclick="handleLogout()" style="color:var(--gray-600)">
        Logout
      </button>
    `;
  } else {
    actionsEl.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Log In</a>
      <a href="register.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }
};

const getDashboardLink = (role) => {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'owner') return 'owner-dashboard.html';
  return 'student-dashboard.html';
};

const handleLogout = () => {
  clearAuth();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
};

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const setupMobileMenu = () => {
  const toggle = document.getElementById('navbar-toggle');
  const links = document.getElementById('navbar-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }
};

// ============================================
// PROPERTY CARD BUILDER
// Returns HTML string for a property card
// ============================================
const buildPropertyCard = (property, isFavourited = false) => {
  const imgSrc = property.images && property.images.length > 0
    ? `http://localhost:5000${property.images[0]}`
    : null;

  const genderClass = property.genderPreference.toLowerCase();

  return `
    <div class="property-card" onclick="window.location.href='property-details.html?id=${property._id}'">
      <div class="property-card__image">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${property.name}" loading="lazy">`
          : `<div class="img-placeholder">
               <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
               </svg>
               <span>No Image</span>
             </div>`
        }
        <span class="property-card__badge ${genderClass}">${property.genderPreference}</span>
        <button class="property-card__fav ${isFavourited ? 'active' : ''}"
          onclick="event.stopPropagation(); toggleFavourite('${property._id}', this)"
          title="${isFavourited ? 'Remove from favourites' : 'Save property'}">
          <svg width="16" height="16" fill="${isFavourited ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      <div class="property-card__body">
        <div class="property-card__type">${property.type}</div>
        <div class="property-card__name">${property.name}</div>
        <div class="property-card__location">
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          ${property.locality}, ${property.city}
        </div>
        <div class="property-card__tags">
          <span class="tag ${property.sharingType.toLowerCase()}">${property.sharingType} Sharing</span>
          ${property.hasAC ? '<span class="tag ac">AC</span>' : ''}
          ${property.hasFood ? '<span class="tag food">Food Included</span>' : ''}
        </div>
        <div class="property-card__footer">
          <div class="property-card__price">
            <span class="amount">₹${property.monthlyRent.toLocaleString()}</span>
            <span class="label">per month</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.location.href='property-details.html?id=${property._id}'">
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
};

// ============================================
// TOGGLE FAVOURITE
// ============================================
const toggleFavourite = async (propertyId, btn) => {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please log in to save properties.', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }
  if (user.role !== 'student') {
    showToast('Only students can save favourites.', 'warning');
    return;
  }

  try {
    const isActive = btn.classList.contains('active');
    if (isActive) {
      await favouriteAPI.remove(propertyId);
      btn.classList.remove('active');
      btn.querySelector('svg').setAttribute('fill', 'none');
      showToast('Removed from favourites.', 'info');
    } else {
      await favouriteAPI.add(propertyId);
      btn.classList.add('active');
      btn.querySelector('svg').setAttribute('fill', 'currentColor');
      showToast('Saved to favourites! ❤️', 'success');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
};

// ============================================
// REDIRECT IF NOT LOGGED IN
// ============================================
const requireAuth = (role) => {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please log in to access this page.', 'warning');
    setTimeout(() => window.location.href = 'login.html', 500);
    return false;
  }
  if (role && user.role !== role) {
    showToast('You do not have permission to access this page.', 'error');
    setTimeout(() => window.location.href = 'index.html', 500);
    return false;
  }
  return true;
};

// ============================================
// FORMAT DATE
// ============================================
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ============================================
// INITIALIZE ON EVERY PAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupMobileMenu();
});
