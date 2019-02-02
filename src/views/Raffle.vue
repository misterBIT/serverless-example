<template>
  <section class="raffle center">
    <h2>Raffle!</h2>
    <!-- <ul>
      <li v-for="voterName in voterNames" :key="voterName">{{voterName}}</li>
    </ul>-->
    <div class="picked" :class="{final: isFinalPick}">
      <h1>{{theVoterName}}</h1>
    </div>
    <button class="btn" @click="raffle">Raffle Now!</button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      theVoterName: "",
      isRaffleRunning: false,
      isFinalPick: false
    };
  },
  computed: {
    voterNames() {
      return this.$store.getters.shuffeledVoterNames;
    }
  },
  methods: {
    raffle() {
      if (this.isRaffleRunning) return;
      this.isFinalPick = false;

      var delay = 100;
      var timeout;
      const runRaffle = () => {
        this.pickOne();
        if (this.isRaffleRunning) {
          timeout = setTimeout(runRaffle, delay);
        }
      };
      this.isRaffleRunning = true;
      runRaffle();
      const interval = setInterval(() => {
        delay = parseInt(delay * 1.2);
        if (delay > 1000) {
          this.isRaffleRunning = false;
          clearInterval(interval);
          clearTimeout(timeout);
          this.isFinalPick = true;
        }
      }, 1000);
    },
    pickOne() {
      const voters = this.$store.getters.shuffeledVoterNames;
      const idx = parseInt(Math.random() * voters.length);
      this.theVoterName = voters[idx];
    }
  }
};
</script>
<style>
.picked {
  border: 1px solid gray;
  width: 300px;
  margin: auto;
  text-align: center;
  transition: 1s;
}
.final {
  background-color: gold;
  animation: animateBG 2s infinite;
}

@keyframes animateBG {
  0% {
    background: #c60000;
  }
  50% {
    background: gold;
  }
  100% {
    background: #c60000;
  }
}
</style>

