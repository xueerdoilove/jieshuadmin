<template>
  <div>
    <el-row  >
      <el-col :span="1" class="coupon_item" style="text-align:center;">
        <span>排序</span>
      </el-col>
      <el-col :span="3" class="coupon_item" style="text-align:center;">
        <span>封面</span>
      </el-col>
      <el-col :span="5" class="coupon_item">
        <span>书名</span>
      </el-col>
      <el-col :span="12" class="coupon_item">
        <span>介绍</span>
      </el-col>
      <el-col :span="3" class="coupon_item" style="text-align:center;">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row v-for="(bookData ,index) in list" v-bind:key="bookData.id" style="margin-top:20px;">

      <el-col :span="1" style="text-align:center;padding-top:40px;padding-left:10px">
        {{index+1}}
      </el-col>
      <el-col :span="3" style="text-align:center;">
        <img style="height:120px;" :src="bookData.portrait" alt />
      </el-col>
      <el-col :span="5">
        <div class="book-right-c">
          <div class="book-name">{{bookData.name || bookData.bookCipName}}</div>
          <div class="book-right-left">
            <div class="book-stars">
              <div class="book-stars-s">
                <img class="image" src="../../assets/xingxing.png" />
                <div class="bg" :style="{'width':bookData.doubanScore*10+'%'}"></div>
              </div>
              <div class="book-stars-f">{{bookData.doubanScore}}</div>
            </div>
            <div class="book-auth">{{bookData.author}}</div>
            <div class="book-price">
              <div class="book-icon-yuan" style="margin-left:0;">
                <img class="image" src="../../assets/fei.png" />
              </div>
              <div class="book-price-num">￥ {{bookData.borrowCost/100}}</div>
              <div class="book-icon-yuan">
                <img class="image" src="../../assets/ya.png" />
              </div>
              <div class="book-price-num">￥ {{bookData.deposit/100}}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea" style="height:120px" :value="bookData.introduction"></el-input>
      </el-col>
      <el-col :span="3" style="text-align:center" >
        <el-button>编辑</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getrecommendbookciplist } from "@/api/recommend";
export default {
  name: "newone",
  data() {
    return {
      list: []
    };
  },
  props: {},
  created() {
    var shudanid = this.$route.params.idd;
    if (!shudanid) {
      this.$router.go(-1);
      return;
    }
    getrecommendbookciplist({
      id: shudanid
    }).then(res => {
      this.list = res.items;
    });
  },
  computed: {},
  methods: {}
};
</script>
<style >
.el-textarea__inner {
  height: 100%;
}
</style>
<style scoped>
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
.book-right-c {
  box-sizing: border-box;
  padding-left: 10px;
  float: left;
}

.book-right-d {
  width: 200px;
  box-sizing: border-box;
  padding-left: 10px;
  float: left;
}

.book-name {
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
  height: 30px;
}
.book-right-left {
  max-width: 500px;
  height: 85px;
  float: left;
}
.book-right-right {
  width: 35px;
  height: 75px;
  float: left;
  box-sizing: border-box;
  border-left: 1px solid #eee;
  position: relative;
  left: -15px;
}
.book-stars {
  overflow: hidden;
  margin-top: 5px;
}
.book-stars-s {
  height: 19px;
  width: 90px;
  float: left;
  position: relative;
  background-color: #aaa;
}
.book-stars-s .image {
  width: 100%;
  height: 105%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.book-stars-s .bg {
  height: 95%;
  position: absolute;
  background-color: #ce3f31;
  top: 0;
  left: 1px;
  z-index: 2;
}
.book-stars-f {
  float: left;
  margin-left: 3px;
  font-size: 12px;
  line-height: 16px;
  color: #ce3f31;
}

.book-auth {
  color: #888;
  font-size: 18px;
  margin-top: 10px;
}

.book-price {
  height: 30px;
  margin-top: 15px;
}
.book-icon-yuan {
  height: 20px;
  width: 20px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  float: left;
  margin-left: 5px;
}
.book-icon-yuan .image {
  width: 100%;
  height: 100%;
}
.book-price-num {
  color: #d13f32;
  font-size: 15px;
  float: left;
  padding-left: 3px;
}
</style>
