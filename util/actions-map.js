const Cache = require('sync-disk-cache');

class ActionsMap {
  constructor() {
    this._map = new Cache('actions');
    if (!this._map.get('js').value) {
      this._map.set('js', '{}');
      this._map.set('hbs', '{}');
      this._map.set('actions', '{}');
    }
  }

  addItem(cacheName, key, actionName) {
    let cache = this.getCache(cacheName);
    if (this.hasItem(cacheName, key) && !this.hasAction(cacheName, key, actionName)) {
      let actions = this.getItem(cacheName, key);
      actions.push(actionName);
      cache[key] = actions;
    } else {
      cache[key] = [actionName];
    }
    this.map.set(cacheName, JSON.stringify(cache));
  }

  hasAction(cacheName, key, actionName) {
    if (!this.hasItem(cacheName, key)) {
      return false;
    }
    let actions = this.getItem(cacheName, key);
    return actions.includes(actionName);
  }

  hasItem(cacheName, key) {
    let cache = this.map.get(cacheName).value;
    if (!cache) {
      return false;
    }
    return Boolean(JSON.parse(cache)[key]);
  }

  getCache(cacheName) {
    let cache = this.map.get(cacheName).value;
    if (!cache) {
      return;
    }
    return JSON.parse(cache);
  }

  getItem(cacheName, key) {
    let cache = this.map.get(cacheName).value;
    if (!cache) {
      return;
    }
    return JSON.parse(cache)[key];
  }

  get map() {
    return this._map;
  }

  clear() {
    this.map.clear();
  }
}

const map = new ActionsMap();

module.exports = map;
