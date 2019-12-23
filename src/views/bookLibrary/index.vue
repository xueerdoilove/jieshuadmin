<template>
  <transition name="fade-transform" mode="out-in">
    <router-view :key="key" />
  </transition>
</template>

<script>
export default {
  named: "书库信息",
  data() {
    return {};
  },

  computed: {
    key() {
      return this.$route.path;
    }
  },
  mounted() {}
};
</script>

