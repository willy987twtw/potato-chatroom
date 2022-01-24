<template>
  <form @submit.prevent="handleSubmit">
    <div class="inputs">
      <input
        type="email"
        required
        placeholder="電子郵件帳號"
        v-model="email"
        autocomplete="off"
      />
      <input
        type="password"
        required
        placeholder="密碼"
        v-model="password"
        autocomplete="off"
      />
    </div>
    <div class="error">{{ error }}</div>
    <button v-if="!isPending">登入</button>
    <button v-if="isPending" disabled>登入中...</button>
  </form>
</template>

<script>
import { ref } from '@vue/reactivity';
import useLogin from '@/composables/useLogin';
import getUser from '@/composables/getUser';
import useDocuments from '@/composables/useDocuments';
export default {
  components: { useLogin, getUser, useDocuments },
  setup(props, context) {
    const email = ref('');
    const password = ref('');
    const { error, login, isPending } = useLogin();
    const { user } = getUser();

    const handleSubmit = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        context.emit('login');
      }
    };

    return { email, password, handleSubmit, error, isPending };
  },
};
</script>

<style>
.login-form {
  width: 90%;
  margin: 0rem auto;
}

.login-form .inputs {
  width: 100%;
  border: 1px solid #6c6c6c;
  margin: 0px auto;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5em;
}

.inputs :last-child {
  border-bottom: none;
}

.login-form input {
  font-size: 1rem;
  background-color: inherit;
  color: white;
  padding: 1em 0.6em;
  border: none;
  border-radius: 0rem;
  border-bottom: 0.1em solid #6c6c6c;
  outline: none;
}

@media (min-width: 768px) {
  .login-form {
    width: 70%;
  }
}
</style>
