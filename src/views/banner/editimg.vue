<template>
  <div>
    <el-form ref="form" :rules="rules" :model="newcoupon" label-width="120px">

      <el-form-item label="图片" prop="picture">
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
        <el-button type="primary" @click="onSubmit('form')">修改图片</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { putbannerimg } from "@/api/baseconfig";
import qs from "qs";
export default {
  name: "newcoupon",
  data() {
    return {
      newcoupon: {
        name: "",
        description: "",
        adsType: "0",
        linkId: "",
        path: ""
      },
      rules: {
        path: [{ required: true, message: "请选择一个图片", trigger: "change" }]
      },
      imglist: [],

      searchvalue: "",
    };
  },
  props: {},
  created() {
    this.newcoupon = JSON.parse(localStorage.getItem('banneritem'))
    this.newcoupon.path = this.newcoupon.picture
  },
  computed: {},
  methods: {
    setpressname(e) {
      this.newcoupon.linkId = e
    },
    handleRemove(file, fileList) {
      this.newcoupon.path = "";
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
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          
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
          var id = this.newcoupon.id
          putbannerimg(id,formData).then(res => {
            this.$emit("hidenew");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
     
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
