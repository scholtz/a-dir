import { createStore } from "vuex";
import axios from "./axios";
import config from "./config";
import api from "./api";
import toast from "./toast";

const debugStrict = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    axios,
    config,
    api,
    toast,
  },
  strict: debugStrict,
});
