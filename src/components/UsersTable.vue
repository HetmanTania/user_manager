<template>
 <the-loader v-if="isLoad"></the-loader>
  <div v-else class="table-container is-flex is-flex-direction-column">
    <router-link :to="{name: 'userCreate', params: { action: 'create'}}" class="button is-primary"> Добавить пользователя</router-link>
    <table class="table table is-fullwidth ">
      <thead>
        <tr>
          <td>#</td>
          <td @click="setSortValue({nameKey: 'firstName', isReverse: !this.sortValue.isReverse})">Имя</td>
          <td @click="setSortValue({nameKey: 'lastName', isReverse: !this.sortValue.isReverse})">Фамилия</td>
          <td @click="setSortValue({nameKey: 'date', isReverse: !this.sortValue.isReverse})">Дата рождения</td>
          <td @click="setSortValue({nameKey: 'phone', isReverse: !this.sortValue.isReverse})">Tелефон</td>
          <td @click="setSortValue({nameKey: 'email', isReverse: !this.sortValue.isReverse})">Электронная почта</td>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in sortUsers" :key="user.id">
           <td>{{index + 1}}</td>
            <td>{{user.firstName}}</td>
            <td>{{user.lastName}}</td>
            <td>{{user.date}}</td>
            <td>{{user.phone}}</td>
            <td>{{user.email}}</td>
            <td><router-link :to="{name: 'userUpdate', params: {id: user.id, action: 'update'}}"><span class="icon fa-lg has-text-primary"><i class="fa fa-edit"></i></span></router-link></td>
            <td><router-link :to="{name: 'userRemove', params: {id: user.id, action: 'remove'}}"><span class="icon fa-lg has-text-danger"><i class="fa fa-close"></i></span></router-link></td>
        </tr>
      </tbody>
    </table>
    <button :disabled="isLastUsers" class="button is-primary" @click="loadNextUser">Загрузить</button>
  </div>
</template>

<script>
import * as sorter from "../utils/sort.js";
import TheLoader from "./TheLoader.vue";

export default {
    mounted() {
      this.$store.dispatch("loadFirstUsers");
    },
    methods: {
      loadNextUser() {
        this.$store.dispatch("loadUsersNextPage");
      },
      sort() {
        if(this.sortValue.nameKey) {
          return sorter.sortUser(this.$store.getters.users, this.sortValue.nameKey, this.sortValue.isReverse);
        }
        else {
          return this.getUsers;
        }
      },
      setSortValue(value){
        this.sortValue = value;
      }
    },
    computed: {
      isLoad() {
        return this.$store.getters.isLoad;
      },
      isLastUsers() {
        return !this.$store.getters.lastSendUser;
      },
      getUsers() {
        return this.$store.getters.users;
      },
      sortUsers() {
        return this.sort(this.sortValue);
      }
    },
    data() {
      return {
        users: this.$store.getters.users,
        sortValue: {nameKey: "", isReverse: true}
      }
    },
    components: { TheLoader }
}
</script>

<style>

.button {
    margin-bottom: 20px;
}
</style>