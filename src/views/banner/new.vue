<template>
  <div>
    <el-form ref="form" :rules="rules" :model="newcoupon" label-width="120px">
      <el-form-item label="跳转类型">
        <el-select class="riqi" v-model="newcoupon.adsType" placeholder="请选择轮播图跳转类型">
          <el-option label="跳转到书目类型" value="0"></el-option>
          <el-option label="跳转到书单类型" value="1"></el-option>
          <el-option label="跳转到广告页" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名字" prop="name">
        <el-input class="riqi" v-model="newcoupon.name"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input class="riqi" type="textarea" v-model="newcoupon.description"></el-input>
      </el-form-item>

      <el-form-item label="书籍" v-if="newcoupon.adsType==0" prop="linkId">
        <el-select
          style="width:400px;"
          v-model="newcoupon.linkId"
          filterable
          remote
          @change="setpressname"
          placeholder="请搜索一个书籍,并选择"
          :remote-method="getbookListbyname"
          :loading="false"
        >
          <el-option v-for="item in booklist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="书单" v-if="newcoupon.adsType==1" prop="linkId">
        <el-select
          style="width:400px;"
          v-model="newcoupon.linkId"
          @change="setpressname"
          placeholder="请搜索一个书单,并选择"
        >
          <el-option v-for="item in shudanlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="newcoupon.adsType==2" label="广告页图片" prop="linkId1">
        <el-upload
          id="picturediv1"
          class="upload-demo"
          ref="upload"
          action
          :on-remove="handleRemove1"
          :on-change="handleChange1"
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
          >只能上传jpg/png文件，且不超过500kb,宽700px,高度不限制</span>
        </el-upload>
        <input style="display:none;" type="text" v-model="newcoupon.linkId" />
      </el-form-item>

      <el-form-item  label="轮播图片" prop="picture">
        <el-upload
          id="picturediv"
          class="upload-demo"
          ref="upload"
          action
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="imglist"
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
          >只能上传jpg/png文件，且不超过500kb,宽700px,高130px</span>
        </el-upload>
        <input style="display:none;" type="text" v-model="newcoupon.path" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { postbannerlist } from "@/api/baseconfig";
import { bookcipsearch } from "@/api/book";
import { getlist } from "@/api/recommend";
import qs from "qs";
export default {
  name: "newcoupon",
  data() {
    return {
      storelist: [{ name: "通用优惠券", id: 0 }],
      newcoupon: {
        name: "",
        description: "",
        adsType: "0",
        linkId: "",
        path: ""
      },
      shudanlist: [],
      rules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请选输入优惠券简介", trigger: "change" }
        ],
        validDays: [
          { required: true, message: "请选输入有效日长", trigger: "change" }
        ],
        linkId: [
          { required: true, message: "请选择书籍/书单", trigger: "change" }
        ],
        path: [{ required: true, message: "请选择一个图片", trigger: "change" }],
        linkId1:[
          { required: true, message: "请选择图片", trigger: "change" }
        ],
      },
      imglist: [],

      searchvalue: "",
      booklist: []
    };
  },
  props: {},
  created() {
    this.getbookdanlist();
  },
  computed: {},
  methods: {
    setpressname(e) {
      this.newcoupon.linkId = e
    },
    getbookdanlist() {
      getlist({
        state: 2,
        page: 1,
        pageSize: 100,
        sk: "time",
        so: "desc"
      }).then(res => {
        this.shudanlist = res.items;
      });
    },
    getbookListbyname(name) {
      if (name == "") {
        this.booklist = [];
        this.newcoupon.linkId = ''
        return;
      }
      bookcipsearch({
        state: 2,
        name: name,
        page: 1,
        pageSize: 50,
        sk: "time",
        so: "desc"
      })
        .then(res => {
          this.booklist = res.items;
        })
        .catch(() => {});
    },
    handleRemove(file, fileList) {
      this.newcoupon.path = "";
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
        self.newcoupon.path = base64;
      };
    },

    handleRemove1(file, fileList) {
      this.newcoupon.linkId1 = "";
    },
    handleChange1(file, fileList) {
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
        self.newcoupon.linkId1 = base64;
      };
    },
    changeruleType(e) {
      if (e == 0) {
        this.newcoupon.startDate = "";
        this.newcoupon.endDate = "";
        this.newcoupon.timeRange = "";
        this.newcoupon.validDays = 10;
      } else {
        this.newcoupon.validDays = 0;
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          for (var key in this.newcoupon) {
            if (key == "path") {
              continue;
            }
            formData.append(key, this.newcoupon[key]);
          }
          formData.append(
            "path",
            convertBase64UrlToBlob(this.newcoupon["path"]),
            "fmt.jpg"
          );

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
          if(this.newcoupon.adsType==2){
            formData.delete('linkId')
            formData.append(
              "linkId",
              convertBase64UrlToBlob(this.newcoupon["linkId1"]),
              "fmt.jpg"
            );
          }
          postbannerlist(formData).then(res => {
            this.$emit("hidenew");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setriqi(e) {
      this.newcoupon.startDate = e[0];
      this.newcoupon.endDate = e[1];
    }
  }
};
</script>

<style scoped>
.riqi {
  width: 400px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
