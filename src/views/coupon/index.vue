<template>
  <div class="container">
    <el-row>
      <el-col :span="6">
        <el-select v-model="bookStoreId" @change="mgetcouponList" placeholder="请选择门店">
          <el-option
            v-for="store in storelist"
            :key="store.id"
            :label="store.name"
            :value="store.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="14">
        <el-radio-group
          v-show="bookStoreId>-1"
          v-model="state"
          @change="changetiaojian"
          style="margin-top:10px;"
        >
          <el-radio :label="2">上线中</el-radio>
          <el-radio :label="1">待上线</el-radio>
          <el-radio :label="0">删除的</el-radio>
        </el-radio-group>&nbsp;
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="shownew">{{show_new?'-收起':'+新增'}}</el-button>
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col style="text-align:center;" :span="4">
        <span>封面图</span>
      </el-col>
      <el-col style="text-align:center;" :span="4">
        <span>起止时间/有效时长</span>
      </el-col>
      <el-col :span="4">
        <span>优惠券名</span>
      </el-col>
      <el-col :span="6">
        <span>介绍</span>
      </el-col>
      <el-col :span="6">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in couponlist" v-bind:key="item.id">
      <el-col style="text-align:center;" :span="4">
        <img style="height:70px;float:left;margin-top:5px;" :src="item.picture" />
      </el-col>
      <el-col style="text-align:center;" :span="4">
        <span>{{item.startDate?item.startDate+ ' 到 ' +item.endDate :item.validDays+'天'}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.introduction}}</span>
      </el-col>
      <el-col :span="6" style="padding-top:20px;">
        <el-button @click="showedit(item.id)">编辑</el-button>
        <el-button v-show="state!=2" @click="shangxian(item.id)">上线</el-button>
        <el-button v-show="state==2&&bookStoreId!=-1" @click="shanchu(item.id)">删除</el-button>
        <el-button v-show="bookStoreId!=-1" @click="putzhiding(item.id)">置顶</el-button>
        <el-button v-show="bookStoreId==-1" @click="deletezhiding(item.id)">取消置顶</el-button>
      </el-col>
    </el-row>
    <div v-show="couponlist.length==0" style="line-height:100px;text-align:center;">没有查到相应条件下的优惠券</div>
    <el-dialog title="新增优惠券" :visible.sync="show_new">
      <newCoupon v-if="show_new" :bookStoreId="bookStoreId" @hidenew="hidenew" />
    </el-dialog>

    <el-dialog title="编辑优惠券" :visible.sync="show_edit">
      <editCoupon v-if="show_edit" @hideedit="hideedit" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getcouponList,
  deletecoupon,
  shangxiancoupon,
  getzhiding,
  putzhiding,
  deletezhiding
} from "@/api/coupon";
import { getstoreList } from "@/api/store";
import NewCoupon from "./new";
import EditCoupon from "./edit";
// import { mapGetters } from 'vuex'
export default {
  named: "优惠券",
  data() {
    return {
      show_edit: false,

      storelist: [{ name: "通用优惠券", id: 0 }],
      show_new: false,
      couponlist: [],
      bookStoreId: -1,
      page: 1,
      pageSize: 100,
      state: 2

      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {
    if (!localStorage.getItem("storelist")) {
      this.getstorelist();
    } else {
      this.storelist = JSON.parse(localStorage.getItem("storelist"));
      if (this.storelist[0].id == 0) {
        this.storelist.unshift({ name: "置顶优惠券", id: -1 });
      }
    }
    this.mgetcouponList();
  },
  components: {
    NewCoupon,
    EditCoupon
  },
  computed: {},
  methods: {
    shangxian(id) {
      this.$confirm("确定上线此优惠券吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          shangxiancoupon({ id: id }).then(res => {
            this.$message({
              message: "优惠券上线成功",
              type: "success"
            });
            this.mgetcouponList();
          });
        })
        .catch(() => {});
    },
    shanchu(id) {
      //api/coupon/{id}
      this.$confirm("确定删除此优惠券吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletecoupon({ id: id }).then(res => {
            this.$message({
              message: '优惠券删除成功!',
              type: 'success'
            });
            this.mgetcouponList();
          });
        })
        .catch(() => {});
    },
    putzhiding(id) {
      this.$prompt("请输入置顶值，数值越大越靠前", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[1-9][1-9]*$/,
        inputErrorMessage: "请输入数字"
      })
        .then(({ value }) => {
          putzhiding({
            id: id,
            onTop: value
          }).then(res => {
            this.$message({
              type: "success",
              message: "置顶成功"
            });
          });
        })
        .catch(() => {});
    },
    deletezhiding(id) {
      this.$confirm("确定取消此优惠券的置顶吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletezhiding({
            id: id
          }).then(res => {
            this.$message({
              type: "success",
              message: "取消置顶成功"
            });
            this.mgetcouponList();
          });
        })
        .catch(() => {});
    },
    // 弹出优惠券编辑
    showedit(id) {
      this.couponlist.forEach(item => {
        if (item.id == id) {
          localStorage.setItem("editcoupon", JSON.stringify(item));
          return;
        }
      });
      this.show_edit = true;
    },
    hideedit() {
      this.show_edit = false;
      this.mgetcouponList();
    },
    shownew() {
      this.show_new = !this.show_new;
    },
    hidenew() {
      this.show_new = false;
      this.mgetcouponList();
    },
    changetiaojian() {
      this.page = 1;
      this.mgetcouponList();
    },
    mgetcouponList() {
      //bookStoreId=0&couponType=-1&state=1&sk=xx&so=xx&page=1&pageSize=2
      // ruleType 0: 有效日期，1：限时间段
      // obtainType : 0:发放， 1：领取
      // startTime -> startDate
      // endTime-> endDate
      if (this.bookStoreId == -1) {
        getzhiding({}).then(res => {
          if (res.item.id) {
            this.couponlist = [res.item];
          } else {
            this.couponlist = [];
          }
        });
      } else {
        getcouponList({
          bookStoreId: this.bookStoreId,
          page: this.page,
          pageSize: this.pageSize,
          state: this.state,
          couponType: this.couponType,
          sk: this.sk,
          so: this.so
        }).then(res => {
          this.couponlist = res.items;
        });
      }
    },
    getstorelist() {
      getstoreList({
        page: 1,
        pageSize: 100,
        state: 2 //state：状态：0停业,1未开业,2开业（默认值：1）
      })
        .then(res => {
          this.storelist = [
            { name: "置顶优惠券", id: -1 },
            { name: "通用优惠券", id: 0 },
            ...res.items
          ];
          localStorage.setItem(
            "storelist",
            JSON.stringify([{ name: "通用优惠券", id: 0 }, ...res.items])
          );
        })
        .catch(error => {});
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
