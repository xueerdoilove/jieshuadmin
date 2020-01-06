<template>
  <div class="container">
    <div class="detailcart" style="width:1200px;margin:20px auto 0;">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <img
                v-if="imglist[0]"
                class="imgone"
                @click="openinnewwindow(imglist[0].path)"
                :src="imglist[0].path"
                alt
              />
              <div v-if="!imglist[0]" @click="showaddimg" class="addimg">+</div>
            </el-col>
            <el-col :span="18">
              <div class="storename">
                {{detail.name}}
                <span @click="showputdetail" class="bianji">编辑</span>
              </div>
              <div class="options " >
                <span>实体店推广码:</span>
                {{detail.shareCode || '未设置'}}<span v-show="detail.shareCode" @click="showErweima" class="bianji">编辑</span>
              </div>
              <div class="options">
                <span>地址:</span>
                {{detail.address}}
              </div>
              <div class="options">
                <span>电话:</span>
                {{detail.mobile}}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" v-if="imglist[1]">
              <img
                class="imgxiam"
                @click="openinnewwindow(imglist[1].path)"
                :src="imglist[1].path"
                alt
              />
            </el-col>
            <el-col :span="6" v-if="imglist[2]">
              <img
                class="imgxiam"
                @click="openinnewwindow(imglist[2].path)"
                :src="imglist[2].path"
                alt
              />
            </el-col>
            <el-col :span="6" v-if="imglist[3]">
              <img
                class="imgxiam"
                @click="openinnewwindow(imglist[3].path)"
                :src="imglist[3].path"
                alt
              />
            </el-col>
            <el-col :span="6" v-if="imglist[0]">
              <div @click="showaddimg" class="addimg">+</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" style="border-left:1px solid #aaa;padding-left:20px;">
          <div class="options">
            <span>图书数量:</span>
            {{bookCnt}}
          </div>
          <div class="options">
            <span>会员数:</span> 0
          </div>
          <div class="options">
            <span>收入:</span>0
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <br />
          <div>简介</div>
          <div class="introduction">{{detail.introduction}}</div>
        </el-col>
      </el-row>
    </div>

    <div class="detailcart" style="width:1200px;margin:20px auto 0;">
      <div style="line-height:80px;">
        <el-form label-width="80px" >
          <el-form-item label="状态:">
            <el-radio-group v-model="bookstate" @change="changepage(1)">
              <el-radio :label="1">上架中</el-radio>
              <el-radio :label="0">已下架</el-radio>
            </el-radio-group>
            <span style="float:right">(上架书库里面的书请到管理员小程序中扫码上架)</span>
          </el-form-item>
        </el-form>
      </div>
      <el-row class="book_div">
        <el-col :span="12" v-for="book in booklist" v-bind:key="book.id">
          <bookbigitem :bookData="book" @getbooklist="changepage(page)" />
        </el-col>
      </el-row>
      <div style="text-align:center;margin-top:20px;">
        <el-pagination
          v-show="totalItems>=pageSize"
          background
          :total="totalItems"
          :page-size="pageSize"
          :current-page="page"
          @current-change="changepage"
          layout="prev, pager, next"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="实体店详情" :visible.sync="show_detail">
      <storedetail v-if="show_detail" :state="state" :new_oned="detail" @hidedetail="hidedetail" />
    </el-dialog>

    <el-dialog title="实体店图片列表" :visible.sync="show_imglist">
      <div style="overflow:hidden;">
        <div v-for="img in imglist" v-bind:key="img.id" class="imglistitem">
          <el-row>
            <el-col :span="12">
              <img :src="img.path" @click="openinnewwindow(img.path)" alt />
            </el-col>
            <el-col :span="12" style="text-align:right">
              <el-button @click="delthisimg(img.id)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <div style="clear:both;">
          <el-row>
            <el-col :span="16">
              <el-upload
                id="picturediv1"
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
                >只能上传jpg/png文件，且不超过500kb,宽高比4:3</span>
              </el-upload>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-button @click="tijiaotupian">提交图片</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>


    <el-dialog title="实体店推广码" :visible.sync="show_sharecode">
      <div>
        <div v-show="detail.shareCode">
          {{detail.shareCode}}
          <div id="qrcode"></div>
        </div>
        <div v-show="!detail.shareCode">
          <div>实体店的分享码只能设置一次不支持修改,请确认好再提交,分享码6位数字从100000递增,不可重复</div>
          <span>分享码</span>
          <el-input
            style="width:300px;margin-left:30px;"
            placeholder="请填写二维码"
            v-model="new_sharecode"
          ></el-input>
          <br />
          <br />
          <el-button @click="saveSharecode">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getstoreList,
  getstorebyid,
  bindstoreSharecode,
  getbindstoreSharecode,
  getresource,
  delresource,
  postpictrue,
  getbookcnt,
  getbookcipbystore
} from "@/api/store";
import Storedetail from "./detail";
import Bookbigitem from "../bookLibrary/bookbigitem";
import QRCode from "qrcodejs2";
export default {
  named: "书店详情",
  data() {
    return {
      state: "",
      shudanid: "",
      show_detail: false,
      detail: {},
      bookCnt: 0, // 书店图书数量
      show_sharecode: false, // 推广码 开关
      new_sharecode:'',
      
      imglist: [],
      show_imglist: false,
      imglist1: [],
      picture: "",

      booklist: [],
      page: 1,
      sk: "time",
      so: "asc",
      bookstate: 1,
      pageSize: 6,
      totalItems: 0
    };
  },
  components: {
    Storedetail,
    Bookbigitem
  },
  mounted() {
    this.shudanid = this.$route.query.idd;
    if (!this.shudanid) {
      this.$router.go(-1);
      return;
    }
    this.state = this.$route.query.state;
    this.getstore();
    this.getresource();
    this.getbookcnt(); // 书店所以书的数量
    this.getbookcipbystore();
  },
  methods: {
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
        this.$message('请选择本地电脑上的一张图片')
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
      postpictrue(this.shudanid, formData).then(res => {
        this.picture = "";
        this.imglist1 = [];
        this.getresource();
        this.$message({
          message: "添加成功!",
          type: "success"
        });
      });
    },
    showaddimg() {
      this.show_imglist = true;
    },
    delthisimg(id) {
      this.$confirm("确定删除此图片吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delresource({ id: id }).then(res => {
          this.getresource();
          this.$message({
            message: "删除成功!",
            type: "success"
          });
        });
      });
    },
    showErweima() {
      
      if (this.detail.sharecode) {
        setTimeout(() => {
          //httpsopen.weixin.qq.comsnsgetexpappinfoappid=wx8aacda7758e56069&path=pages%2Findex%2Findex%2Findex.html%3FshareCode%3D123457#wechat-redirect
          document.getElementById("qrcode").innerHTML = "";
          new QRCode("qrcode", {
            text:
              "https://open.weixin.qq.com/sns/getexpappinfo?appid=wx8aacda7758e56069&path=pages%2Findex%2Findex%2Findex.html%3FshareCode%3D" +
              this.detail.sharecode +
              "#wechat-redirect",
            width: 512,
            height: 512,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }, 300);
      }
      this.show_sharecode = true;
      this.new_sharecode = "";
    },
    saveSharecode() {
      if (this.new_sharecode.length < 3) {
        this.$message.error("请输入分享码");
        return;
      }
      this.$confirm(
        "确定设置此实体店的分享码吗?只能设置一次不支持修改哦",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        var data = {
          id: this.detail.id,
          shareCode: this.new_sharecode
        };

        bindstoreSharecode(data)
          .then(res => {
            this.show_sharecode = false;
            this.getstoreList();
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    getbookcipbystore() {
      // ?bookStoreId=2&page=1&pageSize=200
      getbookcipbystore({
        bookStoreId: this.shudanid,
        page: this.page,
        pageSize: this.pageSize,
        state: this.bookstate
      }).then(res => {
        res.items.forEach(item => {
          item.storeid = this.shudanid;
          item.state = this.bookstate
          item.mendianshu = true// 门店书目的标记
        });
        this.booklist = res.items;
        this.totalItems = res.totalItems;
      });
    },
    changepage(e) {
      this.page = e;
      this.getbookcipbystore();
    },
    openinnewwindow(url) {
      window.open(url);
    },
    getstore() {
      getstorebyid({ id: this.shudanid }).then(res => {
        this.detail = res.item;
        this.state = res.item.state;
      });
    },
    getbookcnt() {
      getbookcnt({ id: this.shudanid }).then(res => {
        this.bookCnt = res.item.bookCnt;
      });
    },
    getresource() {
      //state=1&sk=xx&so=xx&page=1&pageSize=2
      getresource({ id: this.shudanid, state: 1, page: 1, pageSize: 100 }).then(
        res => {
          this.imglist = res.items;
        }
      );
    },
    showputdetail() {
      this.show_detail = true;
    },
    hidedetail() {
      this.show_detail = false;
      this.getstore();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #efefef;
  padding: 30px;
  min-height: calc(100vh - 50px);
}
.detailcart {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}
.storename {
  line-height: 40px;
  font-size: 22px;
}
.bianji {
  color: #1f7872;
  margin-left: 5px;
  cursor: pointer;
}
.storename span {
  font-size: 16px;
}
.imgone {
  width: 120px;
}
.options {
  margin-top: 10px;
}
.options span {
  font-weight: 600;
}
.introduction {
  margin-top: 10px;
  padding-bottom: 10px;
  line-height: 22px;
}
.imgxiam {
  width: 100px;
  margin-top: 20px;
}
.addimg {
  margin-top: 20px;
  width: 120px;
  height: 80px;
  border-radius: 10px;
  line-height: 80px;
  background-color: #efefef;
  color: #444;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
}
.imglistitem {
  margin-bottom: 12px;
  margin-right: 12px;
  width: 45%;
  float: left;
  border: 1px solid #aaa;
  padding: 10px;
  border-radius: 10px;
}
.imglistitem img {
  height: 100px;
}
</style>
