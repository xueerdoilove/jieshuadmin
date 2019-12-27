<template>
  <div class="container">
    <el-row class="tianjian_tou">
      <el-col :span="20" :offset="0">
        <el-form label-width="80px">
          <el-form-item label="状态:">
            <el-radio-group v-model="state" @change="changetiaojian">
              <el-radio :label="2">开业中</el-radio>
              <el-radio :label="0">停业中</el-radio>
              <el-radio :label="1">未开业</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary" @click="shownew">+新增</el-button>
      </el-col>
    </el-row>

    <el-row class="storebox">
      <el-col class="store_item" :span="10" :offset="1" v-for="store in storelist" v-bind:key="store.id">
        <storeitem  :shitidianData="store" @showDetial="getstore" @showErweima="showErweima" />
      </el-col>
    </el-row>

    <el-dialog title="新增实体店" :visible.sync="show_new">
      <newstore @hidenew='hidenew'/>
    </el-dialog>

    <el-dialog title="实体店详情" :visible.sync="show_detail">
      <storedetail v-if="show_detail" :state="state" :new_one="detail" @hidedetail='hidedetail'/>
    </el-dialog>

    <el-dialog title="实体店推广码" :visible.sync="show_sharecode">
      <div>
         <div v-show="store_sharecode">
           {{store_sharecode}}
           <div id="qrcode"></div>
         </div>
         <div v-show="!store_sharecode"> 
           <div>
             实体店的分享码只能设置一次不支持修改,请确认好再提交
           </div>
           <span>分享码</span><el-input style="width:300px;margin-left:30px;" placeholder="请填写二维码" v-model="new_sharecode"></el-input>
           <br>
           <br>
           <el-button @click="saveSharecode">保存</el-button>
         </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getstoreList ,getstorebyid ,bindstoreSharecode , getbindstoreSharecode} from "@/api/store";
import Storeitem from "./storeitem";
import Newstore from "./new";
import Storedetail from "./detail";
import QRCode from 'qrcodejs2'
export default {
  named: "书店列表",
  data() {
    return {
      new_sharecode:'',
      store_sharecode:'',
      sharecode_storeid:'',
      show_sharecode:false,// 推广码 开关

      show_detail:false,
      detail:{},

      show_new:false,

      storelist: [],

      state: 2, //state：状态：0停业,1未开业,2开业（默认值：1）
      page: 1,
      sk:'time',
      so:'asc',
      pageSize: 100
    }
  },
  components: {
    Storeitem,
    Newstore,
    Storedetail
  },
  mounted() {
    this.getstoreList();
  },
  methods: {
    saveSharecode(){
      if(this.new_sharecode.length<3){
        this.$message.error('请输入分享码');
        return
      }
      this.$confirm('确定设置此实体店的分享码吗?只能设置一次不支持修改哦', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          id:this.sharecode_storeid,
          shareCode:this.new_sharecode
        }
        
        bindstoreSharecode(data).then(res =>{
          this.show_sharecode = false;
          this.getstoreList()
        }).catch(err => {
            console.log(err)
        });
      })
      
    },
    showErweima(data){
      this.sharecode_storeid = data.id;
      this.store_sharecode = data.sharecode;
      if(data.sharecode){
        setTimeout(() =>{
          //httpsopen.weixin.qq.comsnsgetexpappinfoappid=wx8aacda7758e56069&path=pages%2Findex%2Findex%2Findex.html%3FshareCode%3D123457#wechat-redirect
        document.getElementById('qrcode').innerHTML=''
          new QRCode("qrcode", {
              text: 'https://open.weixin.qq.com/sns/getexpappinfo?appid=wx8aacda7758e56069&path=pages%2Findex%2Findex%2Findex.html%3FshareCode%3D'+data.sharecode+'#wechat-redirect',
              width: 512,
              height: 512,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H
          });
        },300)
        
      }
      this.show_sharecode = true;
      this.new_sharecode = ''
      
    },
    getstore(data){
      this.$router.push({ name: "storedetail", params: { idd: data.id ,state:this.state} });
      // getstorebyid(data).then(res =>{
      //     this.detail = res.item
      //     this.show_detail = true;
      // })
    },
    hidedetail(){
      this.show_detail = false;
      this.getstoreList()
    },
    getstoreList() {
      getstoreList({
        page: this.page,
        pageSize: this.pageSize,
        state: this.state,
        sk:this.sk,
        so:this.so
      })
        .then(res => {
          this.storelist = res.items;
        })
        .catch(error => {});
    },
    changetiaojian() {
      this.page = 1;
      this.getstoreList();
    },
    shownew(){
      this.show_new = true;
    },
    hidenew(){
      this.show_new = false;
      this.$message('添加书店成功!');
      this.state = 1
      this.getstoreList()
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #efefef;
  padding:30px;
  min-height: calc(100vh - 50px);
}
.tianjian_tou {
  border-bottom: 1px solid #aaa;
}
.caozuo_tou {
  padding: 15px 0 15px 30px;
}
.storebox{
  margin-top: 20px;
}
.store_item {
  margin-top: 20px;
  border-radius: 10px;
  background-color: #fff;
}
</style>
