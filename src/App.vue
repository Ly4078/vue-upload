<template>
  <div id="app">
    <el-button type="success" v-for="item in pageTypeList" :key="item.id" plain @click="switchPage(item.id)">{{item.name}}</el-button>
    <xiangqiversion v-if="pageType==1"></xiangqiversion>
    <Upload v-if="pageType==2"/>
    <addhx v-if="pageType==3"/>
    
   <!-- <Fengxi></Fengxi> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Upload from './components/Upload.vue'
import addhx from './components/addhx.vue'
import About from './views/About.vue'
import Fengxi from './components/fenxi'
import xiangqiversion from './components/xiangqiversion.vue'
export default {
  name: 'app',
  data(){
    return{
      pageTypeList:[{name:'小程序配置',id:1},
      {name:'商品上传',id:2},{name:'核销员配置',id:3}],
      pageType:'2',
      isflag:true,
      token:""
    }
  },
  components: {
    HelloWorld,
    Upload,
    About,
    addhx,
    Fengxi,
    xiangqiversion
  },
  methods:{
    switchPage(e){
      if(e == this.pageType){
        return false
      }
      this.pageType = e;
      this.login(); 
    },
     //用户登录
    login() {
      let _this = this;
      // this.$GLOBAL.API+"  <==>  this.$GLOBAL.API+"
      this.$axios
        .post( this.$GLOBAL.API+"webApprove/auth/login?userName=13971489895")
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
