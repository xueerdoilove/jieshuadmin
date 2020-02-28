<template>
  <div>
    <div style="padding-bottom:20px;">
      <el-radio-group v-model="addtype">
        <el-radio-button label="1">爬豆瓣链接添加</el-radio-button>
        <el-radio-button label="2">手动录入添加</el-radio-button>
      </el-radio-group>
    </div>
    <el-form ref="form" :rules="rules" :model="new_one" label-width="120px" v-show="addtype==2">
      <el-form-item label="书店名称" prop="name">
        <el-input class="riqi" v-model="new_one.name"></el-input>
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input class="riqi" type="text" v-model="new_one.author"></el-input>
      </el-form-item>

      <el-form-item label="出版日期">
        <el-input
          class="riqi"
          type="text"
          maxlength="10"
          v-model="new_one.publishDate"
          placeholder="示例(2014年5月1号输入2014-5-1)"
        ></el-input>
      </el-form-item>

      <el-form-item label="图书ISBN" prop="isbn">
        <el-input class="riqi" type="number" v-model="new_one.isbn"></el-input>
      </el-form-item>

      <el-form-item label="出版社" prop="pressId">
        <el-select
          style="width:400px;"
          v-model="new_one.pressId"
          filterable
          remote
          @change="setpressname"
          placeholder="请搜索一个出版社,并选择"
          :remote-method="getpressListbyname"
          :loading="false"
        >
          <el-option v-for="item in presslist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="翻译者" prop="translator">
        <el-input class="riqi" maxlength="15" type="text" v-model="new_one.translator"></el-input>
      </el-form-item>

      <el-form-item label="简介" prop="introduction">
        <el-input class="riqi" type="textarea" v-model="new_one.introduction"></el-input>
      </el-form-item>

      <el-form-item label="图书页数" prop="pageCount">
        <el-input class="riqi" type="text" maxlength="6" v-model="new_one.pageCount"></el-input>
      </el-form-item>

      <el-form-item label="图书价格(元)" prop="price">
        <el-input
          class="riqi"
          type="text"
          maxlength="5"
          placeholder="最小价格到分 0.01"
          v-model="new_one.price"
        ></el-input>
      </el-form-item>

      <el-form-item label="押金(元)" prop="deposit">
        <el-input
          class="riqi"
          type="text"
          maxlength="5"
          placeholder="最小价格到分 0.01"
          v-model="new_one.deposit"
        ></el-input>
      </el-form-item>

      <el-form-item label="借阅费(元)" prop="borrowCost">
        <el-input
          class="riqi"
          type="text"
          maxlength="5"
          placeholder="最小价格到分 0.01"
          v-model="new_one.borrowCost"
        ></el-input>
      </el-form-item>

      <el-form-item label="豆瓣评分" prop="doubanScore">
        <el-input class="riqi" type="text" maxlength="3" v-model="new_one.doubanScore"></el-input>
      </el-form-item>

      <el-form-item label="分类" prop="categoryIdList">
        <el-select
          style="width:400px;"
          v-model="new_one.cat"
          multiple
          placeholder="请选择书目属于的分类,可多选"
          @change="setcatelist"
        >
          <el-option v-for="item in catlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="图书版式" prop="bookFormat">
        <el-switch
          style="display: block;margin-top:8px;color:#ccc"
          v-model="new_one.bookFormat"
          active-color="#13ce66"
          inactive-color="#cccccc"
          active-text="精装"
          inactive-text="平装"
        ></el-switch>
      </el-form-item> -->

      <el-form-item label="封面图" prop="picture">
        <el-upload
          id="picturediv"
          class="upload-demo"
          ref="upload"
          action
          :on-remove="handleRemove"
          :on-change="handleChange"
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
          >只能上传jpg/png文件，且不超过500kb,宽200px,高280px</span>
        </el-upload>
        <input style="display:none;" type="text" v-model="new_one.portrait" />
        <img style="width:200px;" :src="new_one.portrait" v-if="new_one.portrait.length<1000" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">创建</el-button>
      </el-form-item>
    </el-form>

    <el-form
      ref="form2"
      :model="newpachong"
      :rules="rules2"
      label-width="120px"
      v-show="addtype==1"
    >
      <el-form-item label="豆瓣链接" prop="url">
        <el-input
          class="riqi"
          v-model="newpachong.url"
          placeholder="如: https://book.douban.com/subject/34926621/?icn=index-latestbook-subject"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitpachong('form2')" :loading="isloading">创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { postbookcip, postdoubanbook } from "@/api/book";
import { getpressListbyname } from "@/api/press";
import { getcatList } from "@/api/cat";

