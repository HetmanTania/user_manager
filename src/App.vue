<template>
 <the-header></the-header>
  <div class="container">
    <router-view></router-view>
    <message></message>
  </div>
</template>

<script>
import Message from './components/Message.vue';
import TheHeader from './components/TheHeader.vue';
export default {
  computed: {
    message() {
      return this.$store.getters.message;
    }
  },
  components: { TheHeader, Message }
}
</script>

<style>

</style>
