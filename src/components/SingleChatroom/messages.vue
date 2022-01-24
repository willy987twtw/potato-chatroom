<template>
  <div class="messages" v-if="routeParams" ref="messages">
    <div
      class="message"
      :class="{
        friendMessage: message.userId !== user?.uid,
        myMessage: message.userId === user?.uid,
      }"
      v-for="message in formattedMessages()"
      :key="message.id"
    >
      <div class="message-info">
        <p class="is-read">
          {{ message.isRead ? '已讀' : '' }}
        </p>
        <p class="created-at">
          {{ message.createdAt }}
        </p>
      </div>

      <p class="content">
        {{ message.message }}
      </p>
    </div>
  </div>
</template>

<script>
import getUser from '@/composables/getUser';
import useNestedCollection from '@/composables/useNestedCollection.js';
import getNestedCollection from '@/composables/getNestedCollection.js';

import intlFormat from 'date-fns/intlFormat';
import fromUnixTime from 'date-fns/fromUnixTime';

import { onUpdated, ref, watchEffect } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { timestamp } from '@/firebase/config';
import { projectFirestore } from '@/firebase/config';

export default {
  setup() {
    const { user } = getUser();
    const route = useRoute();
    const routeParams = ref('');
    const messages = ref(null);
    let chatroomMessages = ref('');
    const chatroomList = [];
    const userId = ref(user.value.uid);

    const getChatroomInfo = async () => {
      await projectFirestore
        .collection('users')
        .doc(user.value.uid)
        .collection('chatrooms')
        .doc(route.params.id)
        .get()
        .then(res =>
          chatroomList.push({
            lastRead: res.data().lastRead.seconds,
            lastInteractAt: res.data().lastInteractAt.seconds,
          })
        );
    };

    const formattedMessages = () => {
      if (chatroomMessages.value) {
        return chatroomMessages.value.map(msg => {
          let time = intlFormat(fromUnixTime(msg.createdAt), {
            hour: 'numeric',
            minute: 'numeric',
          });

          projectFirestore
            .collection('chatrooms')
            .doc(routeParams.value)
            .collection('messages')
            .where('isRead', '==', false)
            .where('userId', '!=', userId.value)
            .get()
            .then(res => {
              res.forEach(doc => {
                doc.ref.update({
                  isRead: true,
                });
              });
            });

          return { ...msg, createdAt: time };
        });
      }
    };

    watchEffect(async () => {
      if (!user.value) return;

      if (
        route.params.id === 'friendList' ||
        route.params.id === 'addFriends' ||
        route.params.id === 'friendRequests' ||
        route.params.id === 'chatrooms' ||
        route.params.id === 'aboutMe' ||
        !route.params.id
      )
        return;
      routeParams.value = route.params.id;

      chatroomMessages = getNestedCollection(
        'chatrooms',
        routeParams.value,
        'messages',
        ['createdAt']
      ).documents;

      // 載入聊天室，聊天室狀態變更成已讀
      const { updateDoc } = useNestedCollection(
        'users',
        user.value.uid,
        'chatrooms'
      );

      // 載入聊天室，已讀所有訊息
      await projectFirestore
        .collection('chatrooms')
        .doc(routeParams.value)
        .collection('messages')
        .where('isRead', '==', false)
        .where('userId', '!=', userId.value)
        .get()
        .then(res => {
          res.forEach(doc => {
            doc.ref.update({
              isRead: true,
            });
          });
        });

      await getChatroomInfo();
      await updateDoc(routeParams.value, {
        isRead: true,
        lastRead: timestamp(),
      });
    });

    onUpdated(() => {
      if (messages.value) {
        messages.value.scrollTop = messages.value.scrollHeight;
      }
    });

    return { user, formattedMessages, routeParams, messages };
  },
};
</script>

<style>
.messages {
  padding: 0.8em;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
}

.messages::-webkit-scrollbar {
  display: none;
}

.messages .message {
  height: auto;
  max-width: 22em;
  font-size: 1rem;
  overflow: visible;
  word-break: break-all;
  word-wrap: break-word;
  display: flex;
  padding: 0.4em 0em;
  align-items: flex-end;
}

.messages .message.myMessage {
  align-self: flex-end;
}

.messages .message.friendMessage {
  align-self: flex-start;
  flex-direction: row-reverse;
}

.messages .message.myMessage .content {
  background: #fea634;
  width: auto;
  color: #444;
  padding: 0.5em;
  margin: 0px 0px 0px 0.5em;
  text-align: left;
}

.messages .message.friendMessage .content {
  background: #444;
  width: auto;
  color: white;
  padding: 0.5em;
  margin: 0px 0.5em 0px 0px;
  text-align: left;
}

.messages .message.friendMessage .content {
  background: #444;
  width: auto;
  color: white;
}

.messages .message .content {
  border-radius: 0.6em;
}

.messages .message.myMessage .is-read {
  color: #777;
  font-size: 0.6rem;
}

.messages .message.friendMessage .is-read {
  display: none;
}

.messages .created-at {
  color: #777;
  font-size: 0.6em;
  word-break: keep-all;
  text-align: right;
}

.messages .message-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
}
</style>
