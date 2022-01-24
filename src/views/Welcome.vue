<template>
  <div welcom-form>
    <div class="header">
      <img class="logo" src="@/assets/logo.png" alt="potato chatroom" />
      <h1>馬鈴薯聊天室</h1>
    </div>

    <div class="welcome container">
      <div class="login-form" v-if="showLogin">
        <h3>登入帳號</h3>
        <loginForm @login="enterChatroom" />
        <p>還沒有帳號？ <span @click="showLogin = false">註冊帳號</span></p>
      </div>

      <div class="signup-form" v-else>
        <h3>註冊帳號</h3>
        <SignupForm />
        <p>已經有帳號了？ <span @click="showLogin = true">登入帳號</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import LoginForm from '../components/LoginForm.vue';
import SignupForm from '../components/SignupForm.vue';
import { useRouter } from 'vue-router';
import getUser from '@/composables/getUser';
export default {
  components: { LoginForm, SignupForm, getUser },
  setup() {
    const showLogin = ref(true);
    const router = useRouter();
    const enterChatroom = () => {
      router.push({ name: 'Chatroom', params: { id: 'friendList' } });
    };

    return { showLogin, enterChatroom };
  },
};
</script>

<style>
.welcom-form {
  height: 100%;
  width: 100%;
}

.header {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 100px;
  width: 100px;
  background-size: contain;
}

h1 {
  font-size: 3rem;
  color: #fea634;
  margin-bottom: 0.5rem;
}

.welcome {
  background: #333437;
  border-radius: 1rem;
  width: 90%;
  margin: 0rem auto;
  display: flex;
  flex-direction: column;
}

.welcome h3 {
  display: block;
  color: white;
  font-size: 1.5rem;
  margin: 0.3em 0px;
}

.welcome p {
  margin: 0.8em 0px;
  color: white;
  font-size: 1em;
}

.welcome span {
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}

.welcome button {
  font-size: 1rem;
  margin-top: 0.5em;
  width: 100%;
}

@media (min-width: 768px) {
  h1 {
    color: #fea634;
  }

  .welcome {
    width: 500px;
  }

  .welcome span {
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
