<template>
  <div>
    <div v-if="loading == true"><Loading /></div>
    <div v-else>
      <form class="mt-4" v-if="canEdit">
        <b-form-group id="fileInput">
          <b-form-file
            accept="image/jpeg, image/png, image/gif"
            placeholder="Please select an image"
            @change="uploadToBucket($event.target.files)"
          ></b-form-file>
        </b-form-group>
      </form>
      <div class="imageDiv" v-if="imgLink != ''">
        <img :src="imgLink" alt="Info" />
      </div>
    </div>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
import Loading from "~/components/Loading";
export default {
  data() {
    return {
      imgLink: "",
      loading: false
    };
  },
  components: {
    Notification,
    Loading
  },
  created() {
    this.fetchImages();
  },
  methods: {
    async uploadToBucket(files) {
      this.loading = true;
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const formData = new FormData();
      formData.append("file", files[0]);
      // ADD IMAGE TO S3
      this.$axios
        .post("uploadimage", formData, config)
        .then(res => {
          this.imgLink = res.data.imageUrl;
        })
        .catch(err => {
          console.log("Error: Could not upload image to S3.");
        });
      this.loading = false;
    },
    async fetchImages() {
      this.loading = true;
      this.$axios
        .get("getimages" + window.location.search)
        .then(async res => {
          // GET IMAGE FROM S3
          this.imgLink = res.data.imageUrl;
        })
        .catch(err => {
          this.error = e.response.data.message;
        });
      this.loading = false;
    }
  },
  props: ["canEdit"]
};
</script>

<style scoped>
.imageDiv {
  width: 50%;
  height: 50%;
}

.image {
  width: 100%;
  height: 100%;
}
</style>
