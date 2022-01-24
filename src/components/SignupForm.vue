<template>
  <form @submit.prevent="handleSubmit">
    <div class="inputs">
      <input
        type="text"
        required
        placeholder="暱稱 (最多10字，日後可修改)"
        v-model="displayName"
        autocomplete="off"
        maxlength="10"
      />
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
    <button v-if="!isPending">註冊</button>
    <button v-if="isPending" disabled>註冊中...</button>
  </form>
</template>

<script>
import { ref } from '@vue/reactivity';
import useSignup from '@/composables/useSignup';
import useCollection from '@/composables/useCollection';
import useNestedCollection from '@/composables/useNestedCollection';

import getUser from '@/composables/getUser';
import { useRouter } from 'vue-router';
import useDocuments from '@/composables/useDocuments';

export default {
  components: { useCollection },
  setup() {
    const email = ref('');
    const password = ref('');
    const displayName = ref('');
    const { error, signup, isPending } = useSignup();
    const { addDocWithId } = useCollection('users');
    const { user } = getUser();
    const router = useRouter();

    const handleSubmit = async () => {
      await signup(email.value, password.value, displayName.value);

      if (!error.value) {
        await addDocWithId(user.value.uid, {
          displayName: user.value.displayName,
          userId: user.value.uid,
          statusMessage: '尚未設定狀態',
          requestIsRead: true,
          messageIsRead: true,
        });

        const { addDocWithId: friendRequests } = useNestedCollection(
          'users',
          user.value.uid,
          'friendRequests'
        );

        const { addDocWithId: sentRequests } = useNestedCollection(
          'users',
          'pvzcHUVscLOjoAOK0eQQxHx3qOV2',
          'sentRequests'
        );

        const { updateDoc: updateUserInfo } = useDocuments(
          'users',
          user.value.uid
        );

        router.push({ name: 'Chatroom', params: { id: 'friendList' } });

        await updateUserInfo({ requestIsRead: false });

        await friendRequests('pvzcHUVscLOjoAOK0eQQxHx3qOV2', {
          displayName: '製作人小汪',
          userId: 'pvzcHUVscLOjoAOK0eQQxHx3qOV2',
        });

        await sentRequests(user.value.uid, { userId: user.value.uid });
      }
    };

    return {
      email,
      password,
      handleSubmit,
      displayName,
      error,
      signup,
      isPending,
    };
  },
};
</script>

<style>
.signup-form {
  width: 90%;
  margin: 0rem auto;
}

.signup-form .inputs {
  width: 100%;
  border: 1px solid #6c6c6c;
  margin: 0px auto;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5em;
}

.signup-form .inputs :last-child {
  border-bottom: none;
}

.signup-form input {
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
  .signup-form {
    width: 70%;
  }
}
</style>
