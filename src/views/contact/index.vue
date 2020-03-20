<template>
  <div class="container">
    <div class="shili">
      <img src="../../assets/toubu.jpg" class="shilitouimg" alt />
      <img :src="portrait" alt class="shilitouimg" />
    </div>
    <div class="caozuo">
      <el-form ref="form" label-width="120px">
        <div style="margin-left:60px">图片宽度最好为750px,长度不固定</div>
        <el-form-item label="配置图">
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
            >只能上传jpg/png文件，且不超过500kb</span>
          </el-upload>
          <input style="display:none;" type="text" v-model="picture" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="picture.length==0"
            :loading="isupimg"
            @click="onSubmit('form')"
          >修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getcontactcfg, putcontactcfg } from "@/api/baseconfig";
export default {
  named: "联系我们",
  data() {
    return {
      portrait: "",
      imglist: [],
      picture: "",
      isupimg: false
      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {
    this.mgetcontactcfg();
  },
  components: {},
  filters: {},
  computed: {},
  methods: {
    mgetcontactcfg() {
      getcontactcfg({}).then(res => {
        this.portrait = res.item.portrait;
      });
    },
    handleRemove(file, fileList) {
      this.picture = "";
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
        self.picture = base64;
      };
    },
    onSubmit(formName) {
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
      this.isupimg = true;
      putcontactcfg(formData).then(res => {
        if (String(res).length > 0) {
          this.$message({
            message: "修改失败,图片太大,请修改尺寸",
            type: "fail"
          });
          this.isupimg = false;
          this.picture = "";
          this.imglist = [];
        } else {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.isupimg = false;
          this.picture = "";
          this.imglist = [];
          this.mgetcontactcfg();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
}
.shili {
  width: 400px;
  border: 1px solid #eee;
  min-height: 650px;
  float: left;
  box-shadow: 0 0 3px #333;
}
.shilitouimg {
  width: 100%;
}
.caozuo {
  float: left;
  margin-left: 20px;
}
</style>
