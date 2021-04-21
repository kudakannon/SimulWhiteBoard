<template>
  <div>
    <b-list-group class="list-group">
      <b-list-group-item
        v-for="(comment, vdx) in stageComments"
        :key="vdx"
        class="flex-column align-items-start"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ comment.userName }}</h5>
          <small class="text-muted">{{ comment.dateCreated }}</small>
        </div>
        <p class="mb-1">
          {{ comment.stageComment }}
        </p>
        <small>{{ comment.stageName }}</small>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["stageComments"]
};
</script>

<style>
#textarea {
  width: 100%;
  padding: 5px 5px;
  margin: 5px 0 5px 0;
}
.commentButton {
  margin: 0 0 5px 0;
}
</style>
