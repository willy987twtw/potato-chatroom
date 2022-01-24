<template>
  <form class="chat-form">
    <textarea
      placeholder="輸入訊息"
      v-model="message"
      @keypress.enter.prevent="width > 768 ? handleSubmit() : handleLineFeed()"
    ></textarea>
    <span class="material-icons" @click="handleSubmit"> send </span>
  </form>
</template>

<script>
import { ref } from '@vue/reactivity';
import { timestamp } from '@/firebase/config';
import getUser from '@/composables/getUser';
import { useRoute } from 'vue-router';
import { projectFirestore } from '@/firebase/config';
import { watchEffect } from '@vue/runtime-core';
import useNestedCollection from '@/composables/useNestedCollection.js';
import useDocuments from '@/composables/useDocuments';
import useBreakpoints from '@/composables/useBreakPoints';

export default {
  setup() {
    const { user } = getUser();
    const message = ref('');
    const route = useRoute();
    const userChange = ref(false);
    const friendId = ref();
    const userId = ref(user.value.uid);
    const chatroomList = [];
    const { width } = useBreakpoints();
    const placeholder = ref('');
    let sharedChatroom = useNestedCollection(
      'chatrooms',
      route.params.id,
      'messages'
    );

    const getFriendChatroomInfo = async () => {
      await projectFirestore
        .collection('users')
        .doc(friendId.value)
        .collection('chatrooms')
        .doc(route.params.id)
        .get()
        .then(res =>
          chatroomList.push({
            lastRead: res.data().lastRead.seconds,
            lastInteractAt: res.data().lastInteractAt.seconds,
            isActive: res.data().isActive,
          })
        );
    };

    watchEffect(async () => {
      if (route.params.id) {
        sharedChatroom = await useNestedCollection(
          'chatrooms',
          route.params.id,
          'messages'
        );
        userChange.value = true;
        console.log(userChange.value);
      }
    });

    const handleLineFeed = () => {
      console.log('換行');
      message.value = message.value + '\n';
    };

    const handleSubmit = async () => {
      console.log('hi');
      // 取得共享聊天室資訊
      const chatroomInfo = await projectFirestore
        .collection('chatrooms')
        .doc(route.params.id)
        .get()
        .then(doc => {
          return doc.data().usersId;
        });

      chatroomInfo[0] === user.value.uid
        ? (friendId.value = chatroomInfo[1])
        : (friendId.value = chatroomInfo[0]);

      // 好友、使用者個別聊天室資訊
      const userChatroom = await projectFirestore
        .collection('users')
        .doc(userId.value)
        .collection('chatrooms')
        .doc(route.params.id);

      const friendChatroom = await projectFirestore
        .collection('users')
        .doc(friendId.value)
        .collection('chatrooms')
        .doc(route.params.id);

      // 對話資訊
      const chat = {
        userId: userId.value,
        isRead: false,
        message: message.value,
        createdAt: timestamp(),
      };

      // 清空對話欄
      message.value = '';

      //若對話欄無文字，則直接return
      if (!chat.message) return;

      //傳送對話資訊至共享聊天室
      await sharedChatroom.addDoc(chat);

      // 更新使用者個別聊天室資訊
      await userChatroom.update({
        dialog: chat.message,
        lastInteractAt: timestamp(),
        isDisplay: true,
        ...(userChange.value && { chatroomOrder: timestamp() }),
      });

      // 更新好友個別聊天室資訊
      await friendChatroom.update({
        dialog: chat.message,
        lastInteractAt: chat.createdAt,
        isDisplay: true,
        ...(userChange.value && { chatroomOrder: chat.createdAt }),
      });
      userChange.value = false;

      // 傳送訊息後將好友個別聊天室的狀態更改為未讀
      const { updateDoc: updateFriendChatroom } = useNestedCollection(
        'users',
        friendId.value,
        'chatrooms'
      );

      await getFriendChatroomInfo();

      //若再好友個別聊天室尚未開啟時，傳送訊息，會在對方的頁面上顯示未讀
      await updateFriendChatroom(route.params.id, {
        ...(!chatroomList[0].isActive && {
          isRead: chatroomList[0].lastRead > chatroomList[0].lastInteractAt,
        }),
        lastRead: timestamp(),
      });

      const { updateDoc: updateUserInfo } = useDocuments(
        'users',
        friendId.value
      );

      await updateUserInfo({
        ...(!chatroomList[0].isActive && {
          messageIsRead: false,
        }),
      });

      chatroomList.length = 0;
    };
    return { message, handleSubmit, width, handleLineFeed, placeholder };
  },
};
</script>

<style>
.single-chatroom .chat-form {
  text-align: left;
  border-top: 1px solid #464749;
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  overflow: hidden;
  padding: 0.8rem;
  gap: 0.4em;
}

.single-chatroom .chat-form textarea::-webkit-scrollbar {
  display: none;
}
.single-chatroom .chat-form textarea {
  height: 2.75em;
  font-size: 1rem;
  width: 100%;
  background-color: inherit;
  overflow: scroll;

  color: white;
  border: none;
  outline: none;
  resize: none;
}

.single-chatroom .material-icons {
  color: #4e72fe;
  align-self: center;
  cursor: pointer;
  font-size: 1.7rem;
  transform: scale(1.2, 1.44);
}

@media (min-width: 768px) {
  .single-chatroom .chat-form {
    height: 6rem;
  }

  .single-chatroom .chat-form textarea {
    height: auto;
    background-color: inherit;
  }

  .single-chatroom .material-icons {
    display: none;
  }
}
</style>
