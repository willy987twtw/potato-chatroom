<template>
  <nav class="navbar" v-if="user && userInfo">
    <div>
      <p class="display-name">您好，{{ userInfo.displayName }}</p>
      <p class="email">{{ user.email }}</p>
    </div>
    <button @click="handleClick">登出</button>
  </nav>
</template>

<script>
import getUser from '@/composables/getUser';
import useLogout from '@/composables/useLogout';
import { useRouter } from 'vue-router';
import getDocument from '@/composables/getDocument.js';

export default {
  components: { useLogout },
  setup() {
    const { logout, error } = useLogout();
    const router = useRouter();
    const { user } = getUser();
    const { document: userInfo } = getDocument('users', user.value.uid);

    const handleClick = async () => {
      await logout();
      if (!error.value) {
        router.push({ name: 'Welcome' });
      }
    };

    return { user, handleClick, userInfo };
  },
};
</script>

<style>
.navbar {
  grid-row: 1;
  grid-column: 1;
  background-color: #222222;
  padding: 0rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar p {
  font-size: 1.2rem;
  color: white;
  text-align: left;
}
.navbar p.display-name {
  font-weight: 700;
}

.navbar p.email {
  font-size: 0.8rem;
  color: #999;
}

.navbar button {
  color: white;

  padding: 0.5em 0.8em;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (min-width: 768px) {
  .navbar {
    width: calc(100vw - 4.5em);
    background-color: #333437;
    border-bottom: 1px solid #464749;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
    grid-row: 1;
    grid-column: 2/4;
    padding: 0;
  }

  .navbar p {
    font-size: 16px;
    color: white;
    text-align: center;
  }
  .navbar p.display-name {
    font-weight: 700;
  }

  .navbar p.email {
    font-size: 14px;
    color: #999;
  }

  .navbar button {
    padding: 8px 12px;
    color: white;
    font-size: 15px;
    font-weight: 500;
    margin-right: 1em;
  }
}
</style>
