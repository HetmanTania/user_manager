import { createStore } from 'vuex';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc, query, orderBy, limit, startAfter, limitToLast, } from "firebase/firestore";

import textMessage from '../utils/textMessage.js';

const firebaseConfig = {
    apiKey: "AIzaSyCAY-LVve5fKw-v91TwEmVj_QR78AuVOXE",
    authDomain: "user-management-807db.firebaseapp.com",
    databaseURL: "https://user-management-807db-default-rtdb.firebaseio.com",
    projectId: "user-management-807db",
    storageBucket: "user-management-807db.appspot.com",
    messagingSenderId: "689193193806",
    appId: "1:689193193806:web:370ff531211edaf4938e1f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default createStore({
    state() {
        return {
            users: [],
            message: {
                text: "",
                type: "",
            },
            idMessage: undefined,
            lastSendUser: undefined,
            lastUser: undefined,
            countSendUsers: 5,
            isLoad: true,
        }
    },
    getters: {
        users(state) {
            return state.users;
        },
        isLoad(state) {
            return state.isLoad;
        },
        message(state) {
            return state.message;
        },
        countSendUsers(state) {
            return state.countSendUsers;
        },
        lastSendUser(state) {
            return state.lastSendUser;
        },
    },
    mutations: {
        addUser(state, user) {
            if (user) {
                state.users.push(user);
            }
        },
        setlastSendUser(state, user) {
            if(user?.id === state.lastUser?.id && state.lastSendUser?.id !== undefined ) {
                state.lastSendUser = undefined;
            }
            else {
                state.lastSendUser = user;
            }
        },
        setlastUser(state, user) {
            state.lastUser = user;
        },
        setUsers(state, users) {
            if (users) {
                state.users = users;
            }
        },
        addUsers(state, users) {
            if (users) {
                state.users = state.users.concat(users);
            }
        },
        setMessage(state, { text, type }) {
            if (text && type) {
                state.message.text = text;
                state.message.type = type;

                this.idMessage = setTimeout(() => {
                    state.message.text = "";
                    state.message.type = "";
                }, 3000);
            }
        },
        removeMessage(state) {
            state.message = "";
            clearInterval(this.idMessage);
        },
        setCountSendUsers(state, count) {
            state.countSendUsers += count;
        },
        setIsLoad(state, idLoad) {
            state.isLoad = idLoad;
        },
    },
    actions: {
        generateMessage({ commit }, { text, type }) {
            commit("setMessage", { text, type });
        },
        async loadUser({ dispatch, commit }, id) {
            try {
                commit("setIsLoad", true);
                const userRef = doc(db, 'users', id);
                const data = await getDoc(userRef);
                if (data.exists()) {
                    const user = { ...data.data(), id: data.id }
                    commit("setIsLoad", false);
                    return user;
                }
                else {
                    throw new Error("not_found_user");
                }
            }
            catch (error) {
                const text = textMessage[error.message] ? textMessage[error.message] : "Ошибка. Перезагрузите страницу";
                dispatch("generateMessage", { text, type: "error" });
            }
            commit("setIsLoad", false);
        },
        async loadLastUser({ dispatch, commit }) {
            try {
                const userRef = collection(db, 'users');
                const queryUsers = query(userRef, orderBy("firstName"), limitToLast(1));
                const data = await getDocs(queryUsers);
                const user = data.docs.map((doc) => {
                    if (doc.exists()) {
                        const user = { ...doc.data(), id: doc.id }
                        return user
                    }
                    else {
                        throw new Error("connection_error");
                    }
                })[0];
                commit("setlastUser", user);
            }
            catch (error) {
                const text = textMessage[error.message] ? textMessage[error.message] : "Ошибка. Перезагрузите страницу";
                dispatch("generateMessage", { text, type: "error" });
            }
        },
        async loadFirstUsers({ getters, commit, dispatch }) {
            try {
                commit("setIsLoad", true);
                const countSendUsers = getters.countSendUsers;
                const userRef = collection(db, 'users');
                const queryUsers = query(userRef, orderBy("firstName"), limit(countSendUsers));
                const data = await getDocs(queryUsers);
                const users = data.docs.map((doc) => {
                    if (doc.exists()) {
                        const user = { ...doc.data(), id: doc.id }
                        return user
                    }
                    else {
                        throw new Error("connection_error");
                    }
                });
               
                commit("setUsers", users);
                commit("setlastSendUser",  data.docs[data.docs.length - 1]);
                dispatch("loadLastUser");
            }
            catch (error) {
                const text = textMessage[error.message] ? textMessage[error.message] : "Ошибка. Перезагрузите страницу";
                dispatch("generateMessage", { text, type: "error" });
            }
            commit("setIsLoad", false);
        },
        async loadUsersNextPage({ getters, commit, dispatch }) {
            try {
                commit("setIsLoad", true);
                let lastSendUser = getters.lastSendUser;
                const userRef = collection(db, 'users');
                const queryUsers = query(userRef, orderBy("firstName"), startAfter(lastSendUser), limit(5));
                const data = await getDocs(queryUsers);
                const users = data.docs.map((doc) => {
                    if (doc.exists()) {
                        const user = { ...doc.data(), id: doc.id };
                        return user;
                    }
                    else {
                        throw new Error("connection_error");
                    }
                });
                commit("setlastSendUser", data.docs[data.docs.length - 1]);
                commit("addUsers", users);
                commit("setCountSendUsers", users.length);
            }
            catch (error) {
                const text = textMessage[error.message] ? textMessage[error.message] : "Ошибка. Перезагрузите страницу";
                dispatch("generateMessage", { text, type: "error" });
            }
            commit("setIsLoad", false);
        },
        async createUser({ commit, dispatch }, newUser) {
            try {
                delete newUser.id;
                const result = await addDoc(collection(db, "users"), newUser);

                if (result) {
                    newUser.id = result.id;
                    commit("addUser", newUser);

                    const text = textMessage.createUser;
                    dispatch("generateMessage", { text, type: "notification" });
                }
                else {
                    throw new Error("connection_error");
                }

            } catch (error) {
                const text = textMessage[error.message] ? textMessage[error.message] : "Ошибка. Перезагрузите страницу";
                dispatch("generateMessage", { text, type: "error" });
            }
        },
        async removeUser({ dispatch }, id) {
            try {
                await deleteDoc(doc(db, "users", id));
                const text = textMessage.removeUser;
                dispatch("generateMessage", { text, type: "notification" });
            } catch (error) {
                const text = textMessage[error.message] ? textMessage[error.message] : "Ошибка. Перезагрузите страницу";
                dispatch("generateMessage", { text, type: "error" });
            }
        },
        async updateUser({ dispatch }, user) {
            try {
                await updateDoc(doc(db, "users", user.id), user);
                const text = textMessage.updateUser;
                dispatch("generateMessage", { text, type: "notification" });
            } catch (error) {
                const text = textMessage[error.message] ? textMessage[error.message] : "Ошибка. Перезагрузите страницу";
                dispatch("generateMessage", { text, type: "error" });
            }
        }
    }
})