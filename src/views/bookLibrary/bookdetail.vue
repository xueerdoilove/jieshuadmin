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
        <div class="book-right-caozuo" v-if="canbianji">
          <el-button type="primary" @click="bianjibook">编辑书目</el-button>
          <br />
          <br />
          <br />
          <el-switch
            v-model="bookData.deliveryCycle"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#aaa"
            @change="fahuoguize"
          ></el-switch>
          {{bookData.deliveryCycle==1?'延时发货':'及时发货'}}
          <br />
          <br />
          <span style="font-size:13px;" v-show="bookData.deliveryCycle==0">及时发货: 仓库必须有这本书用户才可下单</span>
          <span
            style="font-size:13px;"
            v-show="bookData.deliveryCycle==1"
          >延时发货: 用户可以先下单购买,仓库进货后再邮寄给用户</span>
        </div>
        <div style="clear:both;padding-left:20px;">
          <el-button @click="showfengm" type="primery">修改封面图</el-button>
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
      <!-- 分类 -->
      <div class="jieshao">
        <div class="js-title">
          <span>所属分类</span>
          <el-button
            @click="showfenleibianji()"
            type="primery"
            style="float:right"
            v-if="canbianji"
          >编辑</el-button>
        </div>
        <div class="js-content" style="overflow:hidden;">
          <div class="catitem" v-for="cat in catlist" :key="cat.id">{{cat.categoryName}}</div>
        </div>
      </div>
      <!-- 介绍 -->
      <div class="jieshao">
        <div class="js-title">
          <span>内容简介</span>
          <el-button @click="showfuwenben(1)" type="primery" style="float:right" v-if="canbianji">编辑</el-button>
        </div>
        <div class="js-content" v-html="introduction"></div>
      </div>
      <!-- 作者简介 -->
      <div class="jieshao">
        <div class="js-title">
          <span>作者简介</span>
          <el-button
            @click="showfuwenben(2)"
            type="primery"
            style="float:right"
            v-if="canbianji"
          >{{authorinfo.id?'编辑':'添加'}}</el-button>
        </div>
        <div class="js-content" v-html="authorinfo.introduction"></div>
      </div>
      <!-- 目录 -->
      <div class="jieshao">
        <div class="js-title">
          <span>目录</span>
          <el-button
            @click="showfuwenben(3)"
            type="primery"
            style="float:right"
            v-if="canbianji"
          >{{contents.id?'编辑':'添加'}}</el-button>
        </div>
        <div class="js-content" v-html="contents.contents"></div>
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
        <div
          style="text-align:center;margin-top:20px;padding-bottom:50px;"
          v-show="totalItems>=pageSize"
        >
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

      <!-- 修改书的详情 -->
      <el-dialog title="修改书目详情" :visible.sync="show_edit">
        <editbook v-if="show_edit" :bookData="bookData" @hideedit="hideedit" />
      </el-dialog>

      <!-- 富文本 -->
      <el-dialog :title="tijiaotype | tijiaotype" :visible.sync="show_fuwenben">
        <div v-if="show_fuwenben">
          <div id="butGroup" class="editorhead">
            <el-tooltip
              class="item"
              effect="dark"
              content="返回上一步"
              placement="bottom"
              :open-delay="1000"
            >
              <input onclick="editor.undo()" type="button" style="background-position:0 -168px;" />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="返回下一步"
              placement="bottom"
              :open-delay="1000"
            >
              <input
                onclick="editor.redo()"
                type="button"
                style="background-position:0 -198px;opacity: .3;"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="清除样式"
              placement="bottom"
              :open-delay="1000"
            >
              <input
                onclick="editor.clearStyle()"
                type="button"
                style="background-position:0 -890px;"
              />
            </el-tooltip>
          </div>
          <iframe class="contenteditablebody" id="contenteditable"></iframe>
          <div>
            <el-button type="primary" @click="tijiaoxinxi">提交</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 编辑标签 -->
      <el-dialog title="所属分类修改" :visible.sync="show_biaoqian">
        <div v-if="show_biaoqian">
          <el-select v-model="selectcatlist" style="width:500px;" multiple placeholder="请选择">
            <el-option-group v-for="group in allcatlist" :key="group.id" :label="group.name">
              <el-option
                v-for="item in group.categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-option-group>
          </el-select>
          <div style="margin-top:30px;">
            <el-button type="primary" @click="tijiaofenlei">提交修改</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 编辑标签 -->
      <el-dialog title="修改封面图" :visible.sync="show_fm">
        <div v-if="show_fm">
          <el-row>
            <el-col :span="16">
              <el-upload
                id="picturediv1212"
                class="upload-demo"
                ref="upload"
                action
                :on-remove="handleRemove"
                :on-change="handleChange"
                :file-list="imglist1"
                :multiple="false"
                :limit="1"
                list-type="picture"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <span
                  style="margin-left:20px;"
                  slot="tip"
                  class="el-upload__tip"
                >只能上传jpg/png文件，且不超过500kb,宽高比7:10</span>
              </el-upload>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-button @click="tijiaotupian">提交图片</el-button>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getonebook,
  putbookonline,
  delbook,
  getbookqrcodelist,
  getbookstorekucun,
  getinfo,
  setinfo,
  getauthorinfo,
  setauthorinfo,
  getcontents,
  setcontents,
  getcatofbookcip,
  putdeliverycycle,
  postbookcipcategory,
  putbookcipcover
} from "@/api/book";
import { getcatlist } from "@/api/classification";
import { getbaseconfiglist } from "@/api/baseconfig";

