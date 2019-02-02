import Vue from "vue";
import Vuex from "vuex";
import firebaseService from "./services/firebase.service";
import cloudinaryService from "./services/cloudinary.service";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    votes: [],
  },
  mutations: {
    setVotes(state, votes) {
      state.votes = votes;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    async vote({ commit, state }, { candidate }) {
      var user = state.user;
      user.voteForCandidate = candidate;
      await firebaseService.add("vote", user)
      commit("setUser", user)
    },
    async register({ commit }, { user }) {
      const u = {
        email: user.email,
        name: user.name,
        imgUrl: '',
        voteForCandidate: null
      };
      commit("setUser",u);

      if (user.imgData) {
        const res = await cloudinaryService.upload(user.imgData)
        u.imgUrl = res.url;
        commit("setUser",u);
      }
    }
  },
  getters: {
    votes: state => state.votes,
    isAdmin: state => state.user && state.user.name === "admin",
    candidates: state => {
      return state.votes.reduce((candidateCountMap, vote) => {
        if (!candidateCountMap[vote.voteForCandidate]) candidateCountMap[vote.voteForCandidate] = 0;

        candidateCountMap[vote.voteForCandidate]++;
        return candidateCountMap;
      }, {});
    },
    voters: state => {
      return state.votes.reduce((voterCountMap, vote) => {
        if (!voterCountMap[vote.name]) voterCountMap[vote.name] = { votesCount: 0, imgUrl: vote.imgUrl };

        voterCountMap[vote.name].votesCount++;
        return voterCountMap;
      }, {});
    }
  }
});

const onVoteUpdate = votes => {
  store.commit("setVotes", votes || []);
};

firebaseService.subscribe("vote", onVoteUpdate);

export default store;
