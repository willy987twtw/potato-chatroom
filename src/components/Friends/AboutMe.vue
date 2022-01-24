<template>
  <div class="category">我的資料</div>

  <div class="user-infos" v-if="userInfo">
    <div class="user-info display-name">
      顯示名稱
      <p @click="(showNameInput = !showNameInput), (showStatusInput = false)">
        {{ userInfo.displayName }}
        <span class="material-icons">edit</span>
      </p>

      <form @submit.enter.prevent="handleSubmitName">
        <input
          type="text"
          v-if="showNameInput"
          v-model="name"
          placeholder="請輸入新名稱(十字以內)"
          maxlength="10"
        />
      </form>
    </div>

    <div class="user-info status-message">
      狀態消息
      <p @click="(showStatusInput = !showStatusInput), (showNameInput = false)">
        {{ userInfo.statusMessage }}
        <span class="material-icons"> edit </span>
      </p>
      <form @submit.enter.prevent="handleSubmitStatus">
        <input
          type="text"
          v-if="showStatusInput"
          v-model="statusMessage"
          placeholder="請輸入新狀態(二十字以內)"
          maxlength="20"
        />
      </form>
    </div>

    <div class="user-info user-id">
      用戶ID
      <p>{{ user.uid }}</p>
    </div>

    <div class="user-info email">
      電子郵件帳號
      <p>{{ user.email }}</p>
    </div>

    <div class="user-info developer">
      此程式開發者ID（歡迎加我好友）
      <p>pvzcHUVscLOjoAOK0eQQxHx3qOV2</p>
    </div>
  </div>
  <div v-else class="reminder"><Loader /></div>
</template>

<script>
import { projectFirestore } from '@/firebase/config';
import getUser from '@/composables/getUser.js';
import getDocument from '@/composables/getDocument.js';
import useDocuments from '@/composables/useDocuments.js';
import useNestedCollection from '@/composables/useNestedCollection.js';
import { ref } from '@vue/reactivity';
import Loader from '@/components/Loader.vue';

export default {
  components: { Loader },

  setup() {
    const { user } = getUser();
    const { document: userInfo } = getDocument('users', user.value.uid);
    const { updateDoc } = useDocuments('users', user.value.uid);
    const showNameInput = ref(false);
    const showStatusInput = ref(false);
    const friendList = [];
    const chatroomList = [];
    const sendRequestList = [];
    const userId = user.value.uid;
    const name = ref('');
    const statusMessage = ref('');

    const getUserFriendList = async () => {
      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .collection('friendList')
        .get()
        .then(res => res.forEach(data => friendList.push(data.data().userId)));
    };

    const getUserChatroomList = async () => {
      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .collection('chatrooms')
        .get()
        .then(res =>
          res.forEach(data =>
            chatroomList.push([data.data().friendId, data.data().chatroomId])
          )
        );
    };

    const getUserSendRequestList = async () => {
      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .collection('sentRequests')
        .get()
        .then(res =>
          res.forEach(data => sendRequestList.push(data.data().userId))
        );
    };

    // 更新使用者名稱

    const handleSubmitName = async () => {
      // 若無輸入名稱，則return
      if (!name.value) {
        showNameInput.value = false;
        return;
      }

      // 更新使用者資料
      updateDoc({ displayName: name.value });
      showNameInput.value = false;

      // 更新使用者好友之個人資料
      await getUserFriendList();
      friendList.forEach(friendId => {
        const { updateDoc } = useNestedCollection(
          'users',
          friendId,
          'friendList'
        );
        updateDoc(user.value.uid, { displayName: name.value });
      });

      // 更新使用者好友之聊天室資料
      await getUserChatroomList();
      chatroomList.forEach(friendInfo => {
        const { updateDoc } = useNestedCollection(
          'users',
          friendInfo[0],
          'chatrooms'
        );
        updateDoc(friendInfo[1], { displayName: name.value });
      });

      // 更新使用者好友之好友邀請資料
      await getUserSendRequestList();
      sendRequestList.forEach(sendRequest => {
        const { updateDoc } = useNestedCollection(
          'users',
          sendRequest,
          'friendRequests'
        );
        updateDoc(user.value.uid, { displayName: name.value });
      });

      name.value = '';
      friendList.length = 0;
      chatroomList.length = 0;
      sendRequestList.length = 0;
    };

    // 更新使用者狀態
    const handleSubmitStatus = async () => {
      //若沒有輸入狀態，則return
      if (!statusMessage.value) {
        showStatusInput.value = false;
        return;
      }

      // 更新使用者資料
      updateDoc({ statusMessage: statusMessage.value });
      showStatusInput.value = false;

      // 更新使用者好友之個人資料
      await getUserFriendList();
      friendList.forEach(friendId => {
        const { updateDoc } = useNestedCollection(
          'users',
          friendId,
          'friendList'
        );
        updateDoc(userId, { statusMessage: statusMessage.value });
      });

      statusMessage.value = '';
      friendList.length = 0;
    };

    return {
      user,
      userInfo,
      name,
      statusMessage,
      showNameInput,
      showStatusInput,
      handleSubmitName,
      handleSubmitStatus,
    };
  },
};
</script>

<style>
.about-me .user-infos {
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 5px 15px;
  color: #aaa;
}

.about-me .user-infos p {
  color: #ddd;
  margin: 0.2em 0px;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 3px 0px 0px 0px;
  display: flex;
  align-items: center;
}

.about-me .user-infos .user-info {
  border-bottom: 1px solid #555;
  padding: 0.8em 0.4em;
}

.about-me .user-infos .display-name p:hover,
.about-me .user-infos .status-message p:hover {
  color: white;
  cursor: pointer;
}

.about-me .user-infos .user-info .material-icons {
  font-size: 1rem;
  margin-left: 0.5em;
}

.about-me .user-infos .user-info input {
  margin-top: 5px;
  font: 1rem;
  outline: none;
  padding: 0.5em 0.8em;
  width: 10rem;
}

.about-me .reminder {
  color: #ddd;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .about-me .user-infos p {
    margin: 0.1em 0px;
    font-size: 0.9rem;
  }

  .about-me .user-infos .user-info {
    border-bottom: 1px solid #555;
    padding: 1em 0em;
  }

  .about-me .user-infos .display-name p:hover,
  .about-me .user-infos .status-message p:hover {
    color: white;
    cursor: pointer;
  }

  .about-me .user-infos .user-info .material-icons {
    font-size: 1rem;
    margin-left: 0.3em;
  }

  .about-me .user-infos .user-info input {
    margin-top: 0.4em;
    outline: none;
    padding: 0.3em 0.4em;
  }

  .about-me .reminder {
    color: #ddd;
    font-size: 0.5rem;
  }
}
</style>
