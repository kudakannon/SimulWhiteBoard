<template>
  <div>
    <h2 class="title">Comments</h2>

    <form v-if="canComment" method="post" @submit.prevent="submitComment">
      <input
        id="textarea"
        v-model="commentValue"
        placeholder="Enter something..."
        required
      />
      <b-button block variant="primary" type="submit" class="commentButton"
        >Comment</b-button
      >
    </form>
    <div v-for="(comments, idx) in StageComments" :key="(comments, idx)">
      <CommentSection :stageComments="comments" v-if="selected.stageName == comments[0].stageName"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CommentSection from "~/components/CommentSection";

export default {
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  data() {
    return {
      StageComments: [],
      commentValue: ""
    };
  },
  components: {
    CommentSection
  },
  created() {
    this.fetchComments();
  },
  methods: {
    fetchComments() {
      try {
        this.$axios
          .get("getstagecomments" + window.location.search)
          .then(result => {
            this.StageComments = result.data;

          });
      } catch (e) {
        this.error = e.response.data.message;
      }
    },
    async submitComment() {
      try {
        this.$axios
          .post("submitcomment", {
            projectID: this.selected.projectID,
            comment: this.commentValue,
            stageName: this.selected.stageName
          })
          .then(async result => {
            await this.fetchComments();
            this.commentValue = "";
          });
      } catch (e) {
        this.error = e.response.data.message;
      }
    }
  },
  props: ["canComment", "selected"]
};
</script>
<style scoped>
#textarea {
  width: 100%;
  padding: 5px 5px;
  margin: 5px 0 5px 0;
}
.commentButton {
  margin: 0 0 5px 0;
}

.title {
  margin: 10px 0 10px 0;
}
</style>
