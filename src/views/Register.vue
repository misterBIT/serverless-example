<template>
  <div class="register-container">
    <form @submit.prevent="register">
      <photo-capture v-if="isCameraVisible" v-model="user.imgData"></photo-capture>
      <div v-else class="img-container">
        <img :src="getImgUrl" alt="image">
        <button type="button" class="btn-capture" @click="showCamera">+</button>
      </div>
      <input type="text" v-model="user.name" placeholder="Name *">
      <input type="text" v-model="user.email" placeholder="Email *">
      <button :disabled="!isValid" type="submit" class="btn-identify">Verify Identity</button>
    </form>
  </div>
</template>

<script>
import photoCapture from "../components/PhotoCapture";

export default {
  data() {
    return {
      isCameraVisible: false,
      user: {
        name: "",
        email: "",
        imgData: ""
      }
    };
  },
  computed: {
    getImgUrl() {
      return this.$store.getters.imgUrl;
    },
    isValid() {
      return this.user.name && this.user.email // && this.user.imgData;
    }
  },
  methods: {
    showCamera() {
      this.isCameraVisible = true;
    },
    capturePhoto(imgData) {
      this.user.imgData = imgData;
    },
    register() {
      console.log("Register", this.user);
      this.$store
        .dispatch({ type: "register", user: this.user })
        .then(() => this.$router.push("/"));
    }
  },
  components: {
    photoCapture
  }
};
</script>

<style lang="scss">
</style>
