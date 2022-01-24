<template>
  <div class="category">加入好友</div>

  <form @submit.enter.prevent="handleSubmit(userId)">
    <input placeholder="請輸入用戶ID" v-model="userId" />
    <span class="material-icons"> search </span>
  </form>

  <div class="userInfo">
    <div class="display-name" v-if="document">
      {{ document.displayName }}
    </div>

    <div class="error" v-if="error">
      {{ error }}
    </div>

    <button @click="handleClick(userId)" v-if="buttonText">
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { projectFirestore } from '@/firebase/config';
import useNestedCollection from '@/composables/useNestedCollection.js';
import getUser from '@/composables/getUser.js';
import { watchEffect } from '@vue/runtime-core';
import useDocuments from '@/composables/useDocuments';

export default {
  setup() {
    const userId = ref();
    const buttonText = ref();
    const document = ref();
    const error = ref();
    const userInfo = [];
    const userFriendList = [];
    const sendRequestList = [];
    const { user } = getUser();

    const handleSubmit = async id => {
      if (!id) return;

      id = id.trim();

      // 取得使用者寄出的好友邀請列表
      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .collection('sentRequests')
        .get()
        .then(res =>
          res.forEach(data => sendRequestList.push(data.data().userId))
        );

      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .collection('friendList')
        .get()
        .then(res => {
          res.forEach(doc => {
            userFriendList.push(doc.data().userId);
          });
        });

      const friendInfo = await projectFirestore
        .collection('users')
        .doc(id)
        .get()
        .then(doc => {
          return doc;
        });

      // 1) 使用者寄出好友邀請包含輸入之ID
      if (sendRequestList.includes(id)) {
        document.value = friendInfo.data();
        error.value = '您已寄出過邀請囉！請等待對方回覆';
        userId.value = '';
        sendRequestList.length = 0;
        userFriendList.length = 0;
        return;
      }

      // 2) 使用者好友名單包含輸入之ID
      if (userFriendList.includes(id)) {
        document.value = friendInfo.data();
        error.value = '你們已是好友囉！';
        userId.value = '';
        sendRequestList.length = 0;
        userFriendList.length = 0;
        return;
      }

      // 3) 輸入之ID為使用者之ID
      if (id === user.value.uid) {
        document.value = friendInfo.data();
        error.value = '這是您自己哦！';
        userId.value = '';
        sendRequestList.length = 0;
        userFriendList.length = 0;
        return;
      }

      if (friendInfo.exists) {
        error.value = '';
        buttonText.value = '加入';
        document.value = friendInfo.data();
        sendRequestList.length = 0;
        userFriendList.length = 0;
      } else {
        error.value = 'Oops...查無此ID';
        document.value = '';
        buttonText.value = '';
        userId.value = '';
        sendRequestList.length = 0;
        userFriendList.length = 0;
      }
    };

    // 新增好友按鈕

    const handleClick = async id => {
      const userRequest = {
        displayName: userInfo[0].displayName,
        userId: userInfo[0].userId,
      };

      const { updateDoc: updateUserInfo } = useDocuments('users', id);

      await useNestedCollection('users', id, 'friendRequests').addDocWithId(
        user.value.uid,
        userRequest
      );

      await useNestedCollection(
        'users',
        user.value.uid,
        'sentRequests'
      ).addDocWithId(id, { userId: id });

      await updateUserInfo({ requestIsRead: false });

      userId.value = '';
      document.value = '';
      buttonText.value = '';
      userInfo.length = 0;
    };

    watchEffect(async () => {
      if (!user.value) return;

      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .get()
        .then(doc => {
          userInfo.push(doc.data());
        });
    });

    return {
      userId,
      handleSubmit,
      document,
      error,
      buttonText,
      handleClick,
    };
  },
};
</script>

<style>
.addFriends {
  height: 100%;
}

.addFriends form {
  height: 4em;
  display: flex;
  position: relative;
  align-items: center;
}

.addFriends input {
  font-size: 1rem;
  background-color: #f5f5f5;
  width: calc(100% - 6em);
  height: 1.3em;
  padding: 0.3em 0.3em 0.3em 2em;
  outline: none;
  border: 0.1em solid #eceff2;
  border-radius: 0.3em;
  margin: 1em auto;
}

.addFriends .material-icons {
  font-size: 2rem;
  position: absolute;
  top: 0.5em;
  left: 0.9em;
  color: #333;
}

.addFriends .material-icons:hover {
  cursor: default;
}

.addFriends button {
  padding: 0.5em;
  width: 4em;
  font-size: 1rem;
}

.addFriends .userInfo {
  height: calc(100% - 5.6em);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.addFriends .display-name {
  font-size: 2rem;
}

@media (min-width: 768px) {
  .addFriends input {
    font-size: 0.8rem;
    width: calc(100% - 4em);
    padding: 0.3em 0.3em 0.3em 2em;
  }

  .addFriends .material-icons {
    font-size: 1.5rem;
    top: 1.25rem;
    left: 0.8rem;
  }

  .addFriends button {
    padding: 0.5em;
    width: 4em;
  }

  .addFriends .display-name {
    font-size: 1.5rem;
  }
}
</style>
