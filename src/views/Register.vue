<template>
  <div class="register-container">
    <div class="register-title">register</div>
    <form @submit.prevent="register" class="form-register">
      
      <div class="capture-container" :class="{'show': isCameraVisible}">
        <photo-capture v-if="isCameraVisible"  @done="capturePhoto"></photo-capture>
      </div>

      <div class="img-container">
        <img :src="getImgUrl" alt="image">
        <i class="fas fa-camera btn-set-photo" @click="showCamera"></i>
      </div>

      <div class="field">
        <label class="field-icon"><i class="fas fa-user"></i></label>
        <input type="text" class="field-input" v-model="user.name" placeholder="Name *">
      </div>
      
      <div class="field">
        <label class="field-icon"><i class="fas fa-envelope"></i></label>
        <input type="text" class="field-input" v-model="user.email" placeholder="Email *">
      </div>

      <div class="footer">
        <button :disabled="!isValid" type="submit" class="btn-identify">Verify Identity</button>
      </div>
    </form>
  </div>
</template>

<script>
import photoCapture from "../components/PhotoCapture";
import img from "@/assets/img/anonymous.png";

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
      return this.user.imgData || img;
    },
    isValid() {
      return this.user.name && this.user.email
    }
  },
  methods: {
    showCamera() {
      this.isCameraVisible = true;
    },
    capturePhoto(imgData) {
      this.user.imgData = imgData;
      this.isCameraVisible = false
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

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 320px;
  margin: 0 auto;
  padding: 20px;
  background-color: $registerBgColor;
  border: 3px solid #ffffff;
  border-radius: 3px;

  .register-title {
    padding: .5em 1em;
    background-color: $mainColor;
    text-transform: uppercase;  
    border-radius: 4px;
    color: $secondaryColor;
  }

  .capture-container {
    position: absolute;
    z-index: 1;
    top: 15px;
    bottom: 0;
    left: 0;
    right: 0;

    border: 1px solid #fff;
    border-bottom: none;
    padding: 0 1px;

    background-color: $registerBgColor;
    transform: translateY(500px);
    transition: transform .3s;

    &.show {
      transform: translateY(0);
    }

  }

  .img-container {
    $size: 120px;

    position: relative;
    width: $size;
    height: $size;
    margin: 1em auto;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #fff;
      border-radius: 50%;
    }

    .btn-set-photo {
      position: absolute;
      bottom: -4px;
      right: -6px;
      font-size: 35px;
    }
  }

  .form-register {
    width: 100%;
    overflow: hidden;
    position: relative;
    padding: 2px;
  }
}
</style>
