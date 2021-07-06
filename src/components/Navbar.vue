<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/" v-if="$store.state.config.LOGO"
        ><img
          class="mx-3"
          :src="$store.state.config.LOGO"
          height="30"
          :alt="$t('navbar.logo')"
        />
      </a>
      <a class="navbar-brand" href="/" v-else>{{ $t("navbar.logo") }}</a>

      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item m-2" v-if="$store.state.config.isAdmin">
          <RouterLink
            class="nav-link btn btn-xs btn-primary text-light"
            to="/admin"
            >Admin</RouterLink
          >
        </li>
        <li class="nav-item m-2" v-if="$store.state.config.isAdmin">
          <RouterLink class="nav-link btn btn-xs btn-primary text-light" to="/"
            >Directory</RouterLink
          >
        </li>
        <li class="nav-item active m-2">
          <RouterLink
            class="nav-link btn btn-xs btn-primary text-light"
            to="/add"
            >Add your Web/Eshop/Place</RouterLink
          >
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { mapActions } from "vuex";

import { RouterLink } from "vue-router";
export default {
  components: [RouterLink],
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      logout: "wallet/logout",
    }),
    logoutClick() {
      this.logout();
    },
    languageUpdated() {
      localStorage.setItem("lang", this.$i18n.locale);
    },
  },
};
</script>
