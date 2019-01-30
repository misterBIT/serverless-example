<template>
  <div class="home center">
    <button class="btn-done" @click="electionDone" v-show="isAdmin">Election Done</button>
    <section v-if="!user">
      <h1>Please Identify</h1>
      <router-link class="btn-register" to="/register">Identify</router-link>
    </section>
    <section v-else>
      <img class="img-user" :src="user.imgUrl">
    </section>

    <section :class="{muted : !user}">
      <h1>Who will guide Eurovision 2019?</h1>
      <div class="candidates" :class="{disabled : !user, voted: voted}">
        <section @click="vote('Vue')">
          <img src="../assets/img/vue.png">
          <h3>Vue</h3>
        </section>
        <section @click="vote('React')">
          <img src="../assets/img/react.png">
          <h3>React</h3>
        </section>
        <section @click="vote('Angular')">
          <img src="../assets/img/angular.png">
          <h3>Angular</h3>
        </section>
      </div>
    </section>

    <section class="vote-results" v-if="user && user.voteForCandidate">
      <h1>Election Results</h1>
      <bar-chart :chart-data="candidates"/>
      <hr>
      <div>
        <h2>Best Voter:</h2>
        <img class="img-most-voter" :src="mostVoter.imgUrl">
        <div>{{mostVoter.name}} voted {{mostVoter.votes}} times</div>
      </div>
      <ul>
        <li class="voter" v-for="voter in votersWithImg" :key="voter">
          <img class="img-voter" :src="voter.imgUrl" />
        </li>
      </ul>
      <div>
        <button class="btn-show" @click="shouldShowVoters=!shouldShowVoters">Show all Voters</button>
      </div>
      <ol v-if="shouldShowVoters">
        <li v-for="vote in votes" :key="vote.id">
          <span>{{vote.name}}</span>
          for
          <span>{{vote.voteForCandidate}}</span>
        </li>
      </ol>
    </section>
  </div>
</template>

<script>
import BarChart from "@/components/BarChart";
import firebaseService from "@/services/firebase.service";

export default {
  name: "home",
  data() {
    return {
      shouldShowVoters: false
    };
  },
  components: {
    BarChart
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    voted() {
      return this.$store.state.user && this.$store.state.user.voteForCandidate;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
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
    },
    mostVoter() {
      const voters = this.$store.getters.voters;

      let most = Object.keys(voters).reduce((prev, current) =>
        voters[prev].votesCount > voters[current].votesCount ? prev : current
      );

      return {
        name: most,
        votes: voters[most].votesCount,
        imgUrl: voters[most].imgUrl
      };
    },
    votersWithImg() {
      const voters = this.$store.getters.voters;
      return Object.values(voters).filter(voter => voter.imgUrl);
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
</style>

