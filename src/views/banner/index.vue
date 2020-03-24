<template>
  <div class="container">
    <el-row class="tianjian_tou">
      <el-col :span="4">
        <el-select
          class="riqi"
          style="margin-bottom:20px;"
          v-model="adsType"
          @change="changepage(1)"
        >
          <el-option
            v-for="searchdtype in searchtypelist"
            :key="searchdtype.id"
            :label="searchdtype.name"
            :value="searchdtype.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="15" :offset="1">
        <el-form label-width="80px">
          <el-form-item label="状态:">
            <el-radio-group v-model="state" @change="changepage(1)">
              <el-radio :label="2">使用中</el-radio>
              <el-radio :label="1">待上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary" @click="addnewone">+新增</el-button>
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col style="text-align:center;" :span="4">
        <span>图片</span>
      </el-col>
      <el-col style="text-align:center;" :span="3">
        <span>名称</span>
      </el-col>
      <el-col style="text-align:center;" :span="7">
        <span>描述</span>
      </el-col>
      <el-col :span="4">
        <span>类型</span>
      </el-col>
      <el-col :span="6">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in bannerlist" v-bind:key="item.id">
      <el-col style="text-align:center;" :span="4">
        <span>
          <img style="height:80px;" :src="item.picture" />
        </span>
      </el-col>
      <el-col style="text-align:center;" :span="3">
        <span>{{item.name}}</span>
      </el-col>
      <el-col style="text-align:center;" :span="7">
        <span>{{item.description}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.adsType | adsType}}</span>
      </el-col>
      <el-col :span="6" style="padding-top:20px;">
        <el-button @click="putimg(item)">修改图片</el-button>
        <el-button v-show="state==2" @click="xiajia(item.id)">下架</el-button>
        <el-button v-show="state==1" @click="shangjia(item.id)">上架</el-button>
      </el-col>
    </el-row>

    <el-row class="tiaojian_item" v-show="totalItems>=pageSize">
      <el-col :span="20" :offset="2" style="text-align:center;">
        <el-pagination
          background
          :total="totalItems"
          :page-size="pageSize"
          :current-page="page"
          @current-change="changepage"
          layout="prev, pager, next"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog title="新增首页轮播图" :visible.sync="show_new">
      <newBanner v-if="show_new" @hidenew="hidenew" />
    </el-dialog>

    <el-dialog title="修改封面图" :visible.sync="show_editimg">
      <newBannerimg v-if="show_editimg" @hidenew="hidenew" />
    </el-dialog>
  </div>
</template>

<script>
import { getbannerlist, putadsstate } from "@/api/baseconfig";
import NewBanner from "./new";
import NewBannerimg from "./editimg";
export default {
  named: "banner",
  data() {
    return {
      isupimg: false,
      adsType: 0,
      searchtypelist: [
        { id: 0, name: "跳转到书目类型" },
        { id: 1, name: "跳转到书单类型" }
      ],
      state: 2, //0
      sk: "time",
      so: "desc",
      bannerlist: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,

      show_new: false,

      show_editimg: false
    };
  },
  mounted() {
    this.changepage(1);
  },
  components: {
    NewBanner,
    NewBannerimg
  },
  filters: {
    adsType(num) {
      if (num == 0) {
        return "跳转到书目类型";
      } else {
        return "跳转到书单类型";
      }
    }
  },
  computed: {},
  methods: {
    shangjia(id) {
      this.$confirm("确定上架架这个banner吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          putadsstate(id, { state: 2 }).then(res => {
            this.getbannerlist();
          });
        })
        .catch(() => {});
    },
    xiajia(id) {
      this.$confirm("确定下架这个banner吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          putadsstate(id, { state: 0 }).then(res => {
            this.getbannerlist();
          });
        })
        .catch(() => {});
    },
    putimg(item) {
      localStorage.setItem("banneritem", JSON.stringify(item));
      this.show_editimg = true;
    },
    getbannerlist() {
      getbannerlist({
        page: this.page,
        pageSize: this.pageSize,
        so: this.so,
        sk: this.sk,
        adsType: this.adsType,
        state: this.state
      }).then(res => {
        this.bannerlist = res.items;
        this.totalItems = res.totalItems;
      });
    },
    changepage(page) {
      this.page = page;
      this.getbannerlist();
    },
    addnewone() {
      this.show_new = true;
    },
    hidenew() {
      this.show_editimg = false;
      this.show_new = false;
      this.changepage(1);
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
  clear: both;
}
.coupon_item span {
  display: inline-flex;
  height: 80px;
  flex-direction: column;
  justify-content: center;
}
</style>
