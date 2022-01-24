<template>
  <section class="frineds">
    <div v-if="routeParams === 'friendList'" class="friend-list">
      <FriendList />
    </div>

    <div v-if="routeParams === 'addFriends'" class="addFriends">
      <AddFriendList />
    </div>

    <div v-if="routeParams === 'friendRequests'" class="friend-requests">
      <FriendRequestList />
    </div>

    <div v-if="routeParams === 'aboutMe'" class="about-me">
      <AboutMe />
    </div>

    <ChatroomList />
  </section>
</template>

<script>
import AboutMe from '@/components/Friends/AboutMe.vue';
import ChatroomList from '@/components/Friends/ChatroomList.vue';
import FriendList from '@/components/Friends/FriendList.vue';
import AddFriendList from '@/components/Friends/AddFriendForm.vue';
import FriendRequestList from '@/components/Friends/FriendRequestList.vue';
import SingleChatroom from '@/components/SingleChatroom';
import { ref } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { watch } from '@vue/runtime-core';
import useNestedCollection from '@/composables/useNestedCollection.js';
import getUser from '@/composables/getUser.js';

export default {
  components: {
    SingleChatroom,
    FriendList,
    ChatroomList,
    AddFriendList,
    FriendRequestList,
    AboutMe,
  },

  setup() {
    const route = useRoute();
    const routeParams = ref(route.params.id);
    const { user } = getUser();
    const userId = user.value.uid;

    watch(route, async () => {
      toggleActiveChatroom(routeParams.value);
      routeParams.value = route.params.id;
    });

    const toggleActiveChatroom = async params => {
      // if (
      //   routeParams.value !== 'addFriends' &&
      //   routeParams.value !== 'friendList' &&
      //   routeParams.value !== 'chatrooms' &&
      //   routeParams.value !== 'friendRequests' &&
      //   routeParams.value !== 'aboutMe'
      // ) {
      //   const { updateDoc: chatroomInfo } = useNestedCollection(
      //     'users',
      //     userId,
      //     'chatrooms'
      //   );
      //   await chatroomInfo(params, { isActive: false });
      // }
    };

    return { routeParams };
  },
};
</script>

<style>
.category {
  font-size: 1rem;
  padding: 0.3em 0.5rem;
  font-weight: 500;
  text-align: left;
  background-color: #444;
  color: #ccc;
}

.frineds {
  grid-row: 2;
  grid-column: 1;
  background-color: #333437;
  color: white;
  overflow: scroll;
}

.frineds::-webkit-scrollbar {
  display: none;
}

.friend {
  width: 100%;
  background-color: inherit;
  text-align: left;
  cursor: pointer;
}

@media (min-width: 768px) {
  .category {
    padding: 0.5em 0.5rem;
    font-size: 0.7rem;
  }

  .frineds {
    grid-row: 2/3;
    grid-column: 2;
    border-right: 1px solid #464749;
  }
}
</style>
