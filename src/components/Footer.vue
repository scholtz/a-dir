<template>
  <footer class="text-muted">
    <a @click="prolong" class="btn btn-xs btn-light float-end">
      {{ t }}
    </a>
    <div class="text-center">
      &copy; 2021 Scholtz &amp; Company, jsa |
      <RouterLink to="/terms">Terms and Conditions, GDPR</RouterLink>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      t: "",
    };
  },
};
</script>
