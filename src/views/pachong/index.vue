<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{shenfen}}: {{ name }}</div>
    <h2 class="huanying">欢迎</h2>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "pachong",
  data() {
    return {
      shenfen: "",
      user: { rules: "" }
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  mounted() {
    console.log(this.$router.options.routes)
    setTimeout(() => {
      var rules = localStorage.getItem("roleset");
      if (rules.search("4") != -1) {
        this.user.rules = "最高管理员";
      } else if (rules.search("3") != -1) {
        this.user.rules = "门店管理员";
      } else if (rules.search("2") != -1) {
        this.user.rules = "门店店员";
      } else if (rules.search("1") != -1) {
        this.user.rules = "普通用户";
      }
      if (localStorage.getItem("bookStoredata")) {
        var a = JSON.parse(localStorage.getItem("bookStoredata"));
        this.shenfen = a.name + "的" + this.user.rules;
      } else {
        this.shenfen = "最高管理者";
      }
    }, 1500);
  }
};
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
.huanying {
  margin-top: 200px;
  font-size: 30px;
  text-align: center;
}
</style>
