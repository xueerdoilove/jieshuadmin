<template>
  <div class="container">
    <el-row>
      <el-col :span="14">
        <!-- <el-radio-group v-model="state" @change="changetiaojian" style="margin-top:10px;">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">删除的</el-radio>
        </el-radio-group>&nbsp;-->
      </el-col>
      <el-col :span="4">
        <!-- <el-button type="primary" @click="shownew">{{show_new?'-收起':'+新增'}}</el-button> -->
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="2">
        <span>排序</span>
      </el-col>
      <el-col :span="4">
        <span>配置名</span>
      </el-col>
      <el-col :span="4">
        <span>配置值</span>
      </el-col>
      <el-col :span="6">
        <span>描述</span>
      </el-col>
      <el-col :span="4">
        <span>状态</span>
      </el-col>
      <el-col :span="4">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in baseconfiglist" v-bind:key="item.id">
      <el-col :span="2">
        <span>{{item.seq}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.configValue | zhanshi(item.seq)}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.description}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.state?'正常的':'删除的'}}</span>
      </el-col>
      <el-col :span="4" style="padding-top:20px;">
        <el-button @click="showedit(item.id)">编辑</el-button>
      </el-col>
    </el-row>

    <div
      v-show="baseconfiglist.length==0"
      style="line-height:100px;text-align:center;"
    >没有查到相应条件下的基础配置</div>
    <el-dialog title="编辑基础配置" :visible.sync="show_edit">
      <editbaseconfig v-if="show_edit" @hideedit="hideedit" />
    </el-dialog>
  </div>
</template>

<script>
import { getbaseconfiglist } from "@/api/baseconfig";
import Editbaseconfig from "./edit";
export default {
  named: "优惠券",
  data() {
    return {
      show_edit: false,
      show_new: false,
      baseconfiglist: [],
      page: 1,
      pageSize: 100,
      state: 1

      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {
    this.mgetbaseconfiglist();
  },
  components: {
    Editbaseconfig
  },
  filters: {
    zhanshi(value, seq) {
      if (seq == 1) {
        return value/100+'元'
      } else if (seq == 2) {
        return value+'%'
      } else if (seq == 3) {
        return value+'分钟'
      } else if (seq == 4) {
        return value+'天'
      }
    }
  },
  computed: {},
  methods: {
    // 弹出优惠券编辑
    showedit(id) {
      this.baseconfiglist.forEach(item => {
        if (item.id == id) {
          localStorage.setItem("editbaseconfig", JSON.stringify(item));
          return;
        }
      });
      this.show_edit = true;
    },
    hideedit() {
      this.show_edit = false;
      this.mgetbaseconfiglist();
    },
    changetiaojian() {
      this.page = 1;
      this.mgetbaseconfiglist();
    },
    mgetbaseconfiglist() {
      getbaseconfiglist({ state: this.state }).then(res => {
        this.baseconfiglist = res.items;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
}
.coupon_item {
  height: 80px;
  border-bottom: 1px solid #eee;
}
.coupon_item span {
  display: inline-flex;
  height: 80px;
  flex-direction: column;
  justify-content: center;
}
</style>
