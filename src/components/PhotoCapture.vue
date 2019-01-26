<template>
  <div class="photo-capture">
    <div v-if="pickImage">
      <h2>Upload a clear Photo</h2>
      <input type="file" accept="image/*" id="image-picker">
    </div>
    <div v-else class="video-container">
      <video v-if="showVideo" ref="player" autoplay playsinline width="320" height="360"></video>
      <canvas v-else ref="canvas" width="320" height="360"></canvas>
      <div class="center">
        <button type="button" class="btn-capture" @click.prevent="capture" v-if="showVideo">Capture</button>
        <button type="button" class="btn-capture" @click.prevent="cancel" v-else>🗑</button>
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
      pickImage: false,
    };
  },
  mounted() {
    this.videoPlayer = this.$refs.player;
    this.canvasElement = this.$refs.canvas;

    this.streamUserMediaVideo();
  },
  computed: {},
  methods: {
    streamUserMediaVideo() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.pickImage = true;
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (this.videoPlayer.srcObject = stream))
        .catch(err => {
          this.pickImage = true;
          console.error("could not open the camera", err);
        });
    },
    capture() {
      this.showVideo = false;
      var context = this.canvasElement.getContext("2d");
      context.drawImage(
        this.videoPlayer,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height

        // this.videoPlayer.videoHeight /
        //   (this.videoPlayer.videoWidth / this.canvasElement.width)
      );
      this.stopVideoStream();
      // const picture = this.dataURItoBlob(this.canvasElement.toDataURL());
      const picture = this.canvasElement.toDataURL();
      this.showVideo = false;
      this.$emit(EVENTS.ON_CAPTURE, picture);
    },

    cancel() {
      this.showVideo = true;
      this.streamUserMediaVideo();
      this.$emit(EVENTS.ON_CLEAR);
    },
    stopVideoStream() {
      if (!this.videoPlayer.srcObject) return;
      this.videoPlayer.srcObject.getVideoTracks().forEach(track => {
        track.stop();
      });
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
    this.stopVideoStream();
  }
};
</script>
<style lang="scss" scoped>
canvas {
  border: 1px solid lightgrey;
}
</style>