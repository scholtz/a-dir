import axios from "axios";

export default class TagService {
  search(e, that) {
    return axios
      .get(that.$store.state.config.api + "autocomplete/" + e)
      .then((res) => res.data.data);
  }
}
