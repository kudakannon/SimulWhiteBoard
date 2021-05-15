<template>
  <div class="content" v-if="items.status == 'In Progress'">
    <b-button
      v-if="items.projectOwner == loggedInUser.userID && loggedInUser.userType == 'user'"
      variant="outline-success"
      v-b-modal.complete-modal
      >Complete Project</b-button
    >
    <b-button
      v-if="items.projectOwner == loggedInUser.userID && loggedInUser.userType == 'user'"
      variant="outline-danger"
      v-b-modal.close-modal
      >Close Project</b-button
    >
    <b-button
      v-if="
        items.projectOwner == loggedInUser.userID ||
          loggedInUser.userType == 'director'
      "
      v-b-modal.share-modal
      variant="outline-secondary"
      >Share Project with...</b-button
    >
    <b-modal
      id="complete-modal"
      hide-footer
      title="Complete Project"
    >
      <p>
        <strong>Are you sure you want to complete the project?</strong>
      </p>
      <b-button class="mt-3" variant="success" block @click="completeProj">Complete Project..</b-button>

    </b-modal>
    <b-modal
      id="close-modal"
      ok-variant="danger"
      @ok="closeProj"
      ok-title="Close Project.."
      title="Close Project"
    >
      <p>
        <strong>Are you sure you want to end the project?</strong>
      </p>
    </b-modal>
    <b-modal
      ref="modal"
      id="share-modal"
      ok-only
      ok-variant="outline-primary"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      ok-title="Share.."
      title="Share Project with..."
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            type="text"
            class="input"
            name="sharedName"
            placeholder="Enter Name here.."
            v-model="sharedName"
            :state="nameState"
            required
          />
        </b-form-group>
        <b-form-group
          :state="emailState"
          label="Email"
          label-for="email-input"
          invalid-feedback="Email is required"
        >
          <b-form-input
            type="email"
            class="input"
            name="sharedEmail"
            placeholder="Enter Email here.."
            v-model="sharedEmail"
            :state="emailState"
            required
          />
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Notification from "~/components/Notification";

export default {
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  data() {
    return {
      sharedEmail: "",
      emailState: null,
      sharedName: "",
      nameState: null,
      error: null,
      shared: false
    };
  },
  components: {
    Notification
  },
  methods: {
    completeProj() {
      this.$axios
        .post("completeproject", {
          projectID: this.items.projectID
        })
        .then(res => {
          this.$router.push("/projects");
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeProj() {
      this.$axios
        .post("closeproject", {
          projectID: this.items.projectID
        })
        .then(res => {
          this.$router.push("/projects");
        })
        .catch(err => {
          console.log(err);
        });
    },
    shareProject(bvModalEvt) {
      bvModalEvt.preventDefault();
      // Trigger submit handler

      if (!this.checkFormValidity()) {
        return;
      }

      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.emailState = valid;
      return valid;
    },
    resetModal() {
      this.sharedName = "";
      this.sharedEmail = "";
      this.nameState = null;
      this.emailState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      this.$axios
        .post("shareproject", {
          projectInfo: this.items,
          sharedName: this.sharedName,
          sharedEmail: this.sharedEmail,
          user: this.loggedInUser
        })
        .then(res => {
          this.$nextTick(() => {
            this.$bvModal.hide("modal-5");
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  props: ["items"]
};
</script>

<style></style>
