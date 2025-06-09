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