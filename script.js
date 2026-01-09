// 1. Data Store
const properties = [
    { id: 1, title: "Emerald Female Residency", type: "PG", college: "LU", city: "Lucknow", price: 8500, dist: "0.4km", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", amenities: ["WiFi", "AC", "3 Meals"] },
    { id: 2, title: "The Scholar House", type: "Hostel", college: "BBD", city: "Lucknow", price: 6000, dist: "1.0km", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5", amenities: ["Gym", "Laundry"] },
    { id: 3, title: "Amity Executive Flats", type: "Flat", college: "Amity Noida", city: "Noida", price: 17500, dist: "0.2km", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", amenities: ["Pool", "Fully Furnished"] },
    { id: 4, title: "Zolo Stays Co-living", type: "PG", college: "Christ Univ", city: "Bengaluru", price: 21000, dist: "1.2km", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", amenities: ["Gaming Zone", "Housekeeping"] },
    { id: 5, title: "Viman Nagar Studio", type: "Flat", college: "Symbiosis", city: "Pune", price: 16000, dist: "0.5km", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb", amenities: ["Balcony", "Kitchenette"] },
    { id: 6, title: "Davv Boys Lodge", type: "PG", college: "DAVV", city: "Indore", price: 5000, dist: "0.3km", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457", amenities: ["Purified Water", "24/7 Security"] }
];

// 2. State
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const state = {
    search: '',
    city: 'all',
    type: 'all',
    college: 'all',
    view: 'all' // or 'wishlist'
};

// 3. Selectors
const grid = document.getElementById('propertyGrid');
const loader = document.getElementById('loader');

// 4. Initialization
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    setTimeout(() => {
        loader.classList.add('hidden');
        render();
    }, 600);
});

function initFilters() {
    const categories = ['city', 'type', 'college'];
    categories.forEach(cat => {
        const select = document.getElementById(`${cat}Filter`);
        const uniqueValues = [...new Set(properties.map(p => p[cat]))];
        uniqueValues.forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            select.appendChild(opt);
        });
        
        select.addEventListener('change', (e) => {
            state[cat] = e.target.value;
            render();
        });
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
        state.search = e.target.value.toLowerCase();
        render();
    });
}

// 5. Core Logic
function render() {
    let filtered = properties.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(state.search) || p.city.toLowerCase().includes(state.search);
        const matchesCity = state.city === 'all' || p.city === state.city;
        const matchesType = state.type === 'all' || p.type === state.type;
        const matchesCollege = state.college === 'all' || p.college === state.college;
        const matchesWishlist = state.view === 'wishlist' ? wishlist.includes(p.id) : true;
        
        return matchesSearch && matchesCity && matchesType && matchesCollege && matchesWishlist;
    });

    grid.innerHTML = '';
    document.getElementById('noResults').classList.toggle('hidden', filtered.length > 0);

    filtered.forEach(p => {
        const isLiked = wishlist.includes(p.id);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="position: relative">
                <img src="${p.img}" class="card-img" alt="${p.title}" loading="lazy">
                <button class="heart-btn ${isLiked ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWish(${p.id})">
                    <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
            <div class="card-body" onclick="showDetails(${p.id})">
                <div class="card-price">₹${p.price.toLocaleString()}</div>
                <h3 class="card-title">${p.title}</h3>
                <div class="card-meta">
                    <span><i class="fa-solid fa-location-dot"></i> ${p.city}</span>
                    <span><i class="fa-solid fa-graduation-cap"></i> ${p.college}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleWish(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(i => i !== id);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    render();
}

function showDetails(id) {
    const p = properties.find(item => item.id === id);
    const content = document.getElementById('propertyModalContent');
    content.innerHTML = `
        <span class="close" onclick="closeModal('propertyModal')">&times;</span>
        <img src="${p.img}" style="width:100%; height:250px; object-fit:cover; border-radius:15px">
        <h2 style="margin-top:20px">${p.title}</h2>
        <p style="color:var(--text-sub); margin-bottom:15px">${p.dist} from ${p.college}</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
            ${p.amenities.map(a => `<span class="badge">${a}</span>`).join('')}
        </div>
        <button class="primary-btn" onclick="window.open('tel:91987654321')">Book a Visit</button>
    `;
    openModal('propertyModal');
}

// 6. Navigation
function showWishlist() {
    state.view = 'wishlist';
    updateActiveNav('Saved');
    render();
}

function resetView() {
    state.view = 'all';
    state.search = '';
    document.getElementById('searchInput').value = '';
    updateActiveNav('Home');
    render();
}

function updateActiveNav(label) {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.nav === label);
    });
}

// 7. Modals & Theme
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#themeToggle i');
    icon.className = document.body.classList.contains('dark-mode') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

// Close modal on outside click
window.onclick = (e) => { if(e.target.classList.contains('modal')) e.target.classList.add('hidden'); };