<template>
  <div>
    <el-row>
      <el-col :span="1" class="coupon_item" style="text-align:center;">
        <span>排序</span>
      </el-col>
      <el-col :span="3" class="coupon_item" style="text-align:center;">
        <span>封面</span>
      </el-col>
      <el-col :span="5" class="coupon_item">
        <span>书名</span>
      </el-col>
      <el-col :span="7" class="coupon_item">
        <span>介绍</span>
      </el-col>
      <el-col :span="4" class="coupon_item">
        <span>推荐理由</span>
      </el-col>
      <el-col :span="4" class="coupon_item" style="text-align:center;">
        <el-button type="primary" @click="addone()" style="margin-top:20px;">加一本书</el-button>
      </el-col>
    </el-row>
    <el-row v-for="(bookData ,index) in list" v-bind:key="bookData.id" style="margin-top:20px;">
      <el-col :span="1" style="text-align:center;padding-top:40px;padding-left:10px">{{index+1}}</el-col>
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
      <el-col :span="7">
        <el-input type="textarea" style="height:120px" :value="bookData.introduction"></el-input>
      </el-col>
      <el-col :span="4" style="text-align:center;padding-top:40px;">{{bookData.reason}}</el-col>

      <el-col :span="4" style="text-align:center">
        <el-button @click="removethis(bookData.id)" style="margin-bottom:20px;">删除</el-button>
        <el-button @click="putthis(bookData.id)">修改推荐理由</el-button>
      </el-col>
    </el-row>
    <div v-show="list.length==0" style="line-height:100px;text-align:center;">书单没有书籍</div>
    <el-dialog title="添加书籍" :visible.sync="show_add">
      <el-row>
        <el-col :span="4" style="text-align:center;">
          <span>书名/编号/作者</span>
        </el-col>
        <el-col :span="16" style="text-align:center;">
          <el-input v-model="bookname"></el-input>
        </el-col>
        <el-col :span="4" style="text-align:center;">
          <el-button @click="searchbook">搜索</el-button>
        </el-col>
      </el-row>

      <el-row v-for="bookData in booklist" v-bind:key="bookData.id">
        <el-col :span="4" style="margin-top:40px;overflow:hidden;">
          <el-radio v-model="bookid" :label="bookData.id">{{bookData.name}}</el-radio>
        </el-col>
        <el-col :span="20">
          <div class="book-item">
            <div class="book-img">
              <img class="image" :src="bookData.portrait" />
            </div>
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
          </div>
        </el-col>
      </el-row>
      <div
        style="height:150px;text-align:center;line-height:150px;color:#888"
        v-show="booklist.length==0"
      >请搜索并选择一本书</div>
      <div style="padding-top:30px;">
        <el-button type="primary" @click="addbooktorecommend">添加书籍至书单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getrecommendbookciplist,
  delrecommendbookcip,
  addrecommendbookcip,
  putrecommendbookcip
} from "@/api/recommend";
import { bookcipsearch } from "@/api/book";
export default {
  name: "newone",
  data() {
    return {
      list: [],
      show_add: false,
      bookname: "",
      booklist: [],
      bookid: 0
    };
  },
  props: {},
  created() {
    this.getbookciplist();
  },
  computed: {},
  methods: {
    getbookciplist() {
      var shudanid = this.$route.query.idd;
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
    putthis(id) {
      this.$prompt("请输入推荐理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\u4E00-\u9FA5][\u4e00-\u9fa5A-Za-z0-9]*/,
        inputErrorMessage: "请输入推荐理由"
      })
        .then(({ value }) => {
          putrecommendbookcip({
            id: id,
            reason: value
          }).then(res => {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.getbookciplist();
          });
        })
        .catch(() => {});
    },
    removethis(id) {
      this.$confirm("确定删除本书吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delrecommendbookcip({ id: id }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getbookciplist();
          });
        })
        .catch(() => {});
    },
    addone() {
      this.show_add = true;
    },
    searchbook() {
      bookcipsearch({
        name: this.bookname,
        state: 2
      }).then(res => {
        this.booklist = res.items;
        if (res.items[0]) {
          this.bookid = res.items[0].id;
        } else {
          this.bookid = 0;
        }
      });
    },
    addbooktorecommend() {
      var shudanid = this.$route.query.idd;
      if (this.bookid == 0) {
        this.$message("请搜素并选择一本书,在进行提交");
        return;
      } else {
        this.$prompt("请输入推荐理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[\u4E00-\u9FA5][\u4e00-\u9fa5A-Za-z0-9]*/,
          inputErrorMessage: "请输入推荐理由"
        })
          .then(({ value }) => {
            addrecommendbookcip({
              id: shudanid,
              recommendBookCipList: [
                {
                  bookCipId: this.bookid,
                  reason: value
                }
              ]
            }).then(res => {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.show_add = false;
              this.getbookciplist();
            });
          })
          .catch(() => {});
      }
    }
  }
};
</script>
<style >
.el-textarea__inner {
  height: 100%;
}
</style>
<style scoped>
.book-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
}

.book-img {
  border-radius: 7px;
  box-shadow: 0 5px 5px #aaa;
  width: 80px;
  height: 112px;
  float: left;
  margin-left: 12px;
  overflow: hidden;
}
.book-img .image {
  float: left;
  width: 100%;
  height: 100%;
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
  overflow: hidden;
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
