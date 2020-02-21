<template>
  <div>
    <el-form ref="form" :rules="rules" :model="newone" label-width="120px">
      <el-form-item label="书单名字" prop="name">
        <el-input class="riqi" v-model="newone.name"></el-input>
      </el-form-item>

      <el-form-item label="书单介绍" prop="introduction">
        <el-input class="riqi" type="textarea" v-model="newone.introduction"></el-input>
      </el-form-item>

      <el-form-item label="起止时间" prop="timeRange">
        <el-date-picker
          class="riqi"
          v-model="newone.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="setriqi"
          value-format="yyyy-MM-dd HH:MM:SS"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { putrecommendlist } from "@/api/recommend";
export default {
  name: "newone",
  data() {
    return {
      newone: {
        id: "",
        name: "",
        introduction: 0,
        startTime: "",
        endTime: "",
        timeRange: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入书单名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请选输入书单简介", trigger: "change" },
          { min: 3, max: 1024, message: "长度在 3 到 1024 个字符", trigger: "blur" }
        ],
        timeRange: [
          {
            type: "array",
            required: true,
            message: "请选择时间范围",
            trigger: "change"
          }
        ]
      }
    };
  },
  props: {},
  created() {
    var a = JSON.parse(localStorage.getItem("editrecommend"));
    a.timeRange = [a.startTime, a.endTime];
    this.newone = a;
  },
  computed: {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putrecommendlist(this.newone).then(res => {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.$emit("hideedit");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setriqi(e) {
      this.newone.startTime = e[0];
      this.newone.endTime = e[1];
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
