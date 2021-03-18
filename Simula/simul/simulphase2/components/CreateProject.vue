<template>
  <div>
    <Notification :message="error" v-if="error" />
    <template v-if="isBusy">
      <Loading />
    </template>
    <template v-else>
      <form method="post" @submit.prevent="createProject">
        <h4 class="headings">Client Information</h4>
        <div class="field">
          <label class="label">Client Name</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="name"
              v-model="clientName"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Client Phone</label>
          <div class="control">
              <vue-tel-input v-model="phone" required></vue-tel-input>
          </div>
        </div>
        <div class="field">
          <label class="label">Client Email</label>
          <div class="control">
            <input
              type="email"
              class="input"
              name="email"
              v-model="email"
              required
            />
          </div>
        </div>
        <h4 class="headings">Project Information</h4>
        <div class="field">
          <label class="label">Project Address</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="address"
              v-model="address"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Projected Completion Date</label>
          <div class="control">
            <input
              type="date"
              class="input"
              name="date"
              v-model="completionDate"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label"
            >Please add/edit stages of development to suit your project</label
          >
          <b-button
            class="addStageBtn"
            @click="addStageFn()"
            v-if="stages.length < 8"
            variant="outline-success"
            >+</b-button
          >
          <b-button
            class="addStageBtn"
            @click="removeStageFn()"
            v-if="stages.length > 1"
            variant="outline-danger"
            >-</b-button
          >
          <div class="stages" v-for="(item, idx) in stages" :key="(item, idx)">
            <div class="flex">
              <input
                type="text"
                class="input"
                name="stageName"
                :id="idx"
                v-model="item.name"
                required
              />
            </div>
          </div>
        </div>
        <div class="control">
          <button type="submit" class="button is-dark is-fullwidth">
            Create Project
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
import Loading from "~/components/Loading";
import { mapGetters } from "vuex";

export default {
  components: {
    Notification,
    Loading,
  },
  data() {
    return {
      clientName: "",
      address: "",
      phone: "",
      email: "",
      completionDate: "",
      error: null,
      isBusy: false,
      placeholders: [
        "PHASE 2: CONCEPTUAL SKETCH DESIGN",
        "PHASE 3: DESIGN DEVELOPMENT",
        "PHASE 4: DEVELOPMENT APPLICATION",
        "PHASE 5: BUILDING APPROVAL",
        "PHASE 6: CONSTRUCTION DETAILING",
        "PHASE 7: CONTRACT SELECTION",
        "PHASE 8: CONTRACT ADMINISTRATION"
      ],
      stages: [{ name: "PHASE 1: PRE-DESIGN" }]
    };
  },
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  methods: {
    async createProject() {
      this.isBusy = true;
      var clientAccount;
      var project;
      var randomstring = Math.random()
        .toString(36)
        .slice(-8);
      project = await this.$axios.post("createproject", {
        projectAddress: this.address,
        completionDate: this.completionDate,
        name: this.clientName,
        phone: this.phone,
        email: this.email,
        password: randomstring,
        userID: this.loggedInUser.userID
      });
      //ADD COLLABORATORS FOR PROJECT
      try {
        await this.$axios.post("addcollabs", {
          projectID: project.data.projectID,
          clientID: project.data.clientToken
        });
      } catch (e) {
        this.error = e.response.data.message;
      }
      //ADD STAGES OF DEVELOPMENT
      try {
        await this.$axios.post("addStages", {
          projectID: project.data.projectID,
          stages: this.stages
        });
        this.$router.push("/projects");
      } catch (e) {
        this.error = e.response.data.message;
      }
    },
    addStageFn() {
      this.stages.push({ name: this.placeholders[this.stages.length - 1] });
    },
    removeStageFn() {
      this.stages.splice(this.stages.length - 1, 1);
    }
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  padding-top: 5px;
}
.addStageBtn {
  font-weight: bold;
  width: 49%;
}

.headings {
  padding: 20px 0px 20px 0px;
}
</style>
