import { createRouter, createWebHistory } from "vue-router";
import TableUsers from "../components/UsersTable.vue";
import User from '../components/User.vue';

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: TableUsers },
        { path: "/userCreate",  name: "userCreate", component: User },
        { path: "/userRemove/:id", component: User, name: "userRemove", props: true },
        { path: "/userUpdate/:id", component: User, name: "userUpdate", props: true },
    ]
});