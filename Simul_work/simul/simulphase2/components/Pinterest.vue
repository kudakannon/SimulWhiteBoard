<template>
  <div>
    <h2 class="title">Inspiration</h2>
    <div class="pinterest">
      <img
        alt="Pinterest"
        src="../static/pinterest.png"
        width="50px"
        style="margin-bottom:10px;"
      />
      <h4>Interact With Pinterest</h4>
    </div>
    <Notification :message="error" v-if="error"/>
    <div v-if="inputMode && canEdit">
      <div class="field">
        <label class="label">Pinterest User</label>
        <div class="control">
          <input id="user" v-model="boardOwner" />
        </div>
      </div>
      <div class="field">
        <label class="label">Pinterest Board</label>
        <div class="control">
          <input id="board" v-model="boardName" />
        </div>
      </div>
      <b-button @click="AddBoard" :disabled="loadDisabled" variant="danger"
        >Load Board</b-button
      >
    </div>

    <div v-else>
      <div v-if="loading"><Loading /></div>
      <b-button v-if="canEdit" @click="inputMode = true;" variant="danger"
        >Add another Board</b-button
      >
    </div>
    <div class="boards" v-for="(item, idc) in boards" :key="(item, item.images, idc)">
      <h4>Board: {{ item.boardName }}</h4>
      <p>Added by: {{ item.addedBy }}</p>
      <div class="gallery">
        <div class="gallery-panel" v-for="(photo, idx) in item.images" :key="(photo, idx)">
          <img :src="photo" />
        </div>
      </div>
      <hr class="solid" />
    </div>
  </div>
</template>
<script>
import Loading from "~/components/Loading";
import Notification from "~/components/Notification";
import { mapGetters } from "vuex";

export default {
  middleware: "auth",
  computed: {
    ...mapGetters(["loggedInUser"]),
    loadDisabled() {
      return this.boardOwner == "" || this.boardName == "";
    }
  },
  data() {
    return {
      inputMode: true,
      boardOwner: "",
      boardName: "",
      boards: [],
      loading: true,
      error: null,
    };
  },
  components: {
    Loading,
    Notification
  },
  created() {
    this.fetchPinterestInfo();
  },
  methods: {
    fetchPinterestInfo() {
      var searchTerms = window.location.search.split("?")[1];
      searchTerms = searchTerms.split("&");
      var projID = searchTerms[0].replace("project=", "");
      this.$axios
          .get("getpinterestinfo" + window.location.search)
          .then(res => {
            var result = res.data;
            for(var i = 0; i<result.length;i++) {
                this.loadImages(result[i].userName, result[i].boardName, result[i].boardOwner)
            }
            this.loading = false;
          })
          .catch(er => {
            this.error = e.response.data.message;
          })
    },
    async AddBoard() {
      this.loading = true;
      var searchTerms = window.location.search.split("?")[1];
      searchTerms = searchTerms.split("&");
      var projID = searchTerms[0].replace("project=", "");
      this.$axios.post("addpinterestboard", {
          projectID: projID,
          userID: this.loggedInUser.userID,
          boardOwner: this.boardOwner,
          boardName: this.boardName,
        })
        .then(res => {
          var newName = this.boardName.charAt(0).toUpperCase() + this.boardName.substring(1);
          this.loadImages(this.loggedInUser.userName, newName, this.boardOwner)
          this.boardOwner = "",
          this.boardName = "",
          this.inputMode = false;
          this.loading = false;
        })
        .catch(err => {
          this.error = err.response.data.message
        })
    },
    loadImages(usrName, nameBoard, ownerBoard) {
      this.inputMode = false;
      var imageLinks = [];
      let board = nameBoard.replace(/ /g, "-");
      let url = `https://www.pinterest.com/${encodeURIComponent(
        ownerBoard
      )}/${encodeURIComponent(board)}.rss/`;
      feednami.load(url).then(feed => {
        for (let entry of feed.entries) {
          let newItem = entry.description;
          newItem = newItem.replace(/<a.*?>/, "");
          newItem = newItem.replace(/<\/a>/, "");
          newItem = newItem.replace(/\s.*<img src="/, "");
          newItem = newItem.replace(/">\s*.*/, "");
          imageLinks.push(newItem);
          this.loading = false;
        }
        this.boards.unshift({
          boardName: nameBoard,
          addedBy: usrName,
          images: imageLinks
        });
      });
    }
  },
  props: ['canEdit']

};
</script>
<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 1rem;
  max-width: 100rem;
  margin: 5rem auto;
  padding: 0 5rem;
  height: 500px;
  overflow: auto;
}
.gallery-panel img {
  width: 100%;
  height: 22vw;
  object-fit: fill;
  border-radius: 0.75rem;
}
.pinterest {
  display: inline-block;
}
.boards {
  padding: 30px;
}
h4 {
  display: inline;
  font-size: larger;
}
</style>
