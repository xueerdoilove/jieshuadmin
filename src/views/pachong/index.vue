<template>
  <div class="dashboard-container">
    <div class="dashboard-text">管理员: {{ name }}</div>
    <h2 class="huanying">欢迎</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'pachong',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.huanying{
  margin-top: 200px;
  font-size: 30px;
  text-align: center;
}
</style>
