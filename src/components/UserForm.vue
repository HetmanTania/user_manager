<template>
<the-loader v-if="isLoad"></the-loader>
<div v-else class="userForm-wrapper columns is-flex is-justify-content-center">
  <form class="column is-two-thirds ">  
    <div class="field ">
      <label class="label">Имя</label>
      <div class="control has-icons-left has-icons-right">
        <input :disabled="isDisableInput" v-model.lazy.trim="user.firstName" :class="classInput('firstName')" class="input" type="text" placeholder="Введите имя"/>
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </div>
      <p v-show="isErrorValue('firstName')" class="help is-danger">{{this.validErrors.get('firstName')}}</p>
    </div>
    <div class="field">
      <label class="label">Фамилия</label>
      <div class="control has-icons-left has-icons-right">
        <input :disabled="isDisableInput" v-model.lazy.trim="user.lastName" :class="classInput('lastName')" class="input" type="text" placeholder="Введите имя"/>
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </div>
      <p v-show="isErrorValue('lastName')" class="help is-danger">{{this.validErrors.get('lastName')}}</p>
    </div>
    <div class="field">
      <label class="label">Дата рождения</label>
      <div class="control has-icons-left has-icons-right">
        <input :disabled="isDisableInput" v-model="user.date" :class="classInput('date')" class="input" type="date" min="1930-01-01" :max="getMaxInputDate()" placeholder="Введите дату рождения"/>
       <span class="icon is-small is-left">
          <i class="fa fa-calendar"></i>
        </span>
      </div>
      <p v-show="isErrorValue('date')" class="help is-danger">{{this.validErrors.get('date')}}</p>
    </div>
    <div class="field">
      <label class="label">Телефон</label>
      <div class="control has-icons-left has-icons-right">
        <input :disabled="isDisableInput" v-model.lazy.trim="user.phone" :class="classInput('phone')" class="input" type="phone" placeholder="Введите номер телефона"/>
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </div>
      <p v-show="isErrorValue('phone')" class="help is-danger">{{this.validErrors.get('phone')}}</p>
    </div>
    <div class="field">
      <label class="label">Электронная почта</label>
      <div class="control has-icons-left has-icons-right">
        <input :disabled="isDisableInput" v-model.lazy.trim="user.email" :class="classInput('email')" class="input" type="text" placeholder="Введите email"/>
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </div>
      <p v-show="isErrorValue('email')" class="help is-danger">{{this.validErrors.get('email')}}</p>
    </div>
    <button :disabled="isDisableButton" @click.prevent="clickSubmit" type="submit" class="button is-primary"> {{ submitMap[action] }}</button>
    <router-link to="/">Назад</router-link>
  </form>
</div>
  
</template>

<script>
import * as validator from "../utils/verified.js";
import validError from "../utils/validError.js";
import generrateDate from "../utils/generrateDate.js";
import TheLoader from "./TheLoader.vue"

export default {
  emits: ["doAction"],
  async mounted() {
    if (this.action === "userRemove" || this.action === "userUpdate") {
      this.user = await this.$store.dispatch("loadUser", this.id);
    }
  },
  props: {
    id: {
      type: String,
    },
  },
  methods: {
    clickSubmit() {
      this.$emit("doAction", this.user, this.action); 
      if (this.action === "userCreate") {
        this.clearInfo();
      }
    },
    clearInfo() {
      this.user.firstName = undefined;
      this.user.lastName = undefined;
      this.user.date = undefined;
      this.user.phone = undefined;
      this.user.email = undefined;
      this.validErrors.clear();
    },
    classInput(nameKey) {
        if(this.user[nameKey] === undefined) {
            return "";
        }
        const nameCheckFunction = `check${nameKey[0].toUpperCase() + nameKey.substring(1)}`;
        return this[nameCheckFunction] ? "is-success" : "is-danger";
    },
    isErrorValue(nameKey) {
        if(this.validErrors.get(nameKey) && this.user[nameKey] !== undefined) {
            return true;
        }
        else {
            return false;
        }
    },
    isErrorFirstName() {
        if(this.validErrors.get('firstName') && this.user.firstName !== undefined) {
            return true;
        }
        else {
            return false;
        }
    },
    getMaxInputDate() {
      const maxDate = new Date();
      return generrateDate(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    }
  },
  computed: {
    isLoad() {
      return this.action !== 'userCreate' && !this.user?.firstName;
    },
    isDisableButton() {
        if(this.action === 'userRemove') {
            return false;
        }
        else if(this.action !== 'userRemove' && this.isValidForm ) {
            return false;
        }
        return true;
    },
    isDisableInput() {
        if(this.action === "userRemove") {
            return true;
        }
        return false;
    },
    isValidForm() {
        return validator.allVerified(this.user);
    },
    checkEmail() {
        const result = validator.checkEmail(this.user.email);
        if(!result) {
            this.validErrors.set("email", validError.email_error);
        }
        else {
           if(this.validErrors.has("email")) {
                this.validErrors.delete("email");
           }
        }
        return result;
    },
    checkPhone() {
        const result = validator.checkPhone(this.user.phone);
        if(!result) {
            this.validErrors.set("phone", validError.phone_error);
        }
        else {
           if(this.validErrors.has("phone")) {
                this.validErrors.delete("phone");
           }
        }
        return result;
    },
    checkDate() {
        const result = validator.checkDate(this.user.date);
        if(!result) {
            this.validErrors.set("date", validError.date_error);
        }
        else {
           if(this.validErrors.has("date")) {
                this.validErrors.delete("date");
           }
        }
        return result;
    },
    checkFirstName() {
        const result = validator.checkFirstNameLastName(this.user.firstName);
        if(!result) {
            this.validErrors.set("firstName", validError.fistName_error);
        }
        else {
           if(this.validErrors.has("firstName")) {
                this.validErrors.delete("firstName");
           }
        }
        return result;
    },
    checkLastName() {
        const result = validator.checkFirstNameLastName(this.user.lastName);
        if(!result) {
            this.validErrors.set("lastName", validError.lastName_error);
        }
        else {
           if(this.validErrors.has("lastName")) {
              this.validErrors.delete("lastName");
           }
        }
        return result;
    },
    action() {
      return this.$route.name;
    },
    isActionRemove() {
      return this.action === "userRemove";
    },
  },
  data() {
    return {
      validErrors: new Map(),
      submitMap: {
        userCreate: "Создать",
        userRemove: "Удалить",
        userUpdate: "Сохранить",
      },
      user: {
        id: undefined,
        firstName: undefined,
        lastName: undefined,
        date: undefined,
        phone: undefined,
        email: undefined,
      },
    };
  },
  components: {TheLoader}
};
</script>

<style>
  .button {
    width: 100%;
  }
</style>