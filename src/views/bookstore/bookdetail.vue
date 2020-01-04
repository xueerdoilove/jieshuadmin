<template>
  <div class="container">
    <div class="bookdetail">
      <!-- 书详情 -->
      <div class="book-item">
        <div class="book-img">
          <img class="image" :src="bookData.portrait" @click="gotoimg(bookData.portrait)" />
        </div>
        <div class="book-right-c">
          <div class="book-name">{{bookData.name || bookData.bookCipName}}</div>
          <div class="book-right-left">
            <div class="book-auth">作者:{{bookData.author}}</div>
            <div class="book-auth">翻译:{{bookData.translator || '无'}}</div>
            <div
              class="book-auth"
            >出版社:{{bookData.press}} &nbsp;&nbsp;&nbsp;出版日期:{{bookData.publishDate}}</div>
            <div class="book-auth">ISBN:{{bookData.isbn}}</div>
            <div
              class="book-auth"
            >页数:{{bookData.pageCount}} &nbsp;&nbsp;&nbsp;定价:{{bookData.price/100}}元</div>
            <div class="book-stars">
              <span style="float:left;margin-right:10px;color:#888;">豆瓣评分:</span>
              <div class="book-stars-s">
                <img class="image" src="../../assets/xingxing.png" />
                <div class="bg" :style="{'width':bookData.doubanScore*10+'%'}"></div>
              </div>
              <div class="book-stars-f">{{bookData.doubanScore}}</div>
            </div>
            <div class="book-auth">
              数量:
              <span style="color:#d13f32">{{bookData.totalCnt}}</span> &nbsp;&nbsp;&nbsp;库存:
              <span style="color:#d13f32">{{kucun}}</span>&nbsp;&nbsp;&nbsp;借出总次数:
              <span style="color:#d13f32">{{bookData.borrowCnt}}</span>
            </div>
            <div class="book-auth"></div>
            <div class="book-auth"></div>
            <div class="book-auth"></div>
          </div>
        </div>
        <div class="book-right-caozuo">
          <el-button type="primary" v-if="canbianji" @click="bianjibook">编辑</el-button>
        </div>
      </div>
      <!-- 书价格&操作 -->
      <div class="priceandcaozuo">
        <div class="book-price">
          <div class="book-icon-yuan" style="margin-left:0;">
            <img class="image" src="../../assets/fei.png" />
          </div>
          <div class="book-price-num">￥ {{bookData.borrowCost/100}}元</div>
          <div class="book-icon-yuan">
            <img class="image" src="../../assets/ya.png" />
          </div>
          <div class="book-price-num">￥ {{bookData.deposit/100}}元</div>
        </div>
        <div class="stateandcaozuo">
          <!-- <el-button type="primery" @click="shangxiajia">{{bookData.state==2?'下架':'上架'}}</el-button> -->
        </div>
        <div class="stateandcaozuo">
          <span
            class="sxj"
            :class="{'color0':+bookData.state==0,'color1':+bookData.state==1,'color2':+bookData.state==2}"
          >{{bookData.state | state(storeid)}}</span>
        </div>
      </div>
      <!-- 介绍 -->
      <div class="jieshao">
        <div class="js-title">内容简介</div>
        <div class="js-content" v-html="bookData.introduction"></div>
      </div>
      <!-- 具体书的列表 -->
      <div class="jieshao" v-show="bookqrcodelist.length>0">
        <div class="js-title">库存信息</div>
        <div class="js-content">
          <el-row class="shulist">
            <el-col :span="12">编码</el-col>
            <el-col :span="12">状态</el-col>
          </el-row>
          <el-row class="shulist" v-for="item in bookqrcodelist" v-bind:key="item.id">
            <el-col :span="12">{{item.qrCode}}</el-col>
            <el-col :span="12">
              <span
                style="color:#fff"
                :class="{'color0':item.state==0,'color1':item.state==1,'color2':item.state==2,'color3':item.state==3}"
              >{{item.state | shustate}}</span>
            </el-col>
          </el-row>
        </div>
        <div style="text-align:center;margin-top:20px;padding-bottom:50px;" v-show="totalItems>=pageSize">
          <el-pagination
            background
            :total="totalItems"
            :page-size="pageSize"
            :current-page="page"
            @current-change="changepage"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
import {
  getonebook,
  putbookonline,
  delbook,
  getbookqrcodelist,
  getbookstorekucun
} from "@/api/book";

