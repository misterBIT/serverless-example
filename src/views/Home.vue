<template>
  <div class="home center">
    <section v-if="!user">
      <h1>Identify Yourself</h1>
      <router-link class="btn-register" to="/register">Register</router-link>
    </section>
    <section v-else>
      <img class="img-user" :src="user.imageUrl">
    </section>

    <section>
      <h1>Who will guide Eurovision 2019?</h1>
      <section :disabled="!user" class="candidate" @click="vote('Assi & Rotem')">
        <img src="../assets/img/candidate1.jpg">
        <h3>Assi & Rotem</h3>
      </section>
      <section :disabled="!user" class="candidate" @click="vote('Erez & Bar')">
        <img src="../assets/img/candidate2.jpg">
        <h3>Erez & Bar</h3>
      </section>
    </section>

    <section class="vote-results" v-if="user && user.voteForCandidate">
      <h1>Election Results</h1>
      <bar-chart :chart-data="candidates"/>
      <button @click="electionDone">Election Done</button>
      <ol>
        <li v-for="vote in votes" :key="vote.id">{{vote.name}} for {{vote.voteForCandidate}}</li>
      </ol>
    </section>
  </div>
</template>

<script>
import BarChart from "@/components/BarChart";
import firebaseService from "@/services/firebase.service";

export default {
  name: "home",
  components: {
    BarChart
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    votes() {
      return this.$store.getters.votes;
    },
    candidates() {
      const candidates = this.$store.getters.candidates;
      return Object.keys(candidates).map(key => ({
        name: key,
        value: candidates[key]
      }));
    }
  },
  methods: {
    vote(candidate) {
      if (!this.user) return;
      this.$store.dispatch({ type: "vote", candidate });
    },
    electionDone() {
      firebaseService.sendPush();
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Lato:400,400i,700");

.candidate {
  display: inline-block;
  // width:220px;
  margin: 5px;
  border: 1px solid gray;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  transition: 0.5s;
  cursor: pointer;
  transition: all 0.5s;
}

.candidate:hover {
  background-color: gold;
}

.btn-register {
  background-color: beige;
}
.center {
  text-align: center;
}

.img-user {
  width: 200px;
  border-radius: 50%;
}

.vote-results {
  background-color: lightgrey;
  padding: 1em;
}
</style>

