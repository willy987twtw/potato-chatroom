<template>
  <div class="displayName" v-if="formattedChatroomList">
    <div v-for="chatroom in formattedChatroomList" :key="chatroom.chatroomId">
      <p>{{ chatroom.displayName }}</p>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
import getNestedCollection from '@/composables/getNestedCollection.js';
import getUser from '@/composables/getUser.js';
import { computed } from '@vue/reactivity';

export default {
  setup() {
    const { user } = getUser();

    let chatroomData = getNestedCollection(
      'users',
      user.value.uid,
      'chatrooms',
      '',
      ['isActive', '==', true]
    ).documents;

    let formattedChatroomList = computed(() => {
      if (chatroomData.value?.length > 0) {
        return chatroomData.value.map(chatroom => {
          return chatroom;
        });
      }
    });

    return { formattedChatroomList };
  },
};
</script>

<style>
.single-chatroom .displayName {
  text-align: left;
  padding: 0.5em 0.5em;
  border-bottom: 1px solid #464749;
  font-size: 1.5rem;
  font-weight: 900;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .single-chatroom .displayName {
    padding: 0.8rem;
    font-size: 1.5rem;
    font-weight: 900;
  }
}
</style>