export default {
  name: "bookdetail",
  data() {
    return {
      canbianji: false, // 是否展示编辑图书按钮
      bookid: 0,
      bookData: {},
      loading: "",
      storeid: "",
      bookstateinstore: -1, // -1 书店的书 没有状态 0 下架 1 上架
      kucun: 0,
      bookqrcodelist: [], // 具体编号的书
      page: 1,
      pageSize: 5,
      totalItems: 0,
      show_edit: false // 修改书详情
    };
  },
  components: {},
  mounted() {
    if (
      localStorage.getItem("roleset").search("3") != -1 ||
      localStorage.getItem("roleset").search("4") != -1
    ) {
      this.canbianji = true;
    }
    this.bookid = this.$route.query.bookid;
    this.storeid = this.$route.query.storeid;
    this.bookstateinstore =
      this.$route.query.bookstateinstore == undefined
        ? -1
        : this.$route.query.bookstateinstore;

    if (!this.bookid) {
      this.$router.go(-1);
      return;
    }
    if (this.storeid != 0) {
      this.getbookqrcodelist(); // 查询本店的书的 状态列表
      this.getbookstorekucun(); // 查询本店的书的库存
    }
    this.getonebook();
  },
  filters: {
    state(num, storeid) {
      //下架(0),未上架(1),上架(2))
      var shudianz = "";
      if (storeid != 0) {
        shudianz = "(书店中的状态)";
      }
      if (num == 0) {
        return "下架中" + shudianz;
      } else if (num == 1) {
        return "待上架" + shudianz;
      } else {
        return "上架中" + shudianz;
      }
    },
    shustate(num) {
      //0下架,1待上架,2上架,3借阅中
      if (num == 0) {
        return "下架中";
      } else if (num == 1) {
        return "待上架";
      } else if (num == 2) {
        return "上架中";
      } else {
        return "借阅中";
      }
    }
  },
  methods: {
    // 获取图书详情
    getonebook() {
      this.loading = this.$loading({
        lock: false,
        target: document.querySelector(".app-main"),
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      getonebook(this.bookid).then(res => {
        if (this.storeid != 0) {
          if (this.bookstateinstore == 0) {
            res.item.state = 0;
          } else {
            res.item.state = 2;
          }
        }
        this.bookData = res.item;
        this.loading.close();
      });
    },
    // 获取库存
    getbookstorekucun() {
      getbookstorekucun({
        bookstoreid: this.storeid,
        bookid: this.bookid
      }).then(res => {
        this.kucun = res.item.bookCnt;
      });
    },
    // 显示修改书
    bianjibook() {
      this.show_edit = true;
    },
    hideedit() {
      this.show_edit = false;
      this.getonebook();
    },
    gotoimg(url) {
      window.open(url);
    },
    // 上下架书
    shangxiajia() {
      if (this.bookData.state == 2) {
        this.$confirm("确定下架此本书吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delbook(this.bookData.id).then(res => {
            this.$message({
              message: "下架成功",
              type: "success"
            });
            this.getonebook();
          });
        });
      } else {
        this.$confirm("确定上架此本书吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          putbookonline({ bookCipIdList: [this.bookData.id] }).then(res => {
            this.$message({
              message: "上架成功",
              type: "success"
            });
            this.getonebook();
          });
        });
      }
    },
    changepage(page){
      this.page = page;
      this.getbookqrcodelist()
    },
    // 获取实体店的图书
    getbookqrcodelist() {
      getbookqrcodelist({
        bookid: this.bookid,
        bookstoreid: this.storeid,
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.bookqrcodelist = res.items;
        this.totalItems = res.totalItems;
      });
    }
  }
};
</script>

<style scoped>
/* 顶部要固定定位   标题要居中   自定义按钮和标题要和右边微信原生的胶囊上下对齐 */
.container {
  background-color: #f8f8f8;
  min-height: 100vh;
}
.bookdetail {
  padding-top: 20px;
  width: 1000px;
  margin: 0 auto;
}

.book-img {
  border-radius: 7px;
  box-shadow: 0 5px 5px #aaa;
  width: 160px;
  height: 230px;
  float: left;
  margin-left: 20px;
  overflow: hidden;
  cursor: pointer;
}
.book-img .image {
  float: left;
  width: 100%;
  height: 100%;
}

.book-right-c {
  box-sizing: border-box;
  padding-left: 20px;
  float: left;
  width: 700px;
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
}
.book-right-left {
  max-width: 500px;
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
  margin-top: 10px;
}
.book-stars-s {
  height: 19px;
  width: 90px;
  float: left;
  position: relative;
  background-color: #aaa;
  top: -3px;
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
  font-size: 16px;
  line-height: 16px;
  color: #ce3f31;
}

.book-auth {
  color: #888;
  font-size: 18px;
  margin-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-price {
  height: 40px;
  padding-top: 10px;
  padding-left: 20px;
  float: left;
}
.book-icon-yuan {
  height: 30px;
  width: 30px;
  border-radius: 20px;
  text-align: center;
  float: left;
  margin-top: 5px;
  margin-left: 5px;
}
.book-icon-yuan .image {
  width: 100%;
  height: 100%;
}
.book-price-num {
  color: #d13f32;
  font-size: 20px;
  float: left;
  padding-left: 3px;
  padding-top: 10px;
}

.priceandcaozuo {
  clear: both;
  margin-top: 20px;
  height: 60px;
  border-radius: 10px;
  background-color: #fff;
}
.stateandcaozuo {
  float: right;
  height: 60px;
  line-height: 60px;
  margin-right: 20px;
}
.sxj {
  padding: 3px 6px;
  border-radius: 10px;
  color: #fff;
}
.color0 {
  background-color: #d13f31;
}
.color1 {
  background-color: #e6a050;
}
.color2 {
  background-color: #1f7872;
}
.color3 {
  background-color: #aaa;
}
.js-title {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #1f7872;
  font-size: 20px;
  padding-left: 20px;
}
.js-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}
.shulist {
  color: #595757;
  line-height: 30px;
  border-bottom: 1px solid #ccc;
}
</style>
