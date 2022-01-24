<template>
  <main
    :class="{ showSingleChatroom: showSingleChatroom }"
    class="single-chatroom"
  >
    <div v-if="routeParams === 'friendList'" class="reminder">
      <p>點選好友<br />進入專屬聊天室</p>
    </div>

    <div v-else-if="routeParams === 'addFriends'" class="reminder">
      <p>輸入用戶ID<br />並加入好友</p>
    </div>

    <div v-else-if="routeParams === 'friendRequests'" class="reminder">
      <p>接受/刪除好友邀請</p>
    </div>

    <div v-else-if="routeParams === 'aboutMe'" class="reminder">
      <p>個人資料設定</p>
    </div>

    <div v-else-if="routeParams === 'chatrooms'" class="reminder">
      <p>點選左方聊天室 <br />方可開始聊天</p>
    </div>

    <div v-else class="chat-window">
      <displayName />
      <messages />
      <newChatForm />
    </div>
  </main>
</template>

<script>
import { ref } from '@vue/reactivity';
import displayName from '@/components/SingleChatroom/displayName.vue';
import messages from '@/components/SingleChatroom/messages.vue';
import newChatForm from '@/components/SingleChatroom/newChatForm.vue';
import { useRoute } from 'vue-router';
import { watchEffect } from '@vue/runtime-core';
import useBreakpoints from '@/composables/useBreakPoints';
export default {
  components: {
    displayName,
    messages,
    newChatForm,
  },

  setup() {
    const routeParams = ref('');
    const route = useRoute();
    const showSingleChatroom = ref(false);
    const { width } = useBreakpoints();

    const pages = [
      'friendList',
      'chatrooms',
      'addFriends',
      'friendRequests',
      'aboutMe',
    ];

    watchEffect(() => {
      routeParams.value = route.params.id;
      if (width.value < 768) {
        if (!pages.includes(routeParams.value)) {
          showSingleChatroom.value = true;
        } else {
          showSingleChatroom.value = false;
        }
      } else {
        showSingleChatroom.value = false;
      }
    });

    return { routeParams, showSingleChatroom };
  },
};
</script>

<style>
.single-chatroom {
  background-color: #333437;
  grid-row: 2;
  grid-column: 2;
  color: white;
  height: 100%;
  z-index: 2;
}

.single-chatroom.showSingleChatroom {
  grid-column: 1;
}

.single-chatroom .chat-window {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.single-chatroom .reminder {
  height: 100%;
  display: flex;
}

.single-chatroom .reminder p {
  color: #888;
  font-size: 1.5rem;
  font-weight: 700;
  height: 100vh - 8rem;
  margin: auto auto;
}

@media (min-width: 768px) {
  .single-chatroom {
    grid-row: 2;
    grid-column: 3;
    z-index: 1;
  }
}
</style>
