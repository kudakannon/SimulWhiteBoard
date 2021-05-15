<template>
      <section class="section">
    <div class="container">
      <div class="heading">
        <b-link
          @click="toggleStages"
          href="#stages"
          active-class="active"
          active
          >Stages</b-link
        >
        <b-link
          @click="toggleInspiration"
          active-class="active"
          href="#inspiration"
          >Inspiration</b-link
        >
      </div>
      <div class="content">
        <h2 class="title">{{ items.title }}</h2>
        <div>
          <ContactInformation :users="users" />
        </div>
        <p>
          <strong>Project Status:</strong>
          {{ items.status }}
        </p>
        <p>
          <strong>Date Created:</strong>
          {{ items.dateCreated }}
        </p>
      </div>
      <MutateProject :items="items" />
      <div class="content" v-if="StagesBoolean">
        <template v-if="isBusy">
          <Loading />
        </template>
        <template v-else>
          <Stages :items="items" :canComment="Commentable" :canEdit="Editable" />
        </template>
      </div>
      <div class="content" v-else>
        <Pinterest :canEdit="UploadBoards" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { ButtonGroupPlugin } from "bootstrap-vue";
import { ButtonPlugin } from "bootstrap-vue";
import { LinkPlugin } from "bootstrap-vue";
import Loading from "~/components/Loading";
import Pinterest from "~/components/Pinterest";
import S3FileUpload from "~/components/S3FileUpload";
import ContactInformation from "~/components/ContactInformation";
import MutateProject from "~/components/MutateProject";
import Stages from "~/components/Stages";
export default {
    middleware: "auth",
    componants: {
        ButtonGroupPlugin,
        ButtonPlugin,
        Pinterest,
        S3FileUpload,
        ContactInformation,
        LinkPlugin,
        MutateProject,
        Stages
    },
    data(){
        
    }
}
</script>

<style>
    .container {
        display: inline-block;
    }

    .heading {
        float: left;
        width: 100px;
        height: 10px;
        margin-right: 8px;
        position: fixed;
    }
    .heading a:link,
    a:visited {
        background-color: white;
        font-size: 12px;
        color: dimgrey;
        text-align: left;
        padding: 5px 10px;
        text-align: left;
        text-decoration: none;
        display: block;
    }
    #active {
        color: red;
        text-decoration: none;
    }
    .heading a:hover {
        text-decoration: underline;
        text-decoration-color: red;
    }

    .content {
        margin-left: 108px;
        margin-top: 50px;
        padding-left: 50px;
    }

    .list-group {
        height: 220px;
        margin-bottom: 10px;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }

    #preview img {
        max-width: 100%;
    }

    #fileInput.dragdrop .custom-file,
    #fileInput.dragdrop .custom-file-input {
        height: 100px;
    }

    #fileInput.dragdrop .custom-file-label {
        border: 0;
        border: 5px dotted skyblue;
        height: 100px;
        line-height: 90px;
        text-align: center;
        color: skyblue;
        padding: 0;
    }

    #fileInput.dragdrop .custom-file:hover .custom-file-label {
        background: rgb(75, 181, 225);
        color: #fff;
    }

    #fileInput.dragdrop .custom-file-label::after {
        display: none;
    }
    .input {
        margin: 10px 0px 10px 0px;
    }
</style>