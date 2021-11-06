<template>
    <div v-if="text" class="notification" :class="classMessage">
        <button @click="close" class="delete"></button>
        <p>{{text}}</p>
    </div>
</template>

<script>
export default {
    computed: {
        text() {
            return this.$store.getters.message.text;
        },
        type() {
            return this.$store.getters.message.type;
        },
        classMessage() {
            if (this.type === "notification") {
                return "is-primary";
            }
            else if (this.type === "error") {
                return "is-danger";
            }
            else if(this.type === "warning") {
                return "is-warning";
            }
            return "";
        }
    },
    methods: {
        close(){
           this.$store.commit("removeMessage");
        }
    },
}
</script>

<style>

</style>