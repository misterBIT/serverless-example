<template>
  <div class="register-container">
    <div class="register-title">register</div>
    <form @submit.prevent="register" class="form-register">
      
      <photo-capture  class="img-container" v-if="isCameraVisible" v-model="user.imgData"></photo-capture>
      <div v-else class="img-container">
        <img :src="getImgUrl" alt="image">
        <button type="button" class="btn-set-photo" @click="showCamera">+</button>
      </div>

      <div class="field">
        <label class="field-icon"><i class="fas fa-user"></i></label>
        <input type="text" class="field-input" v-model="user.name" placeholder="Name *">
      </div>
      
      <div class="field">
        <label class="field-icon"><i class="fas fa-envelope"></i></label>
        <input type="text" class="field-input" v-model="user.email" placeholder="Email *">
      </div>

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
@import "../assets/css/_variables.scss";

.register-container {
  background-color: #e6e6e6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  width: fit-content;
  min-width: 300px;
  padding: 20px;
  border: 3px solid #ffffff;
  border-radius: 3px;
  position: relative;

  .register-title {
    position: absolute;
    top: -35px;
    text-transform: uppercase;  
    background-color: $registerColor;
    padding: 20px 50px;
  }

  .img-container {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 1em auto;

    a {
      text-decoration: none;
    }

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #fff;
      border-radius: 50%;
    }
  }

  .form-register {
    width: 100%;
  }
}
</style>