export default {
  name: "newbook",
  data() {
    const phonepipei = (rule, value, callback) => {
      if (/^[0-9](.[0-9]{1})?$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入10以内的数字,例如9.1"));
      }
    };
    const numberd = (rule, value, callback) => {
      if (/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入数字"));
      }
    };
    return {
      isloading: false,
      addtype: 1,
      presslist: [], // 出版社的 列表
      catlist: [],
      categoryIdList: [],
      newpachong: {
        url: ""
      },
      new_one: {
        categoryIdList: "",
        id: "",
        name: "", //-> 书名
        author: "", //-> 著者
        publishDate: "", //-> 出版日期
        isbn: "", //-> 图书ISBN
        pressId: "", //-> 出版社id
        press: "", // -> 出版社
        translator: "", //-> 译者
        introduction: "", // -> 简介
        portrait: " ", // -> 图书封面图片
        pageCount: "", //-> 图书页数
        price: "", //-> 图书价格
        deposit: 0, //-> 押金
        borrowCost: 0, // -> 借阅费
        doubanScore: 0, // -> 图书豆瓣评分
        // bookFormat: 0
      },
      rules2: {
        url: [
          { required: true, message: "请输入豆瓣书籍链接", trigger: "blur" }
        ]
      },
      rules: {
        categoryIdList: [
          { required: true, message: "请至少选择一个所属分类", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入书目名称", trigger: "blur" },
          { min: 2, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        pressId: [
          { required: true, message: "请选择一个出版社", trigger: "blur" }
        ],
        author: [
          { required: true, message: "请输入书目作者", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],

        isbn: [
          {
            required: true,
            message: "请输入书目isbn,并且为纯数字",
            trigger: "change"
          },
          { max: 13, message: "长度为13个字符", trigger: "blur" }
        ],

        introduction: [
          { min: 3, max : 64 ,message: "长度在 3 到 64 个字符", trigger: "blur" },
          { required: true, message: "请输入书目简介", trigger: "blur" }
        ],

        pageCount: [
          {
            validator: numberd,
            required: true,
            trigger: "blur"
          }
        ],

        price: [
          {
            validator: numberd,
            required: true,
            trigger: "blur"
          }
        ],

        deposit: [
          {
            validator: numberd,
            required: true,
            trigger: "blur"
          }
        ],

        borrowCost: [
          {
            validator: numberd,
            required: true,
            trigger: "blur"
          }
        ],

        doubanScore: [
          {
            validator: phonepipei,
            required: true,
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {},
  computed: {},
  mounted() {
    this.getcatList();
  },
  methods: {
    setcatelist(e) {
      this.new_one.categoryIdList = e.join(",");
      console.log(this.new_one.categoryIdList);
    },
    getcatList() {
      getcatList({
        parentId: -1,
        state: 2,
        page: 1,
        pageSize: 3000
      }).then(res => {
        var arr = [];
        res.items.forEach(item => {
          item.categoryList.forEach(cat => {
            arr.push(cat);
          });
        });
        this.catlist = arr;
      });
    },
    getpressListbyname(name) {
      getpressListbyname({
        state: 1,
        name: name,
        page: 1,
        pageSize: 10
      }).then(res => {
        this.presslist = res.items;
      });
    },
    setpressname(pressid) {
      this.presslist.forEach(item => {
        if (item.id == pressid) {
          this.new_one.press = item.name;
        }
      });
    },
    handleRemove(file, fileList) {
      this.new_one.portrait = "";
    },
    handleChange(file, fileList) {
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
        var w = 400,
          h = (400 / that.width) * that.height;

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
        self.new_one.portrait = base64;
      };
    },
    onSubmitpachong(formName) {
      if (this.isloading) {
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.newpachong.url.search("https://book.douban.com/subject/") != 0
          ) {
            this.$message({
              message: "请输入正确的链接"
            });
            return;
          }
          this.isloading = true;
          postdoubanbook(this.newpachong)
            .then(res => {
              this.newpachong.url = "";
              this.isloading = false;

              this.$message({
                message: "添加成功",
                type: "success"
              });
              // this.$emit("hidenew");
              //http://localhost:9527/#/skbook/pachong/bookdetail?bookid=26638&storeid=0
              this.$router.push({
                path: "./bookdetail",
                query: {
                  bookid: res.item.id,
                  storeid: 0
                }
              });
            })
            .catch(error => {
              this.isloading = false;

            });
        }
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          for (var key in this.new_one) {
            if (
              key == "portrait" ||
              key == "price" ||
              key == "deposit" ||
              key == "borrowCost" ||
              key == "bookFormat"
            ) {
              continue;
            }
            formData.append(key, this.new_one[key]);
          }
          formData.append("price", this.new_one["price"]);
          formData.append("deposit", this.new_one["deposit"]);
          // formData.append("bookFormat", this.new_one["bookFormat"] ? 1 : 0);
          formData.append("borrowCost", this.new_one["borrowCost"]);
          if (this.new_one["portrait"].length > 1000) {
            formData.append(
              "portrait",
              convertBase64UrlToBlob(this.new_one["portrait"]),
              "fmt.jpg"
            );
          }
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
          postbookcip(formData).then(res => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$emit("hidenew");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.riqi {
  width: 400px;
}
.el-select {
  width: 130px;
  margin-right: 10px;
}
</style>
