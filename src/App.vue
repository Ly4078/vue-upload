<template>
  <div id="app">
    <!-- <el-button type="success" plain @click="toflag">切换模式</el-button>
    <Upload v-if="isflag"/>
    <addhx v-if="!isflag"/> -->
   <Fengxi></Fengxi>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Upload from './components/Upload.vue'
import addhx from './components/addhx.vue'
import About from './views/About.vue'
import Fengxi from './components/fenxi'
export default {
  name: 'app',
  data(){
    return{
      isflag:true,
      token:""
    }
  },
  components: {
    HelloWorld,
    Upload,
    About,
    addhx,
    Fengxi
  },
  methods:{
    toflag(){
      this.isflag=!this.isflag;
      this.login(); 
    },
     //用户登录
    login() {
      let _this = this;
      // this.$GLOBAL.API+"  <==>  this.$GLOBAL.API+"
      this.$axios
        .post(this.$GLOBAL.API+"webApprove/auth/login?userName=13971489895")
        .then(res => {
          _this.token ="Bearer "+res.data.data;
          let _token="Bearer "+res.data.data;
          sessionStorage.setItem('_TOKEN',_token); 
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created(){
    this.login();
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
.pageTitle{
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #212122;
}
.xqspsc{
  font-size: 36px;
  color: #fff;
  float: left;
  margin-left:15%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
