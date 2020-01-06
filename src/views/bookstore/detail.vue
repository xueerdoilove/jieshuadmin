<template>
  <div>
    <el-form ref="form1" :rules="rules"  :model="new_one" label-width="120px">
      <el-form-item label="书店名称" prop="name">
        <el-input class="riqi" v-model="new_one.name"></el-input>
      </el-form-item>

      <el-form-item label="书店经度" prop="longitude">
        <el-input class="riqi" type="number" v-model="new_one.longitude"></el-input>
        <br>(经纬度的填写,请去 <a style="color:red;" href='http://api.map.baidu.com/lbsapi/getpoint/index.html?qq-pf-to=pcqq.group' target="_blank">坐标拾取</a> 页面自己找寻) <el-button type="text" style="margin-left:30px;" @click="showjieshi=!showjieshi">{{showjieshi?'收起':'详细教程'}}</el-button>
        <div v-show="showjieshi">
          1,点击红色文字跳转到坐标拾取页面并输入地点名字
          <br>2,寻找正确的地点位置并点击红色的坐标<img :src="step2" style="width:30px;" alt="">
          <br>3,弹出<img :src="step3" style="width:300px;" alt="">
        </div>
      </el-form-item>

      <el-form-item label="书店维度" prop="latitude">
        <el-input class="riqi" type="number" v-model="new_one.latitude"></el-input>
      </el-form-item>

      <el-form-item label="书店手机号" prop="mobile">
        <el-input class="riqi" type="number" v-model="new_one.mobile"></el-input>
      </el-form-item>

      <el-form-item label="书店介绍" prop="introduction">
        <el-input class="riqi" type="textarea" v-model="new_one.introduction"></el-input>
      </el-form-item>


      <el-form-item label="省市区" prop="district">
        <el-select v-model="new_one.province" @change="getshi"  placeholder="请选择省">
          <el-option
            v-for="sheng in shenglist"
            :key="sheng.id"
            :label="sheng.name"
            :value="sheng.id">
          </el-option>
        </el-select>

        <el-select v-model="new_one.city" @change="getqu"  placeholder="请选择市">
          <el-option
            v-for="shi in shilist"
            :key="shi.id"
            :label="shi.name"
            :value="shi.id">
          </el-option>
        </el-select>

        <el-select v-model="new_one.district" placeholder="请选择区">
          <el-option
            v-for="qu in qulist"
            :key="qu.id"
            :label="qu.name"
            :value="qu.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="具体地址" prop="address">
        <el-input class="riqi" v-model="new_one.address"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form1')">确定修改</el-button>
        <el-button type="primary" v-show="state==2" @click="deleteone()">停业</el-button>
        <el-button type="primary" v-show="state!=2" @click="putone()">开业</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { putstore ,getprovcity ,deletestore ,putone} from '@/api/store'
import step2 from '@/assets/step2.png'
import step3 from '@/assets/step3.png'
export default {
  name: "newstore",
  data() {
    return {
      showjieshi:false,
      step2:step2,
      step3:step3,
      shenglist:[],
      shilist:[],
      qulist:[],
      new_one:{},
      rules: {
        name: [
          { required: true, message: "请输入书店名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请选输入书店介绍", trigger: "change" }
        ],
        longitude: [
          { required: true, message: "请选输入书店经度", trigger: "change" }
        ],
        latitude: [
          { required: true, message: "请选输入书店维度", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "请选输入书店电话", trigger: "change" },
          { min: 11, max: 11, message: '长度在11字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: "请选输入书店具体地址", trigger: "change" }
        ],
        district:[
          { required: true, message: "请选择地址", trigger: "change" }
        ]
      }
    };
  },
  props: {
    new_oned: {
      type: Object
    },
    state:{
    }
  },
  computed: {},
  mounted(){
    this.new_one = JSON.parse(JSON.stringify(this.new_oned))
    this.getsheng()
    setTimeout(() =>{
      this.getshi(this.new_one.province)
      setTimeout(() =>{
        this.getqu(this.new_one.city)
      },500)
    },600)
  },
  methods: {
    deleteone(){
      this.$confirm('确定停业书店吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletestore({id:this.new_one.id}).then(res =>{
          this.$message({
            message: '书店停业成功!',
            type: 'success'
          });
          this.$emit('hidedetail');
        })
      }).catch(() => {
                 
      });
      
    },
    putone(){
      this.$confirm('确定开业书店吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        putone({id:this.new_one.id}).then(res =>{
          this.$message({
            message: '书店开业成功!',
            type: 'success'
          });
          this.$emit('hidedetail');
        })
      }).catch(() => {
                 
      });
      
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          putstore(this.new_one).then(res =>{
            this.$message({
              message: '修改书店成功!',
              type: 'success'
            });
            this.$emit('hidedetail');
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getsheng(){
      //api/getprovcity?parentCode=110000&dataType=2&state=1&sk=xx&so=xx&page=1&pageSize=2
      getprovcity({
        parentCode:0,
        dataType:1,
        state:1,
      }).then(res =>{
        this.shenglist =[{name:'请选择省',id:'',code:''},...res.items]
      })
    },
    getshi(id){
      //api/getprovcity?parentCode=110000&dataType=2&state=1&sk=xx&so=xx&page=1&pageSize=2
      if(!id){
        this.new_one.city = ''
        this.new_one.district = ''
      }else{
        var parentCode = ''
        for(var i = 0 ;i<this.shenglist.length;i++){
          if(this.shenglist[i].id==id){
            parentCode = this.shenglist[i].code
          }
        }
        getprovcity({
          parentCode:parentCode,
          dataType:2,
          state:1,
        }).then(res =>{
          this.shilist = [{name:'请选择市',id:'',code:''},...res.items]
        })
      }
    },
    getqu(id){
      //api/getprovcity?parentCode=110000&dataType=2&state=1&sk=xx&so=xx&page=1&pageSize=2
      if(!id){
        this.new_one.district = ''
      }else{
        var parentCode = ''
        for(var i = 0 ;i<this.shilist.length;i++){
          if(this.shilist[i].id==id){
            parentCode = this.shilist[i].code
          }
        }
        getprovcity({
          parentCode:parentCode,
          dataType:3,
          state:1,
        }).then(res =>{
          this.qulist = [{name:'请选择区',id:'',code:''},...res.items]
        })
      }
      
    },
  }
};
</script>

<style scoped>
.riqi {
  width: 400px;
}
.el-select{
  width: 130px;
  margin-right: 10px;
}
</style>
