export default class Cloud {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  load() {
    return fetch(this.url);
  }

  add() {
    return fetch(this.url, {
      method: 'POST',
    });
  }

  change(id) {
    return fetch(`${this.url}/${id}`, {
      method: 'PATCH',
    });
  }

  remove(id) {
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    });
  }
}
