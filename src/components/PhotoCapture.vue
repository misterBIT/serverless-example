<template>
  <div class="photo-capture" v-show="enableCamera">
    <div v-if="pickImage">
      <h2>Upload a clear Photo</h2>
      <input type="file" accept="image/*" id="image-picker">
    </div>
    <div v-else class="video-container">
      <video v-show="showVideo" ref="player" autoplay playsinline></video>
      <canvas v-show="!showVideo" ref="canvas"></canvas>
      <div class="center">
        <button type="button" class="btn-capture" @click.prevent="capture" v-if="showVideo">Capture</button>
        <div v-else>
          <button type="button" class="btn-capture" @click.prevent="cancel"><i class="fas fa-undo-alt"></i></button>
          <button type="button" class="btn-capture" @click.prevent="done"><i class="fas fa-thumbs-up"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const EVENTS = {
  ON_DONE: "done",
  ON_CLEAR: "clear"
};

export default {
  props: {
    enableCamera: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showVideo: true,
      pickImage: false,
      picture: null
    };
  },
  mounted() {
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
        .then(stream => (this.$refs.player.srcObject = stream))
        .catch(err => {
          this.pickImage = true;
          console.error("could not open the camera", err);
        });
    },
    capture() {
      this.showVideo = false;
      var context = this.$refs.canvas.getContext("2d");
      context.drawImage(
        this.$refs.player,
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      this.stopVideoStream();
      this.picture = this.$refs.canvas.toDataURL();
      this.showVideo = false;
    },

    done() {
      this.$emit(EVENTS.ON_DONE, this.picture);
    },

    cancel() {
      this.showVideo = true;
      this.streamUserMediaVideo();
      this.$emit(EVENTS.ON_CLEAR);
    },
    stopVideoStream() {
      if (! (this.$refs.player && this.$refs.player.srcObject)) return;
      this.$refs.player.srcObject.getVideoTracks().forEach(track => {
        track.stop();
      });
    },
  },
  destroyed() {
    this.stopVideoStream();
  }
};
</script>

<style lang="scss" scoped>
.video-container {

  video {
    width: 100%;
    height: 250px;
    margin-top: -12px;
  }
  
  canvas {
    width: 100%;
    height: 223px;
    padding: 2px 0 13px 0;
  }

  button {
    &:not(:last-child) {
      margin-right: 20px;
    }
  }
}

</style>