<template>
  <footer>
    <a @click="prolong" class="btn btn-xs btn-light float-end">
      {{ t }}
    </a>
    <div class="text-center">&copy; 2021 Scholtz &amp; Company, jsa</div>
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
