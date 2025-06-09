let breeds = [], filteredBreeds = [], currentCatImage = null, favorites = [], categories = [];

class CatImage {
  constructor(id, url, breed, width, height) {
    this.id = id;
    this.url = url;
    this.breed = breed;
    this.width = width;
    this.height = height;
  }
}
class Breed {
  constructor(id, name, temperament, origin) {
    this.id = id;
    this.name = name;
    this.temperament = temperament;
    this.origin = origin;
  }
}
class FavoriteCat {
  constructor(id, url, addedAt) {
    this.id = id;
    this.url = url;
    this.addedAt = addedAt;
  }
}
class Category {
  constructor(id, name, description = "No description provided.") {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
class UserSettings {
  constructor(theme, imageSize, autoRefresh) {
    this.theme = theme;
    this.imageSize = imageSize;
    this.autoRefresh = autoRefresh;
  }
}

// ========== Data Structures ==========
let breeds = [], filteredBreeds = [], currentCatImage = null, favorites = [];

// ========== Object Constructors ==========
class CatImage {
  constructor(id, url, breed, width, height) {
    this.id = id;
    this.url = url;
    this.breed = breed;
    this.width = width;
    this.height = height;
  }
}

class Breed {
  constructor(id, name, temperament, origin) {
    this.id = id;
    this.name = name;
    this.temperament = temperament;
    this.origin = origin;
  }
}

class FavoriteCat {
  constructor(id, url, addedAt) {
    this.id = id;
    this.url = url;
    this.addedAt = addedAt;
  }
}

// ========== API Fetches ==========
function fetchBreeds() {
  fetch('https://api.thecatapi.com/v1/breeds')
    .then(res => res.json())
    .then(data => {
      breeds = data.map(b => new Breed(b.id, b.name, b.temperament, b.origin || 'Unknown'));
      filteredBreeds = breeds;
      populateBreedDropdown(filteredBreeds);
      fetchCatImage(); // Load first cat image after breeds load
    });
}

function fetchCatImage(breedId = '') {
  let url = 'https://api.thecatapi.com/v1/images/search';
  if (breedId) url += `?breed_ids=${breedId}`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        document.getElementById('catImage').src = '';
        document.getElementById('catInfo').textContent = 'No images found.';
        currentCatImage = null;
        return;
      }

      const catData = data[0];
      const breedInfo = catData.breeds?.[0];
      const breed = breedInfo ? new Breed(breedInfo.id, breedInfo.name, breedInfo.temperament, breedInfo.origin || 'Unknown') : null;

      currentCatImage = new CatImage(catData.id, catData.url, breed, catData.width, catData.height);

      const catImg = document.getElementById('catImage');
      catImg.src = currentCatImage.url;
      catImg.alt = breed ? breed.name : 'Cat';

      document.getElementById('catInfo').textContent = breed
        ? `Breed: ${breed.name} — Temperament: ${breed.temperament}`
        : 'Unknown breed';
    });
}

// ========== DOM Rendering ==========
function populateBreedDropdown(breedArray) {
  const select = document.getElementById('breedSelect');
  select.innerHTML = '<option value="">All Breeds</option>';
  breedArray.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.name;
    select.appendChild(opt);
  });
}

function renderFavorites() {
  const container = document.getElementById('favorites');
  container.innerHTML = '';
  favorites.forEach(fav => {
    const div = document.createElement('div');
    div.className = 'favorite-item';

    const img = document.createElement('img');
    img.src = fav.url;
    img.alt = 'Favorite Cat';
    div.appendChild(img);

    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.title = 'Remove from favorites';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      removeFavorite(fav.id);
    });

    div.appendChild(btn);
    container.appendChild(div);
  });
}

// ========== Favorites ==========
function addToFavorites() {
  if (!currentCatImage || favorites.some(f => f.id === currentCatImage.id)) return;
  favorites.push(new FavoriteCat(currentCatImage.id, currentCatImage.url, Date.now()));
  saveFavorites();
  renderFavorites();
}

function removeFavorite(id) {
  favorites = favorites.filter(f => f.id !== id);
  saveFavorites();
  renderFavorites();
}

function saveFavorites() {
  localStorage.setItem('catFavorites', JSON.stringify(favorites));
}

function loadFavorites() {
  const saved = localStorage.getItem('catFavorites');
  if (saved) {
    favorites = JSON.parse(saved);
    renderFavorites();
  }
}

// ========== Search ==========
function filterBreeds(searchTerm) {
  filteredBreeds = breeds.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  populateBreedDropdown(filteredBreeds);
}

// ========== Event Listeners ==========
document.getElementById('newCatBtn').addEventListener('click', () =>
  fetchCatImage(document.getElementById('breedSelect').value)
);

document.getElementById('breedSelect').addEventListener('change', () =>
  fetchCatImage(document.getElementById('breedSelect').value)
);

document.getElementById('breedSearch').addEventListener('input', e =>
  filterBreeds(e.target.value)
);

document.getElementById('favBtn').addEventListener('click', addToFavorites);

// ========== Init ==========
loadFavorites();
fetchBreeds();
