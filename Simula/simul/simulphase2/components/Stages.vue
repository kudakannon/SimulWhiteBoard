<template>
  <div>
    <h2 class="title">Stages of Development</h2>
    <b-form-group>
      <b-form-radio-group
        id="btn-radios-2"
        v-model="selected"
        :options="stages"
        @change="updateWindow"
        buttons
        button-variant="outline-danger"
        size="md"
        name="radio-btn-outline"
        style="width: 100%;"
      ></b-form-radio-group>
    </b-form-group>
    <Notification :message="error" v-if="error" />
    <div v-if="loading"><Loading /></div>
    <div
      v-if="loggedInUser.userType == 'user' && items.projectOwner == loggedInUser.userID"
    >
      <b-button
        block
        variant="primary"
        v-if="
          !addAnotherStage &&
            stages.length < 9 &&
            items.userID == loggedInUser.userID
        "
        @click="addAnotherStage = true"
        >Add another Stage</b-button
      >
      <form
        v-if="addAnotherStage"
        method="post"
        @submit.prevent="addStagetoProject"
      >
        <input
          type="text"
          class="input"
          name="newStage"
          placeholder="Stage Name..."
          v-model="newStageName"
          required
        />
        <b-button block variant="primary" type="submit" class="addStageButton"
          >Add Stage to Project</b-button
        >
      </form>
    </div>
    <!-- </div> -->
    <h2 class="title">{{ selected.stageName }}</h2>
    <S3FileUpload :canEdit="canEdit" />
    <StageComments :canComment="canComment" :selected="selected" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Notification from "~/components/Notification";
import Loading from "~/components/Loading";
import S3FileUpload from "~/components/S3FileUpload";
import StageComments from "~/components/StageComments";

export default {
  data() {
    return {
      stages: [],
      selected: {},
      error: null,
      addAnotherStage: false,
      newStageName: "",
      loading: true
    };
  },
  components: {
    Loading,
    Notification,
    S3FileUpload,
    StageComments
  },
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  created() {
    return this.$axios
      .get("getstages" + window.location.search)
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.stages.push({
            text: res.data[i].stageName,
            value: res.data[i]
          });
        }

        this.selected = this.stages[0].value;
        this.loading = false;
      })
      .catch(err => {
        this.error = err.response.data.message;
      });
  },
  methods: {
    addStagetoProject() {
      this.loading = true;
      this.$axios
        .post("addsinglestage", {
          stageName: this.newStageName,
          projectID: this.stages[0].value.projectID
        })
        .then(res => {
          this.stages.push({
            text: this.newStageName,
            value: {
              dateCompleted: null,
              projectAddress: this.stages[0].value.projectAddress,
              projectID: this.stages[0].value.projectID,
              stageDateCommenced: null,
              stageName: this.newStageName,
              stageProjectedCompletionDate: null
            }
          });
          this.newStageName = "";
          this.addAnotherStage = false;
          this.loading = false;
          this.error = null;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.response.data.message;
        });
    },
    updateWindow(arg) {
      var newAddress = arg.projectAddress.replace(/\s+/g, "-");
      var newStage = arg.stageName.replace(": ", "&more=");

      const newRoute =
        "/project?project=" +
        arg.projectID +
        "&address=" +
        newAddress +
        "&stage=" +
        newStage;

      this.$router.push({ path: newRoute });
    }
  },
  props: ["items", "canComment", "canEdit"]
};
</script>

<style></style>
