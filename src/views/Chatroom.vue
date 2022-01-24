<template>
  <div class="chatroom">
    <Navbar />
    <Sidebar />
    <Friends />
    <SingleChatroom />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Friends from '@/components/Friends';
import SingleChatroom from '@/components/SingleChatroom';

export default {
  props: ['id'],
  components: { Navbar, Sidebar, Friends, SingleChatroom },
  setup() {},
};
</script>

<style>
.chatroom {
  display: grid;
  grid-template-rows: 4rem calc(100% - 8rem) 4rem;
  grid-template-columns: 100vw 100vw;
  overflow: hidden;
  height: 100%;
}

@media (min-width: 768px) {
  .chatroom {
    grid-template-rows: 4em calc(100% - 4rem);
    grid-template-columns: 4.5em 18em auto;
  }
}
</style>
