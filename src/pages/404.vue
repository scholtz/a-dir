<template>
  <PublicLayout>
    <div class="container">
      <h1>{{ $t("404.header") }}</h1>
      <p>
        {{ $t("404.text") }}
      </p>
    </div>
  </PublicLayout>
</template>

<script>
import PublicLayout from "../layouts/Public.vue";
export default {
  components: {
    PublicLayout,
  },
};
</script>