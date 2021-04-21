<template>
  <div>
    <b-button
      v-b-modal.modal-1
      variant="outline-secondary"
      style="margin-bottom: 10px;"
      >Contact Information</b-button
    >
    <b-modal id="modal-1" title="Contact Information" hide-footer>
          <template>
      <div class="boards" v-for="(user, idx) in users" :key="(user, idx)">
        <div class="contactinfo">
        <h5 class="card-title">{{ user.name }}</h5>
        <p>
          <strong>Email:</strong>
          <a :href="`mailto:${user.email}`">{{ user.email }}</a>
        </p>
        <p>
          <strong>Phone:</strong>
          <a :href="`tel:${user.phone}`">{{ user.phone }}</a>
        </p>
        </div>
        <hr class="solid" />
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-1')">Close</b-button>

                </template>

    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
  props: ["users"]
};
</script>
<style scoped>
.contactinfo {
  padding:0px 0 20px 0;
}
</style>
