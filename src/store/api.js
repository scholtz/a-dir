import base64url from "base64url";

const state = () => ({
  searchResults: {},
  placeDetail: {},
});

const mutations = {
  async setSearchResults(state, data) {
    state.searchResults = data;
  },
  async setPlaceDetail(state, data) {
    state.placeDetail = data;
  },
};
const actions = {
  async getCategoryList({ dispatch }, { cat }) {
    console.log("cat", cat);
    let url = this.state.config.api + "category/";
    if (cat) url = url + base64url(cat);
    return await dispatch(
      "axios/get",
      {
        url,
      },
      { root: true }
    );
  },
  async getUnresolved({ dispatch }) {
    return await dispatch(
      "axios/get",
      {
        url: this.state.config.api + "unresolved",
      },
      { root: true }
    );
  },
  async getInfo({ dispatch }, { id, ip }) {
    let url = this.state.config.api + "info/" + id;
    if (ip) url = url + "/" + ip;
    return await dispatch(
      "axios/get",
      {
        url,
      },
      { root: true }
    );
  },
  async addPlace({ dispatch }, data) {
    console.log("addPlace", data);
    return await dispatch(
      "axios/post",
      {
        url: this.state.config.api + "addPlace",
        body: data,
      },
      { root: true }
    );
  },
  async deleteItem({ dispatch }, { id, ip }) {
    console.log("deleteItem", id);
    return await dispatch(
      "axios/post",
      {
        url: this.state.config.api + "deleteItem/" + id + "/" + ip,
      },
      { root: true }
    );
  },

  async addService({ dispatch }, data) {
    return await dispatch(
      "axios/post",
      {
        url: this.state.config.api + "addService",
        body: data,
      },
      { root: true }
    );
  },
  async addEShop({ dispatch }, data) {
    return await dispatch(
      "axios/post",
      {
        url: this.state.config.api + "addEShop",
        body: data,
      },
      { root: true }
    );
  },
  async search({ dispatch, commit }, { searchQuery }) {
    console.log("searchQuery", searchQuery);
    if (!searchQuery) return;
    const data = await dispatch(
      "axios/get",
      {
        url: `${this.state.config.VUE_APP_API_MAP}search?format=geojson&q=${searchQuery}`,
      },
      { root: true }
    );
    if (data) {
      commit("setSearchResults", data);
      return data;
    }
  },
  async getPlaceDetail({ dispatch, commit }, { placeId } = {}) {
    if (!placeId) return;
    const data = await dispatch(
      "axios/get",
      {
        url:
          this.state.config.VUE_APP_API_MAP +
          "api/v1/Map/PlaceDetail?placeId=" +
          placeId,
      },
      { root: true }
    );
    if (data) {
      commit("setPlaceDetail", data);
      return data;
    }
  },
  async reverseAddress({ dispatch }, { lat, lng }) {
    let address = "Unresolved address";
    try {
      const result = await dispatch(
        "axios/get",
        {
          url: `${this.state.config.VUE_APP_API_MAP}api/v1/Map/Reverse?lat=${lat}&lng=${lng}`,
        },
        { root: true }
      );
      if (result?.length > 0) {
        address = result[0].formattedAddress;
      }
      return address;
    } catch (e) {
      console.error("Reverse Geocode Error->", e);
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