import editbook from "./editbook";
export default {
  name: "bookdetail",
  data() {
    return {
      canbianji: false, // 是否展示编辑图书按钮
      bookid: 0,
      bookData: {},

      introduction:'',
      
      info: { id: 0 },
      contents: { id: 0 },
      authorinfo: { id: 0 },
      catlist: [], // 书目的所以分类
      allcatlist: [], // 所以分类
      loading: "",
      storeid: "",
      bookstateinstore: -1, // -1 书店的书 没有状态 0 下架 1 上架
      kucun: 0,
      bookqrcodelist: [], // 具体编号的书
      page: 1,
      pageSize: 5,
      totalItems: 0,
      show_edit: false, // 修改书详情

      show_fuwenben: false, // 显示富文本
      tijiaotype: 0,

      show_biaoqian: false,
      selectcatlist: [],

      show_fm: false,
      imglist1: [],
      picture: "",
    };
  },
  components: {
    editbook
  },
  mounted() {
    this.mgetbaseconfiglist()
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
    this.getcatofbookcip(); // 获取书目的所以分类
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
    tijiaotype(num) {
      if (num == 1) {
        //书目简介
        return "书目简介提交";
      } else if (num == 2) {
        // 作者简介
        return "作者简介提交";
      } else {
        // 目录
        return "目录提交";
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
    mgetbaseconfiglist() {
      getbaseconfiglist({ state: this.state }).then(res => {
        res.items.forEach(element => {
          if(element.seq==2){
            localStorage.setItem('baseconfigbili',element.value)
          }
        });
      });
    },
    handleRemove(file, fileList) {
      this.picture = "";
    },
    handleChange(file, fileList) {
      console.log(file);
      //生成canvas
      var self = this;
      var imgurl = file.url;
      var img = document.createElement("img");
      img.src = imgurl;

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var quality = 1; // 默认图片质量为0.7
      var imgobj;
      img.onload = function() {
        var that = this;
        // 默认按比例压缩
        var w = 600,
          h = (600 / that.width) * that.height;

        imgobj = { width: w, height: h };
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        var base64 = canvas.toDataURL("image/png", quality);
        self.picture = base64;
      };
    },
    tijiaotupian() {
      if (this.picture == "") {
        this.$message("请选择本地电脑上的一张图片");
        return;
      }
      var formData = new FormData();
      formData.append("path", convertBase64UrlToBlob(this.picture), "fmt.jpg");

      //图片格式转化
      function convertBase64UrlToBlob(urlData) {
        var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {
          type: "image/jpg"
        });
      }
      putbookcipcover(this.bookid, formData).then(res => {
        if (res) {
          this.$message({
            message: "操作失败!请重新登录"
          });
          aapp.$store.dispatch("user/logout");
          aapp.$router.push(`/login`);
        } else {
          this.picture = "";
          this.imglist1 = [];
          this.show_fm = false;
          this.getonebook();
          this.$message({
            message: "修改成功!",
            type: "success"
          });
        }
      });
    },
    showfengm() {
      this.show_fm = true;
    },

    tijiaofenlei() {
      postbookcipcategory({
        id: this.bookid,
        categoryIdList: this.selectcatlist
      }).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.getcatofbookcip();
        this.show_biaoqian = false;
      });
    },
    // 分类编辑展示
    showfenleibianji() {
      if (this.allcatlist.length == 0) {
        getcatlist({
          parentId: -1,
          state: 2,
          page: 1,
          pageSize: 1000
        }).then(res => {
          this.allcatlist = res.items;
          this.show_biaoqian = true;
        });
      } else {
        this.show_biaoqian = true;
      }

      this.selectcatlist = [];
      for (var i = 0; i < this.catlist.length; i++) {
        this.selectcatlist.push(this.catlist[i].categoryId);
      }
    },
    // 发货规则
    fahuoguize(num) {
      putdeliverycycle({
        bookcipid: this.bookid,
        deliveryCycle: num
      }).then(res => {
        console.log(res);
      });
    },
    // 获取书目的所以分类
    getcatofbookcip() {
      getcatofbookcip({ bookCipId: this.bookid }).then(res => {
        this.catlist = res.items;
      });
    },
    // 展示富文本编辑器
    showfuwenben(num) {
      this.show_fuwenben = true;
      this.tijiaotype = num;
      setTimeout(() => {
        window.editor = new Weditor("contenteditable");
        if (num == 1) {
          //书目简介
          window.editor.html(this.introduction);
        } else if (num == 2) {
          // 作者简介
          window.editor.html(this.authorinfo.introduction);
        } else {
          // 目录
          window.editor.html(this.contents.contents);
        }
      });
    },
    tijiaoxinxi() {
      var num = this.tijiaotype;
      if (num == 1) {
        //书目简介
        this.setinfo();
      } else if (num == 2) {
        // 作者简介
        this.setauthorinfo();
      } else {
        // 目录
        this.setcontents();
      }
    },
    // 获取简介
    getinfo() {
      getinfo({ bookCipId: this.bookid }).then(res => {
        if (res.item.id) {
          this.info = res.item;
          this.introduction = res.item.introduction;
        }
      });
    },
    setinfo() {
      setinfo({
        bookCipId: this.bookid,
        introduction: window.editor.html(),
        type: this.info.id ? "put" : "post"
      }).then(res => {
        this.show_fuwenben = false;
        this.getonebook()
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
    },
    // 获取目录
    getcontents() {
      getcontents({ bookCipId: this.bookid }).then(res => {
        if (res.item.id) {
          this.contents = res.item;
          this.bookData.contents = res.item.contents;
        }
      });
    },
    setcontents() {
      setcontents({
        bookCipId: this.bookid,
        contents: window.editor.html(),
        type: this.contents.id ? "put" : "post"
      }).then(res => {
        this.show_fuwenben = false;
        this.getcontents();
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
    },
    // 获取作者简介
    getauthorinfo() {
      getauthorinfo({ bookCipId: this.bookid }).then(res => {
        if (res.item.id) {
          this.authorinfo = res.item;
        }
      });
    },
    setauthorinfo() {
      console.log(this.authorinfo);
      setauthorinfo({
        bookCipId: this.bookid,
        introduction: window.editor.html(),
        type: this.authorinfo.id ? "put" : "post"
      }).then(res => {
        this.show_fuwenben = false;
        this.getauthorinfo();
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
    },
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
        res.item.deliveryCycle = res.item.deliveryCycle + "";
        this.bookData = res.item;
        this.loading.close();
        this.getinfo(); // 获取书目简介
        this.getauthorinfo();
        this.getcontents();
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

      //categoryId
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
    changepage(page) {
      this.page = page;
      this.getbookqrcodelist();
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
  width: 1100px;
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
  margin-bottom: 20px;
  color: #1f7872;
  font-size: 20px;
  padding-left: 20px;
}
.js-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  clear: both;
}
.shulist {
  color: #595757;
  line-height: 30px;
  border-bottom: 1px solid #ccc;
}
.editorhead {
  background-color: #eee;
  padding: 5px 10px 3px 10px;
}
.editorhead input {
  height: 20px;
  width: 20px;
  display: inline-block;
  overflow: hidden;
  background: url(../../assets/editor.png) no-repeat;
  border: none;
  padding: 0;
  cursor: pointer;
  box-sizing: border-box;
}
.editorhead input:hover {
  box-shadow: 0 0 1px #000;
}
.contenteditablebody {
  width: 100%;
  height: 400px;
}
.catitem {
  padding: 5px 10px;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #aaa;
  float: left;
}
</style>
