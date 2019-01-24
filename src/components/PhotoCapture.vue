<template>
  <div class="image-picker">
    <div v-if="pickImage">
      <h6>Pick an Image</h6>
      <input type="file" accept="image/*" id="image-picker">
    </div>
    <div v-else class="video-container">
      <video
        class="video"
        ref="player"
        autoplay
        :style="videoStyle"
        playsinline
      ></video>
      <canvas ref="canvas" :style="canvasStyle"></canvas>
      <div class="actions is-clearfix">
        <button
          type="button"
          @click.prevent="capture"
          class="button is-warning is-rounded is-large"
          v-show="!captured"
        >Capture</button>
        <button
          type="button"
          class="button is-danger is-rounded is-pulled-right"
          @click.prevent="cancel"
          v-show="captured"
        >🗑</button>
      </div>
    </div>
  </div>
</template>
<script>
const EVENTS = {
  ON_CAPTURE: "input",
  ON_CLEAR: "clear"
};

export default {
  props: {},
  data() {
    return {
      showVideo: true,
      pickImage: true,
      stream: null,
      captured: false
    };
  },
  created() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.pickImage = false;
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (this.videoPlayer.srcObject = stream))
        .catch(err => {
          this.pickImage = true;
          console.error("could not open the camera", err);
        });
    }
  },
  mounted() {
    this.videoPlayer = this.$refs.player;
    this.canvasElement = this.$refs.canvas;
  },
  computed: {
    videoStyle() {
      return { display: this.showVideo ? "block" : "none" };
    },
    canvasStyle() {
      return { display: this.showVideo ? "none" : "block" };
    }
  },
  methods: {
    capture() {
      this.showVideo = false;
      var context = this.canvasElement.getContext("2d");
      context.drawImage(
        this.videoPlayer,
        0,
        0,
        this.canvasElement.width,
        this.videoPlayer.videoHeight /
          (this.videoPlayer.videoWidth / this.canvasElement.width)
      );
      this.videoPlayer.srcObject.getVideoTracks().forEach(track => {
        track.stop();
      });
      // const picture = this.dataURItoBlob(this.canvasElement.toDataURL());
      const picture = this.canvasElement.toDataURL();
      this.captured = true;
      this.$emit(EVENTS.ON_CAPTURE, picture);
    },

    cancel() {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.videoPlayer.srcObject = stream;
          this.showVideo = true;
          this.captured = false;
        })
        .catch(err => {
          console.log("could not get stream", err);
          this.showVideo = false;
        });
      this.$emit(EVENTS.ON_CLEAR);
    },
    dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    }
  },
  destroyed() {
    if (this.videoPlayer.srcObject) {
      this.videoPlayer.srcObject.getVideoTracks().forEach(track => {
        track.stop();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.image-picker {

}
form {
  width: 100%;
}
form input {
  width: 100%;
}
.video-container {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  position: relative;
}
.actions {
  position: absolute;
  text-align: center;
  left: 5px;
  right: 5px;
  bottom: 5px;
}

</style>