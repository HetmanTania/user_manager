<template>
    <user-form @doAction="doAction" :action="action" :user="user"></user-form>
</template>

<script>
import UserForm from '../components/UserForm.vue';
export default {
  methods: {
    doAction(user, action) {
        const nameMethod = this.actionMap[action];
        return this[nameMethod](user);
    },
    creatUser(user) {
      this.$store.dispatch("createUser", {...user});
    },
    updateUser(user) {
      return this.$store.dispatch("updateUser", user);
    },
    removeUser(user) {
      this.$store.dispatch("removeUser", user.id);
    },
  },
  data() {
    return {
        action: "create",
        actionMap: {
            "userCreate": "creatUser",
            "userRemove": "removeUser",
            "userUpdate": "updateUser",
        },
        user: {
            id: "",
            firstName: "",
            lastName: "",
            date: "",
            phone: "",
            email: "",
        }
    }
  },
  components: { UserForm },
};
</script>

<style>
</style>