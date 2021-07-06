const state = () => ({
  LOGO: "/img/logo.svg",
  api: "https://api.a-dir.net/api/",
  VUE_APP_API_MAP: "https://nominatim.openstreetmap.org/",
});

const mutations = {
  setConfig(state, value) {
    if (value.api) {
      state.api = value.api;
    }
  },
  setAdmin(state, value) {
    state.isAdmin = value;
  },
};
const actions = {
  async getConfig({ dispatch, commit }) {
    try {
      console.log("getConfig");
      const data = await dispatch(
        "axios/get",
        {
          url: "/config.json",
        },
        { root: true }
      );
      if (data) {
        await commit("setConfig", data);
        return data;
      }
    } catch (error) {
      dispatch("snackbar/openError", error.response, {
        root: true,
      });
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
