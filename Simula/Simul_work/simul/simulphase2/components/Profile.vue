<template>
  <div class="card" style="width: 18rem;">
    <img src="../static/person.jpg" class="card-img-top" alt=":(" />
    <div class="card-body">
      <h5 class="card-title">My Profile</h5>
      <b-button style="margin-top: 10px;" @click="toggleEdit" v-if="!edit"
        >Edit</b-button
      >
      <Notification :message="error" v-if="error" />
      <form action="">
        <label class="label">Name</label>
        <b-form-input v-model="name" :disabled="!edit" required></b-form-input>
        <label class="label">Email</label>
        <b-form-input v-model="email" :disabled="!edit" required></b-form-input>
        <label class="label">Phone</label>
        <vue-tel-input
          v-model="phone"
          :disabled="!edit"
          required
        ></vue-tel-input>

        <b-button
          v-if="edit"
          variant="outline-success"
          style="margin-top: 10px;"
          @click="handleSubmit"
          >Save</b-button
        >
      </form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Notification from "~/components/Notification";

export default {
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  created() {
    this.name = this.loggedInUser.name || "";
    this.email = this.loggedInUser.userEmail || "";
    this.phone = this.loggedInUser.userPhone || "";
    this.name = this.loggedInUser.userName || "";
  },
  components: {
    Notification
  },
  data() {
    return {
      email: "",
      name: "",
      phone: "",
      error: null,
      edit: false
    };
  },
  methods: {
    toggleEdit() {
      this.edit = true;
    },
    async handleSubmit() {
      this.$axios
        .post("updatedetails", {
          name: this.name,
          email: this.email,
          phone: this.phone
        })
        .then(res => {
          this.edit = false;
        })
        .catch(err => {
          this.error = err.response.data.message;
        });
    }
  }
};
</script>

<style scoped>
.card {
  margin: auto;
}
.card-text {
  text-align: left;
}
.list-group-item {
  font-weight: bold;
  font-weight: bold;
}
.list-group-item6 {
  margin: auto;
}
</style>
