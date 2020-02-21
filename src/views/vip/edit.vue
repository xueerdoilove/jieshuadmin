<template>
  <div>
    <el-form ref="form" :rules="rules"  :model="newvip" label-width="120px">
      <el-form-item label="会员名字" prop="name">
        <el-input class="riqi"  v-model="newvip.name"></el-input>
      </el-form-item>

      <el-form-item label="有效日长" prop="validDays">
        <el-input class="riqi" type="number" v-model="newvip.validDays"></el-input>
      </el-form-item>

      <el-form-item label="购买金额" prop="cost">
        <el-input class="riqi" v-model="newvip.cost"></el-input>(元)
      </el-form-item>

      <el-form-item label="介绍" prop="description">
        <el-input class="riqi" type="textarea" v-model="newvip.description"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { putvip } from '@/api/vip'
export default {
  name: "newvip",
  data() {
    return {
      newvip: {
        name: "",
        description: "",
        cost: "",
        validDays: 0,
      },
      rules: {
        name: [
          { required: true, message: "请输入会员类型名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请选输入会员类型介绍", trigger: "change" }
        ],
        cost: [
          {
            required: true,
            message: "请输入会员的购买价格(分)",
            trigger: "change"
          }
        ],
        validDays:[
          { required: true, message: "请选输入有效日长", trigger: "change" }
        ]
      },
    };
  },
  props: {
  },
  created(){
    this.newvip = JSON.parse(localStorage.getItem('onevip'))
    this.newvip.cost = this.newvip.cost/100
  },
  computed: {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var a = JSON.parse(JSON.stringify(this.newvip))
          a.cost = a.cost*100
          putvip(this.newvip.id,a).then(res =>{
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.$emit('hideedit');
          })
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
    border-color: #409EFF;
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
