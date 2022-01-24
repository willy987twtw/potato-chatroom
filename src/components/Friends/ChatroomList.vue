<template>
  <div
    class="chatrooms"
    v-if="
      routeParams !== 'friendList' &&
      routeParams !== 'addFriends' &&
      routeParams !== 'friendRequests' &&
      routeParams !== 'aboutMe'
    "
  >
    <div class="category">聊天室</div>
    <div v-if="formattedChatroomList?.length > 0">
      <div v-for="chatroom in formattedChatroomList" :key="chatroom.chatroomId">
        <div
          v-if="chatroom"
          class="friend"
          :class="{
            active: chatroom.isActive,
          }"
          @click="handleClick(chatroom?.chatroomId)"
        >
          <div class="infos">
            <p class="display-name">{{ chatroom.displayName }}</p>
            <p class="dialog">{{ chatroom.dialog }}</p>
          </div>
          <p class="lastInteractTime">{{ chatroom.lastInteractAt }}</p>
          <p :class="{ isRead: !chatroom.isRead }">
            {{ chatroom.isRead ? '' : '新訊息' }}
          </p>
        </div>
      </div>
    </div>
    <div class="reminder" v-else-if="formattedChatroomList?.length === 0">
      請點選好友，開啟專屬聊天室
    </div>
    <div v-else class="reminder"><Loader /></div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from '@vue/reactivity';
import { watchEffect } from '@vue/runtime-core';
import Loader from '@/components/Loader.vue';

import getNestedCollection from '@/composables/getNestedCollection.js';
import useNestedCollection from '@/composables/useNestedCollection.js';
import useDocuments from '@/composables/useDocuments';

import getUser from '@/composables/getUser.js';

import intlFormat from 'date-fns/intlFormat';
import fromUnixTime from 'date-fns/fromUnixTime';
import { projectFirestore } from '@/firebase/config';

export default {
  components: { Loader },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const routeParams = ref(route.params.id);
    const { user } = getUser();
    const timeArr = [];
    const userId = user.value.uid;
    const { updateDoc: updateUserInfo } = useDocuments('users', userId);

    let { documents } = getNestedCollection(
      'users',
      userId,
      'chatrooms',
      ['chatroomOrder', 'desc'],
      ['isDisplay', '==', true]
    );

    let formattedChatroomList = computed(() => {
      if (documents.value) {
        return documents.value.map(friend => {
          if (friend.lastInteractAt) {
            let time = intlFormat(fromUnixTime(friend.lastInteractAt), {
              hour: 'numeric',
              minute: 'numeric',
            });
            updateUserInfo({ messageIsRead: true });

            return { ...friend, lastInteractAt: time };
          } else {
            let time = intlFormat(fromUnixTime(new Date().getTime() / 1000), {
              hour: 'numeric',
              minute: 'numeric',
            });

            timeArr.length = 0;
            timeArr.push(time);
            updateUserInfo({ messageIsRead: true });

            return { ...friend, lastInteractAt: timeArr[0] };
          }
        });
      }
    });

    watchEffect(() => {
      routeParams.value = route.params.id;
    });

    const handleClick = async chatroomId => {
      await projectFirestore
        .collection('users')
        .doc(userId)
        .collection('chatrooms')
        .where('isActive', '==', true)
        ?.get()
        .then(res =>
          res.forEach(doc => {
            console.log('hi');

            doc.ref.update({ isActive: false });
          })
        );

      const { updateDoc } = useNestedCollection('users', userId, 'chatrooms');

      await router.push({ name: 'Chatroom', params: { id: chatroomId } });
      await updateDoc(routeParams.value, { isActive: true });
    };
    return { handleClick, routeParams, formattedChatroomList };
  },
};
</script>

<style>
.chatrooms .friend {
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.chatrooms .friend:hover,
.chatrooms .friend.active {
  background-color: #3d3e40;
}

.chatrooms .infos {
  padding: 0px 1em 0px 1em;
  justify-content: center;
  align-items: center;
}

.chatrooms .display-name {
  font-size: 1.2rem;
  font-weight: 700;
}

.chatrooms .dialog {
  font-size: 0.8rem;
  color: #999;
  max-height: 2.6rem;
  width: 15rem;
  line-height: 1.3rem;
  overflow: hidden;
}

.chatrooms .isRead {
  font-size: 0.8rem;
  color: white;
  background: #ee525c;
  overflow: hidden;
  font-weight: 700;
  padding: 0.3em;
  border-radius: 0.5em;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  text-align: center;
}

.chatrooms .lastInteractTime {
  font-size: 0.8rem;
  color: #777;
  position: absolute;
  right: 1rem;
  top: 1rem;
  word-break: keep-all;
}

.chatrooms .reminder {
  color: #ddd;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .chatrooms .dialog {
    width: 10rem;
  }

  .chatrooms .isRead {
    font-size: 0.5rem;
    width: 5em;
    color: white;
    padding: 0.35em;
    border-radius: 1.2em;
    right: 1.4em;
    bottom: 2em;
  }

  .chatrooms .lastInteractTime {
    right: 0.8em;
    top: 1.2em;
  }

  .chatrooms .reminder {
    color: #ddd;
    font-size: 0.5rem;
  }
}
</style>
