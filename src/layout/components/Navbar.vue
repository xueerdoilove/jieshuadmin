<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar" class="user-avatar"> -->
          <span style="position:relative;top:-10px;font-size:20px;">{{name}}</span>
          <i
            class="el-icon-caret-bottom"
            style="position:relative;top:-10px;font-size:20px;left:0px;"
          />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="showgeren">个人设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="个人设置" :visible.sync="show_geren">
      <div>
        <h3 style="margin-bottom:10px;">账户信息</h3>
        <el-form style="width:400px;margin:0 auto" label-width="80px">
          <el-form-item label="昵称">
            <el-input class="riqi" v-model="user.name" style="width:220px"></el-input>
            <el-button @click="resetname" style="float:right" type="primary" class>保存</el-button>
          </el-form-item>

          <el-form-item label="账号">
            <el-input class="riqi" disabled v-model="user.phone"></el-input>
          </el-form-item>

          <el-form-item label="权限">
            <el-input class="riqi" disabled v-model="user.rules"></el-input>
          </el-form-item>
        </el-form>
        <h3 style="margin-bottom:10px;border-top:1px solid #aaa;padding-top:20px;">密码修改</h3>
        <el-form
          style="width:400px;margin:0 auto;"
          ref="formmima"
          :rules="rules"
          :model="newmima"
          label-width="80px"
        >
          <el-form-item label="原密码" prop="mima">
            <el-input class="riqi" type="password" v-model="newmima.mima"></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="xmima">
            <el-input class="riqi" type="password" v-model="newmima.xmima"></el-input>
          </el-form-item>

          <el-form-item label="再次输入" prop="dmima">
            <el-input class="riqi" type="password" v-model="newmima.dmima"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit('formmima')">修改密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { resetname, resetpassword } from "@/api/user";
import sha1 from "sha1";
export default {
  data() {
    return {
      show_geren: false,
      user: {
        name: "",
        phone: "",
        rules: ""
      },
      newmima: {
        mima: "",
        xmima: "",
        dmima: ""
      },
      rules: {
        mima: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        xmima: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        dmima: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    showgeren() {
      this.show_geren = true;
      this.user.name = this.name;
      var rules = localStorage.getItem("roleset");
      this.user.phone = localStorage.getItem("phone");
      if (rules.search("4") != -1) {
        this.user.rules = "最高管理员";
      } else if (rules.search("3") != -1) {
        this.user.rules = "门店管理员";
      } else if (rules.search("2") != -1) {
        this.user.rules = "门店店员";
      } else if (rules.search("1") != -1) {
        this.user.rules = "普通用户";
      }
    },
    resetname() {
      if (this.user.name.length < 3 || this.user.name.length > 12) {
        this.$message("请输入名字,长度大于3小于12");
        return;
      }
      resetname({ name: this.user.name }).then(res => {
        this.$store.dispatch("user/getInfo");
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.newmima.xmima == this.newmima.dmima) {
            resetpassword({
              pass: sha1(this.newmima.mima),
              newPass: sha1(this.newmima.xmima),
              confirmPass: sha1(this.newmima.dmima)
            }).then(res => {
              this.$confirm("修改完密码后需重新登录", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.logout();
                })
                .catch(() => {
                  this.logout();
                });
            });
          } else {
            this.$message("两次输入的密码不一致");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
