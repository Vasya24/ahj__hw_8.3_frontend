/* eslint-disable no-console */
import Cloud from './Cloud';

export default class CloudWidget {
  constructor() {
    this.cloud = new Cloud('https://qa-netology-cloud.herokuapp.com/instances');
    this.url = 'wss://qa-netology-cloud.herokuapp.com/ws';
    this.cloudList = document.getElementById('cloud_list');
    this.logList = document.getElementById('log_list');
    this.createButton = document.querySelector('.create-button');
  }

  init() {
    this.server();
    this.drawClouds();
    this.action();
  }

  action() {
    this.createButton.addEventListener('click', () => {
      this.cloud.add();
    });
    this.cloudList.addEventListener('click', (event) => {
      if (event.target.classList.contains('play-button') || event.target.classList.contains('stop-button')) {
        const id = event.target.closest('.cloud').querySelector('.id').innerText;
        this.cloud.change(id);
      } else if (event.target.classList.contains('delete-button')) {
        const id = event.target.closest('.cloud').querySelector('.id').innerText;
        this.cloud.remove(id);
      }
    });
  }

  async drawClouds() {
    const response = await this.cloud.load();
    const instances = await response.json();
    this.cloudList.innerHTML = '';
    for (const instance of instances) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      const state = instance.state === 'stopped' ? 'play' : 'stop';
      cloud.innerHTML = `
        <h3 class="id">${instance.id}</h2>
        <div class="info"><span class="info-header">Status:</span><span class="${instance.state}-status-button"></span><span class="status">${instance.state}</span></div>
        <div class="info"><span class="info-header">Actions:</span><span class="${state}-button"></span><span class="delete-button"></span></div>
      `;
      this.cloudList.appendChild(cloud);
    }
  }

  drawLog(data) {
    const { type } = JSON.parse(data);

    if (type === 'message') {
      const { name, message, date } = JSON.parse(data);
      const log = document.createElement('div');
      log.className = 'log-item';
      log.innerHTML = `
        <div class="log-data">${date}</div>
        <p class="log-content">Server: ${name}</p>
        <p class="log-content">INFO: <span class="log-message">${message}</span></p>
      `;

      if (message === 'created' || message === 'removed' || message === 'running' || message === 'stopped') {
        this.drawClouds();
      }

      this.logList.appendChild(log);
      this.logList.scrollTo(0, log.offsetTop);
    }
  }

  server() {
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener('open', () => {
      console.log('connected');
    });
    this.ws.addEventListener('message', (event) => {
      this.drawLog(event.data);
    });
    this.ws.addEventListener('close', (event) => {
      console.log('connection closed', event);
    });
    this.ws.addEventListener('error', () => {
      console.log('error');
    });
  }
}
