import { createRouter, createWebHistory } from 'vue-router';
import Welcome from '../views/Welcome.vue';
import Chatroom from '../views/Chatroom';
// import FriendList from '../views/FriendList';

// route guard

import { projectAuth } from '../firebase/config';

const requireNoAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (!user) {
    next({ name: 'Welcome' });
  } else {
    next();
  }
};

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (user) {
    next({ name: 'Chatroom', params: { id: 'chatrooms' } });
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
    beforeEnter: requireAuth,
  },
  {
    path: '/chatroom/:id',
    name: 'Chatroom',
    component: Chatroom,
    beforeEnter: requireNoAuth,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
