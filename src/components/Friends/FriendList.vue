<template>
  <p class="category">自己</p>
  <div class="friend" v-if="userInfo">
    <div class="infos">
      <p class="display-name">{{ userInfo.displayName }}</p>
      <p class="statusMessage">{{ userInfo.statusMessage }}</p>
    </div>
  </div>

  <p class="category">好友列表</p>
  <div v-if="friendList?.length > 0">
    <div
      class="friend"
      v-for="friend in friendList"
      :key="friend.chatroomId"
      @click="handleClick(friend.chatroomId)"
    >
      <div class="infos">
        <p class="display-name">{{ friend.displayName }}</p>
        <p class="statusMessage">{{ friend.statusMessage }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="friendList?.length === 0" class="reminder">請先新增好友</div>
  <div v-else class="reminder"><Loader /></div>
</template>

<script>
import { useRouter } from 'vue-router';
import useNestedCollection from '@/composables/useNestedCollection.js';
import getNestedCollection from '@/composables/getNestedCollection.js';
import getUser from '@/composables/getUser.js';
import getDocument from '@/composables/getDocument.js';
import Loader from '@/components/Loader.vue';

export default {
  components: { Loader },
  setup() {
    const router = useRouter();
    const { user } = getUser();
    const userDisplayName = user.value.displayName;
    const { document: userInfo } = getDocument('users', user.value.uid);
    const { documents: friendList, error } = getNestedCollection(
      'users',
      user.value.uid,
      'friendList'
    );
    const userId = user.value.uid;
    const handleClick = async chatroomId => {
      if (!user.value) return;

      router.push({ name: 'Chatroom', params: { id: chatroomId } });

      const { updateDoc } = useNestedCollection(
        'users',
        user.value.uid,
        'chatrooms'
      );

      const updateChatroomDisplay = useNestedCollection(
        'users',
        user.value.uid,
        'chatrooms'
      ).updateDoc;

      await updateChatroomDisplay(chatroomId, { isDisplay: true });
      await updateDoc(chatroomId, { isActive: true });
    };
    return {
      handleClick,
      userDisplayName,
      userInfo,
      friendList,
      error,
      Loader,
    };
  },
};
</script>

<style>
.friend-list .friend {
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.friend-list .infos {
  padding: 0px 1em 0px 1em;
  justify-content: center;
  align-items: center;
}

.friend-list .friend:hover {
  background-color: #3d3e40;
}

.friend-list .friend .display-name {
  font-size: 1.2rem;
  font-weight: 700;
}

.friend-list .friend .statusMessage {
  font-size: 0.8rem;
  color: #999;
  line-height: 0.8rem;
  overflow: hidden;
}

.friend-list .reminder {
  height: 3rem;
  color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .friend-list .friend .statusMessage {
    height: 1.3rem;
    line-height: 1.3rem;
  }

  .friend-list .reminder {
    color: #ddd;
    font-size: 0.5rem;
  }
}
</style>
