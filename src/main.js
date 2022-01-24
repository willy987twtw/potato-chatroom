import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { projectAuth } from './firebase/config';

let app;
// window.addEventListener('resize', () => {
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
//   console.log(`${vh}`);
// });

projectAuth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(router).mount('#app');
  }
});
