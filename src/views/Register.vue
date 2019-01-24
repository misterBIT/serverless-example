<template>
  <div class="register-container">
    <form @submit.prevent="register">

    <photo-capture v-if="isCameraVisible" v-model="user.imgData" style="background-color:green;width:400px"></photo-capture>
    <div v-else class="img-container" style="background-color:red;width:400px">
        <img :src="getImgUrl" alt="image">
        <button type="button" class="capture-button" @click="showCamera">+</button>
    </div>
    <input type="text" v-model="user.name" placeholder="Name *">
    <input type="text" v-model="user.email" placeholder="Email *">
    <button :disabled="!isValid" type="submit" class="vote-button">Verify Identity</button>
  </form>
  
  <pre hidden>
    {{user}}
  </pre>
  </div>
</template>

<script>

import photoCapture from '../components/PhotoCapture';

export default {
  data() {
    return {
      isCameraVisible: false,
      user: {
        name: '',
        email: '',
        imgData: ''
      }
    };
  },
  computed: {
    getImgUrl() {
      return this.$store.getters.imgUrl;
    },
    isValid() {
      return this.user.name && this.user.email && this.user.imgData
    }
  },
  methods: {
    showCamera() {
      this.isCameraVisible = true;
    },
    capturePhoto(imgData) {
      this.user.imgData = imgData
    },
    register() {
      console.log('Register', this.user);
      this.$store.dispatch({type: 'register', user: this.user})
      .then(()=>this.$router.push('/'))
      
    }
  },
  components: {
    photoCapture
  }
};
</script>

<style>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  width: fit-content;
  height: 70vh;
  padding: 50px 100px;
  border: 1px solid black;
  font-size: 20px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.capture-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 50%;
  background-color: rgb(173, 165, 165);
  height: 40px;
  width: 40px;
  color: black;
  bottom: -10px;
  right: -10px;
  border: 1px solid grey;
}

.img-container{
  position: relative;
  width: 320px;
  height: 240px;
}

.img-container a {
    text-decoration: none;
}
.vote-button{
    align-self: center;
    padding: 5px 10px;
    border-radius: 2px;
    border: 1px solid grey;
    text-align: center;
    /* background-color: rgb(173, 165, 165); */
    /* color: black; */
}

input {
    padding: 5px 10px;
    border-radius: 2px;
    border: 1px solid grey;
    width: 80%;
}

.img-container img {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
</style>
