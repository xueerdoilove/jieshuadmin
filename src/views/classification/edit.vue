<template>
  <div>
    <el-form ref="form" :rules="rules"  :model="newone" label-width="120px">
      <!-- <el-form-item label="提醒" >
        1
      </el-form-item> -->

      <el-form-item label="子类名字" prop="name">
        <el-input class="riqi"  v-model="newone.name" placeholder="请输入书籍分类的名字"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { putcat } from "@/api/classification";
export default {
  name: "newone",
  data() {
    return {
      newone: {
        name: "",
        id: "",
        parentId:0
      },
      rules: {
        name: [
          { required: true, message: "请输入书籍分类的名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
       
      },
    };
  },
  props: {
    
  },
  created(){
    this.newone.name = localStorage.getItem('catname') 
    this.newone.id = localStorage.getItem('catId') 
    this.newone.parentId =  localStorage.getItem('parentId') 
  },
  computed: {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var a = JSON.parse(JSON.stringify(this.newone))
          putcat(this.newone.id,a).then(res =>{
            this.$message({
              type: "success",
              message: "修改成功!"
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
