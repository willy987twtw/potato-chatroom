<template>
  <aside class="sidebar">
    <div class="buttons">
      <span
        class="material-icons"
        :class="{ active: activeEl == 'friendList' }"
        @click="handleClick('friendList'), addActive('friendList')"
      >
        people
        <p>好友</p>
      </span>

      <span
        class="material-icons"
        :class="[
          activeEl == 'chatrooms' ? 'active' : '',
          document?.messageIsRead ? '' : 'new',
        ]"
        @click="
          handleClick('chatrooms');
          addActive('chatrooms');
        "
      >
        question_answer
        <p>聊天室</p>
      </span>
      <span
        class="material-icons"
        :class="{ active: activeEl == 'addFriends' }"
        @click="
          handleClick('addFriends');
          addActive('addFriends');
        "
      >
        person_add
        <p>加入好友</p>
      </span>
      <span
        class="material-icons"
        :class="[
          activeEl == 'friendRequests' ? 'active' : '',
          document?.requestIsRead ? '' : 'new',
        ]"
        @click="
          handleClick('friendRequests');
          addActive('friendRequests');
        "
      >
        group_add
        <p>好友邀請</p>
      </span>

      <span
        class="material-icons"
        :class="{ active: activeEl == 'aboutMe' }"
        @click="
          handleClick('aboutMe');
          addActive('aboutMe');
        "
        >manage_accounts
        <p>關於自己</p></span
      >
    </div>
  </aside>
</template>

<script>
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import getDocument from '@/composables/getDocument';
import useDocuments from '@/composables/useDocuments';
import getUser from '@/composables/getUser.js';

export default {
  setup() {
    const activeEl = ref();
    const router = useRouter();
    const { user } = getUser();
    const userId = user.value.uid;
    const { document } = getDocument('users', userId);

    const handleClick = params => {
      router.push({ name: 'Chatroom', params: { id: params } });
    };

    const addActive = el => {
      activeEl.value = el;
      if (el === 'chatrooms') {
        const { updateDoc } = useDocuments('users', userId);
        updateDoc({ messageIsRead: true });
      }

      if (el === 'friendRequests') {
        const { updateDoc } = useDocuments('users', userId);
        updateDoc({ requestIsRead: true });
      }
    };

    return {
      handleClick,
      activeEl,
      addActive,
      document,
    };
  },
};
</script>

<style>
.sidebar {
  background-color: #222222;
  grid-row: 3/4;
  grid-column: 1;
}

.sidebar .buttons {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0px 1em;
  justify-content: space-between;
}

.sidebar .material-icons {
  color: #777;
  font-size: 2rem;
  cursor: pointer;
  display: block;
}

.sidebar .material-icons p {
  font-size: 0.5rem;
}

.sidebar .material-icons:hover {
  color: #ddd;
}

.sidebar .material-icons.active {
  color: #eee;
}

.sidebar .material-icons.new {
  position: relative;
}

.sidebar .material-icons.new::after {
  content: 'NEW';
  color: white;
  font-size: 0.8rem;
  padding: 0.4rem 0.4em 0.5em 0.4em;
  border-radius: 0.5em;
  background-color: red;
  position: absolute;
  top: 1em;
  left: 1em;
  font-weight: 700;
  transform: scale(0.8);
}

@media (min-width: 768px) {
  .sidebar {
    height: 100vh;
    grid-row: 1/3;
    grid-column: 1;
  }

  .sidebar .buttons {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1.5rem;
    margin-top: 1em;
  }

  .sidebar .material-icons.new::after {
    padding: 0.2rem 0.4em 0.5em 0.4em;
    top: 0.9em;
    left: 0.7em;
  }
}
</style>
