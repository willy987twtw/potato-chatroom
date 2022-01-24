<template>
  <p class="category">好友邀請</p>

  <div
    v-if="
      routeParams !== 'friendList' &&
      routeParams !== 'addFriends' &&
      routeParams !== 'chatrooms' &&
      routeParams !== 'aboutMe' &&
      requests?.length > 0
    "
  >
    <div class="request" v-for="request in requests" :key="request.userId">
      <p class="display-name">{{ request.displayName }}</p>
      <div class="buttons">
        <button class="delete" @click="handleDelete(request.userId)">
          刪除
        </button>
        <button
          class="accept"
          @click="handleAccept(request.userId, request.displayName)"
        >
          接受
        </button>
      </div>
    </div>
  </div>

  <div v-else-if="requests?.length === 0" class="reminder">
    目前尚無好友邀請
  </div>

  <div v-else class="reminder"><Loader /></div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { watch } from '@vue/runtime-core';
import { timestamp } from '@/firebase/config.js';
import { projectFirestore } from '@/firebase/config';
import Loader from '@/components/Loader.vue';

import getNestedCollection from '@/composables/getNestedCollection.js';
import useNestedCollection from '@/composables/useNestedCollection.js';
import useCollection from '@/composables/useCollection';
import getUser from '@/composables/getUser.js';
import useDocuments from '@/composables/useDocuments';

export default {
  components: { Loader },

  setup() {
    const randomstring = require('randomstring');
    const route = useRoute();
    const routeParams = ref(route.params.id);
    const userInfo = [];
    const friendInfo = [];
    const { user } = getUser();
    const userId = user.value.uid;
    const { updateDoc: updateUserInfo } = useDocuments('users', userId);

    const { documents } = getNestedCollection(
      'users',
      user.value.uid,
      'friendRequests'
    );

    const requests = computed(() => {
      if (documents.value) {
        updateUserInfo({ requestIsRead: true });
        return documents.value;
      }
    });

    watch(route, async () => {
      routeParams.value = route.params.id;
    });

    // 刪除好友按鈕
    const handleDelete = async id => {
      // 刪除收到的好友邀請
      useNestedCollection('users', user.value.uid, 'friendRequests').deleteDoc(
        id
      );
      // 刪除寄出的好友邀請
      useNestedCollection('users', id, 'sentRequests').deleteDoc(
        user.value.uid
      );
    };

    // 接受好友按鈕
    const handleAccept = async id => {
      const randomId = await randomstring.generate(20);

      // 更新使用者資料
      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .get()
        .then(doc => {
          userInfo.push(doc.data());
        });

      // 更新好友資料
      await projectFirestore
        .collection('users')
        .doc(id)
        .get()
        .then(doc => {
          friendInfo.push(doc.data());
        });

      // 新增共用聊天室及其資料
      const chatroomData = {
        chatroomId: randomId,
        usersId: [id, user.value.uid],
      };
      useCollection('chatrooms').addDocWithId(randomId, chatroomData);

      // 邀請者個人聊天室資料
      const inviterChatroomData = {
        chatroomId: randomId,
        displayName: friendInfo[0].displayName,
        friendId: friendInfo[0].userId,
        lastInteractAt: timestamp(),
        chatroomOrder: timestamp(),
        lastRead: timestamp(),
        isActive: false,
        isDisplay: false,
        isRead: true,
      };

      // 邀請者好友列表資料
      const inviterFriendListData = {
        chatroomId: randomId,
        userId: friendInfo[0].userId,
        displayName: friendInfo[0].displayName,
        statusMessage: friendInfo[0].statusMessage,
      };

      // 接收者個人聊天室資料
      const reciverChatroomData = {
        chatroomId: randomId,
        lastInteractAt: timestamp(),
        chatroomOrder: timestamp(),
        lastRead: timestamp(),
        displayName: userInfo[0].displayName,
        friendId: userInfo[0].userId,
        isDisplay: false,
        isRead: true,
        isActive: false,
      };

      // 接收者好友列表資料
      const reciverFriendListData = {
        chatroomId: randomId,
        userId: userInfo[0].userId,
        displayName: userInfo[0].displayName,
        statusMessage: userInfo[0].statusMessage,
      };

      // 新增個人聊天室doc（接收者）
      await useNestedCollection(
        'users',
        userInfo[0].userId,
        'chatrooms'
      ).addDocWithId(randomId, inviterChatroomData);

      // 新增個人聊天室doc（邀請者）
      await useNestedCollection(
        'users',
        friendInfo[0].userId,
        'chatrooms'
      ).addDocWithId(randomId, reciverChatroomData);

      // 新增好友列表doc（邀請者）
      await useNestedCollection(
        'users',
        userInfo[0].userId,
        'friendList'
      ).addDocWithId(friendInfo[0].userId, inviterFriendListData);

      // 新增好友列表doc（接收者）
      await useNestedCollection(
        'users',
        friendInfo[0].userId,
        'friendList'
      ).addDocWithId(userInfo[0].userId, reciverFriendListData);

      // 刪除寄出的好友邀請
      await useNestedCollection(
        'users',
        userInfo[0].userId,
        'friendRequests'
      ).deleteDoc(friendInfo[0].userId);

      // 刪除收到的好友邀請
      await useNestedCollection(
        'users',
        friendInfo[0].userId,
        'sentRequests'
      ).deleteDoc(userInfo[0].userId);

      friendInfo.length = 0;
      userInfo.length = 0;
    };

    return { routeParams, requests, handleDelete, handleAccept };
  },
};
</script>

<style>
.friend-requests .request:hover {
  background-color: #3d3e40;
}

.friend-requests .request {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.friend-requests button {
  margin-right: 1em;
  padding: 0.5em 1em;
}

.friend-requests .delete {
  background-color: #333;
  border: 1px solid #bbb;
}

.friend-requests .delete:hover {
  background-color: #444;
}

.friend-requests .display-name {
  font-size: 1.2rem;
  width: 6rem;
  text-align: left;
  padding: 0px 1em 0px 1em;
  font-weight: 700;
}
.friend-requests .reminder {
  color: #ddd;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 768px) {
  .friend-requests .reminder {
    margin-top: 0.5rem;
    color: #ddd;
    font-size: 0.5rem;
  }
}
</style>
