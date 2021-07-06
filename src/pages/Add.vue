<template>
  <PublicLayout>
    <div class="container-fluid">
      <div class="my-5">
        <h1 class="text-center">Please select what you want to add</h1>
      </div>
      <div
        class="
          row
          row-cols-1
          row-cols-sm-3
          row-cols-md-3
          row-cols-lg-3
          row-cols-xl-3
          row-cols-xxl-3
          g-4
        "
      >
        <div class="col">
          <div
            class="card h-100"
            role="button"
            @click="$router.push('/add/place')"
          >
            <img src="/screenshots/place.png" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">Place</h5>
              <p class="card-text">
                Place with address and GPS coordinates where you accept payments
                using algorand network
              </p>
            </div>
          </div>
        </div>
        <div class="col">
          <div
            class="card h-100"
            role="button"
            @click="$router.push('/add/eshop')"
          >
            <img src="/screenshots/eshop.png" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">E-Shop</h5>
              <p class="card-text">
                Bring new customers to your eshop by accepting algo payments, or
                ASA payments for example USDc or USDt
              </p>
            </div>
          </div>
        </div>
        <div class="col">
          <div
            class="card h-100"
            role="button"
            @click="$router.push('/add/service')"
          >
            <img src="/screenshots/realio.com.png" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">Service</h5>
              <p class="card-text">
                Wallet, Exchange, developers tool or any other service for
                algorand community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script>
import { mapActions } from "vuex";
import PublicLayout from "../layouts/Public.vue";
export default {
  components: {
    PublicLayout,
  },
  methods: {
    ...mapActions({
      getCategoryList: "api/getCategoryList",
    }),
  },
};
</script>