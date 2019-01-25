import Vue from "vue";
import Vuex from "vuex";
import firebaseService from "./services/firebase.service";
import cloudinaryService from "./services/cloudinary.service";

import img from "@/assets/img/anonymous.png";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    votes: [],
    imgUrl: img
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
    vote({ commit, state }, { candidate }) {
      var user = state.user;
      user.voteForCandidate = candidate;
      return firebaseService
        .add("vote", user)
        .then(() => commit("setUser", user));
    },
    register({ commit }, { user }) {
      const u = {
        email: user.email,
        name: user.name,
        imageUrl: '',
        voteForCandidate: null
      };
      if (user.imgData) {
        return cloudinaryService.upload(user.imgData).then(res => {
          u.imgUrl = res.url;
          commit("setUser",u);
        });
      }
      commit("setUser", u);

    }
  },
  getters: {
    votes: state => state.votes,
    isAdmin: state => state.user && state.user.name === "admin",
    candidates: state => {
      return state.votes.reduce((acc, vote) => {
        if (!acc[vote.voteForCandidate]) acc[vote.voteForCandidate] = 0;

        acc[vote.voteForCandidate]++;
        return acc;
      }, {});
    },
    imgUrl: state => state.imgUrl
  }
});

const onVoteUpdate = votes => {
  store.commit("setVotes", votes);
};

firebaseService.subscribe("vote", onVoteUpdate);

export default store;
