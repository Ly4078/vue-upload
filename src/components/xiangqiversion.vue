
<template>
  <div>
    <div class="domain">
      <el-radio v-model="baseUrl" label="https://xiang7.net/" @change="selectdomain">正式库</el-radio>
      <el-radio v-model="baseUrl" label="/api" @change="selectdomain">测试库</el-radio>
    </div>
    <div class="tonav">
      <a :href="item.target" v-for="(item,index) of tonav" :key="index">{{item.name}}</a>
    </div>
    <div class="miniprogram">
      <img
        src="https://xq-1256079679.file.myqcloud.com/13297932982_1550567567_wxf91e2a026658e78e.o6zAJs8MAFbCJC7DAN2zExwH4c2Q.LZ7FWaAZMFmY1f377fcfd3601b905e9de3678830ea11_0.3.jpg"
        alt
      >
    </div>
    <div class="navTitle" :class="isScroll?'fixed':''">
      Txt文件配置______
      <span>每一栏操作后，请先保存</span>
    </div>
    <div style="height:50px;width:100%" v-if="isScroll">Txt文件配置</div>
    <div class="content">
      <!--轮播图  -->
      <div class="bannerContent" id="banner">
        <div class="itemTitle">
          <span class="bigTitle">首页Banner配置</span>
          <span class="subTitle">(要求：宽750px、高420px)</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('bannerList')"
              @click="addKey('bannerList',bannerList,'首页轮播图','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('bannerList')"
              @click="addKey('bannerList',bannerList,'首页轮播图','1',oldData.bannerList.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.bannerList.id)"
              v-if="oldData.hasOwnProperty('bannerList')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div class="bannerItem" v-for="(item,index) of bannerList" :key="index">
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deleteItem(index,'bannerList')"
              class="deleteThat"
              circle
            ></el-button>
            <img :src="item.imgUrl" alt>
            <div style="margin:5px 0;">
              <el-input type="textarea" :rows="2" v-model="item.linkUrl" placeholder="请输入跳转地址,可带参数"></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="item.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否可跳转
              <el-switch v-model="item.isLink"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input v-model="item.tips" type="textarea" :rows="2" placeholder="请输入无跳转地址时提示语"></el-input>
            </div>
            <div style="margin:5px 0;">
              <span>左右排序</span>&nbsp;
              <el-button icon="el-icon-arrow-left" @click="itemsortleft(index,'bannerList')" circle></el-button>&nbsp;
              <el-button
                icon="el-icon-arrow-right"
                @click="itemsortright(index,'bannerList')"
                circle
              ></el-button>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            :before-upload="beforeAvatarUpload"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
      <!-- 红包控制 -->
      <div class="bannerContent" id="redbag">
        <div class="itemTitle">
          <span class="bigTitle">首页红包贺卡 入口控制</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('navbannerData')"
              @click="addKey('navbannerData',navbannerData,'红包控制','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('navbannerData')"
              @click="addKey('navbannerData',navbannerData,'红包控制','1',oldData.navbannerData.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.navbannerData.id)"
              v-if="oldData.hasOwnProperty('navbannerData')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div class="bannerItem" v-if="navbannerData.imgUrl" style="margin:0 auto;width:500px;">
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deleteItemRedbag(index,'navbannerData')"
              class="deleteThat"
              circle
            ></el-button>
            <img
              style="width:100%;max-width:300px;display:block;margin:0 auto;height:auto;"
              :src="navbannerData.imgUrl"
              alt
            >
            <div style="margin:5px 0;">
              <el-input
                type="textarea"
                :rows="2"
                v-model="navbannerData.linkUrl"
                placeholder="请输入跳转地址,可带参数"
              ></el-input>
            </div>
            <div style="margin:5px 0;display: flex;flex-direction: row;">宽(rpx)
              <el-input v-model="navbannerData.width" placeholder="图片宽度，rpx"></el-input>高(rpx)
              <el-input v-model="navbannerData.height" placeholder="图片高度，rpx"></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="navbannerData.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否可跳转
              <el-switch v-model="navbannerData.isLink"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input
                v-model="navbannerData.tips"
                type="textarea"
                :rows="2"
                placeholder="请输入无跳转地址时提示语"
              ></el-input>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            v-if="!navbannerData.imgUrl"
            :before-upload="beforeAvatarUpload8"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <div style="float:right;width:100%;padding:15px 0;">
            <p style="display:inline-block;width:240px;">showRebbag
              <el-switch v-model="showRebbag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </p>
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('showRebbag')"
              @click="addKey('showRebbag',showRebbag,'红包控制字段1','1')"
            >添加记录</el-button>
            <el-button
              v-if="oldData.hasOwnProperty('showRebbag')"
              @click="addKey('showRebbag',showRebbag,'红包控制字段1','1',oldData.showRebbag.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.showRebbag.id)"
              v-if="oldData.hasOwnProperty('showRebbag')"
            ></el-button>
          </div>
          <div style="float:right;width:100%;padding:15px 0;">
            <p style="display:inline-block;width:240px;">showRebbag2
              <el-switch v-model="showRebbag2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </p>
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('showRebbag2')"
              @click="addKey('showRebbag2',showRebbag2,'红包控制字段2','1')"
            >添加记录</el-button>
            <el-button
              v-if="oldData.hasOwnProperty('showRebbag2')"
              @click="addKey('showRebbag2',showRebbag2,'红包控制字段2','1',oldData.showRebbag2.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.showRebbag.id)"
              v-if="oldData.hasOwnProperty('showRebbag2')"
            ></el-button>
          </div>
        </div>
      </div>
      <!-- 快速入口 -->
      <div class="bannerContent" id="navs">
        <div class="itemTitle">
          <span class="bigTitle">首页快速入口图标</span>
          <span class="subTitle">(要求：宽88px、高88px,圆形图)</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('navsList')"
              @click="addKey('navsList',navsList,'首页快速入口','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('navsList')"
              @click="addKey('navsList',navsList,'首页快速入口','1',oldData.navsList.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.navsList.id)"
              v-if="oldData.hasOwnProperty('navsList')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div
            class="bannerItem"
            style="width:180px;"
            v-for="(item,index) of navsList"
            :key="index"
          >
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deleteItem(index,'navsList')"
              class="deleteThat"
              circle
            ></el-button>
            <img
              style="width:88px;height:88px;border-radius:50%;margin:0 auto;display:block;"
              :src="item.imgUrl"
              alt
            >
            <div style="margin:5px 0;">
              <el-input v-model="item.name" placeholder="请输入 入口名称"></el-input>
            </div>
            <div style="margin:5px 0;">
              <el-input v-model="item.linkUrl" type="textarea" :rows="2" placeholder="请输入跳转地址,可带参数"></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="item.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否可跳转
              <el-switch v-model="item.isLink"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input v-model="item.tips" type="textarea" :rows="2" placeholder="请输入无跳转地址时提示语"></el-input>
            </div>
            <div style="margin:5px 0;">
              <span>左右排序</span>&nbsp;
              <el-button icon="el-icon-arrow-left" @click="itemsortleft(index,'navsList')" circle></el-button>&nbsp;
              <el-button icon="el-icon-arrow-right" @click="itemsortright(index,'navsList')" circle></el-button>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            :before-upload="beforeAvatarUpload2"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
      <!-- 活动 滑块 -->
      <div class="bannerContent" id="activity">
        <div class="itemTitle">
          <span class="bigTitle">首页活动横向 滑块</span>
          <span class="subTitle">(要求：宽750px、高420px)</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('activityList')"
              @click="addKey('activityList',activityList,'首页活动滑块','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('activityList')"
              @click="addKey('activityList',activityList,'首页活动滑块','1',oldData.activityList.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.activityList.id)"
              v-if="oldData.hasOwnProperty('activityList')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div class="bannerItem" v-for="(item,index) of activityList" :key="index">
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deleteItem(index,'activityList')"
              class="deleteThat"
              circle
            ></el-button>
            <img :src="item.imgUrl" alt>
            <div style="margin:5px 0;">
              <el-input v-model="item.title" placeholder="请输入标题"></el-input>
            </div>
            <div style="margin:5px 0;">
              <el-input type="textarea" :rows="2" v-model="item.linkUrl" placeholder="请输入跳转地址,可带参数"></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="item.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否可跳转
              <el-switch v-model="item.isLink"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input v-model="item.tips" type="textarea" :rows="2" placeholder="请输入无跳转地址时提示语"></el-input>
            </div>
            <div style="margin:5px 0;">
              <span>左右排序</span>&nbsp;
              <el-button
                icon="el-icon-arrow-left"
                @click="itemsortleft(index,'activityList')"
                circle
              ></el-button>&nbsp;
              <el-button
                icon="el-icon-arrow-right"
                @click="itemsortright(index,'activityList')"
                circle
              ></el-button>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            :before-upload="beforeAvatarUpload3"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>

      <!-- 横幅轮播 -->
      <div class="bannerContent" id="subswiper">
        <div class="itemTitle">
          <span class="bigTitle">首页副轮播图</span>
          <span class="subTitle">(要求：宽702px、高190px)</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('subswiper')"
              @click="addKey('subswiper',subswiper,'首页副轮播','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('subswiper')"
              @click="addKey('subswiper',subswiper,'首页副轮播','1',oldData.subswiper.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.subswiper.id)"
              v-if="oldData.hasOwnProperty('subswiper')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div class="bannerItem" v-for="(item,index) of subswiper" :key="index">
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deleteItem(index,'subswiper')"
              class="deleteThat"
              circle
            ></el-button>
            <img style="height:80px;" :src="item.imgUrl" alt>
            <div style="margin:5px 0;">
              <el-input v-model="item.title" placeholder="请输入标题"></el-input>
            </div>
            <div style="margin:5px 0;">
              <el-input type="textarea" :rows="2" v-model="item.linkUrl" placeholder="请输入跳转地址,可带参数"></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="item.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否可跳转
              <el-switch v-model="item.isLink"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input v-model="item.tips" type="textarea" :rows="2" placeholder="请输入无跳转地址时提示语"></el-input>
            </div>
            <div style="margin:5px 0;">
              <span>左右排序</span>&nbsp;
              <el-button icon="el-icon-arrow-left" @click="itemsortleft(index,'subswiper')" circle></el-button>&nbsp;
              <el-button
                icon="el-icon-arrow-right"
                @click="itemsortright(index,'subswiper')"
                circle
              ></el-button>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            :before-upload="beforeAvatarUpload9"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>

      <!-- 横幅 -->
      <div class="bannerContent" id="hengfu">
        <div class="itemTitle">
          <span class="bigTitle">首页横幅</span>
          <span class="subTitle">
            (要求：宽750px、高188px；)
            <span style="color:red;">目前仅限一张</span>
          </span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('fresh0')"
              @click="addKey('fresh0',fresh0,'首页横幅','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('fresh0')"
              @click="addKey('fresh0',fresh0,'首页横幅','1',oldData.fresh0.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.fresh0.id)"
              v-if="oldData.hasOwnProperty('fresh0')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div class="bannerItem" v-if="fresh0.imgUrl" style="width:375px;">
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deletehengfuitem()"
              class="deleteThat"
              circle
            ></el-button>
            <img style="width:375px;height:94px" :src="fresh0.imgUrl" alt>
            <div style="margin:5px 0;">
              <el-input
                type="textarea"
                :rows="2"
                v-model="fresh0.linkUrl"
                placeholder="请输入跳转地址,可带参数"
              ></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="fresh0.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否可跳转
              <el-switch v-model="fresh0.isLink"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input v-model="fresh0.tips" type="textarea" :rows="2" placeholder="请输入无跳转地址时提示语"></el-input>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            v-if="!fresh0.imgUrl"
            :before-upload="beforeAvatarUpload4"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>

      <!-- 专区 -->
      <div class="bannerContent" id="zone">
        <div class="itemTitle">
          <span class="bigTitle">首页专区图</span>
          <span class="subTitle">
            (要求：第一张图 宽344px 高410px, 后面两张图 宽350px 高200px)
            <span style="color:red;">仅限3张</span>
          </span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('zoneList')"
              @click="addKey('zoneList',zoneList,'首页专区图','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('zoneList')"
              @click="addKey('zoneList',zoneList,'首页专区图','1',oldData.zoneList.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.zoneList.id)"
              v-if="oldData.hasOwnProperty('zoneList')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div
            class="bannerItem"
            :style="{'width':index==0 ? '174px':'174px'}"
            v-for="(item,index) of zoneList"
            :key="index"
          >
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deleteItem(index,'zoneList')"
              class="deleteThat"
              circle
            ></el-button>
            <img :style="{'height':index==0 ? '205px':'100px'}" :src="item.imgUrl" alt>
            <div style="margin:5px 0;display: flex;flex-direction: row;">宽(rpx)
              <el-input v-model="item.width" placeholder="图片宽度，rpx"></el-input>高(rpx)
              <el-input v-model="item.height" placeholder="图片高度，rpx"></el-input>
            </div>
            <div style="margin:5px 0;">
              <el-input type="textarea" :rows="2" v-model="item.linkUrl" placeholder="请输入跳转地址,可带参数"></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="item.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否可跳转
              <el-switch v-model="item.isLink"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input type="textarea" :rows="2" v-model="item.tips" placeholder="请输入无跳转地址时提示语"></el-input>
            </div>
            <div style="margin:5px 0;">
              <span>左右排序</span>&nbsp;
              <el-button icon="el-icon-arrow-left" @click="itemsortleft(index,'zoneList')" circle></el-button>&nbsp;
              <el-button icon="el-icon-arrow-right" @click="itemsortright(index,'zoneList')" circle></el-button>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            :before-upload="beforeAvatarUpload5"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>

      <!-- 首页分享图 以及分享标题 -->
      <div class="bannerContent" id="indexShare">
        <div class="itemTitle">
          <span class="bigTitle">首页分享图</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('indexShare')"
              @click="addKey('indexShare',indexShare,'首页分享图','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('indexShare')"
              @click="addKey('indexShare',indexShare,'首页分享图','1',oldData.indexShare.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.indexShare.id)"
              v-if="oldData.hasOwnProperty('indexShare')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div
            class="bannerItem"
            style="width:400px;display:block;margin:0 auto"
            v-if="indexShare.imgUrl"
          >
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deletindexShare()"
              class="deleteThat"
              circle
            ></el-button>
            <img style="width:400px;height:321px;" :src="indexShare.imgUrl" alt>
            <div style="margin:5px 0;">
              <el-input v-model="indexShare.title" placeholder="分享标题"></el-input>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            v-if="!indexShare.imgUrl"
            :before-upload="beforeAvatarUpload6"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>

      <!-- 城市选择 -->
      <div class="bannerContent" id="citylist">
        <div class="itemTitle">
          <span class="bigTitle">城市选择列表</span>
          <span class="subTitle">(要求： 宽110px 高128px)</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('cityList')"
              @click="addKey('cityList',cityList,'城市选择列表','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('cityList')"
              @click="addKey('cityList',cityList,'城市选择列表','1',oldData.cityList.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.cityList.id)"
              v-if="oldData.hasOwnProperty('cityList')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div
            class="bannerItem"
            style="width:180px;"
            v-for="(item,index) of cityList"
            :key="index"
          >
            <el-button
              type="danger"
              icon="el-icon-delete "
              @click="deleteItem(index,'cityList')"
              class="deleteThat"
              circle
            ></el-button>
            <img style="width:110px;height:128px;" :src="item.imgUrl" alt>
            <div style="margin:5px 0;">
              <el-input v-model="item.name" placeholder="城市名,例如'武汉市'"></el-input>
            </div>
            <div style="margin:15px 0;">是否显示
              <el-switch v-model="item.isShow"></el-switch>
            </div>
            <div style="margin:15px 0;">是否开放
              <el-switch v-model="item.isOpen"></el-switch>
            </div>
            <div style="margin:5px 0;">
              <el-input v-model="item.tips" type="textarea" :rows="2" placeholder="请输入未开放时提示语"></el-input>
            </div>
            <div style="margin:5px 0;">
              <span>左右排序</span>&nbsp;
              <el-button icon="el-icon-arrow-left" @click="itemsortleft(index,'cityList')" circle></el-button>&nbsp;
              <el-button icon="el-icon-arrow-right" @click="itemsortright(index,'cityList')" circle></el-button>
            </div>
          </div>
          <el-upload
            style="display:inline-block"
            action="#"
            :before-upload="beforeAvatarUpload7"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>

      <!-- 快递 -->
      <div class="bannerContent" id="express">
        <div class="itemTitle">
          <span class="bigTitle">快递</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('express')"
              @click="addKey('express',express,'快递配送规则','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('express')"
              @click="addKey('express',express,'快递配送规则','1',oldData.express.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.express.id)"
              v-if="oldData.hasOwnProperty('express')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div style="margin:15px 0;width:100%;">快递配送
            <el-switch v-model="express.isOpen"></el-switch>
          </div>
          <div style="margin:15px 0;width:100%;">
            <el-input type="textarea" :rows="4" v-model="express.tips" placeholder="未开放快递配送时提示语"></el-input>
          </div>
        </div>
      </div>

      <!-- 提现 -->
      <div class="bannerContent" id="withdraw">
        <div class="itemTitle">
          <span class="bigTitle">提现</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('withdraw')"
              @click="addKey('withdraw',withdraw,'提现规则','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('withdraw')"
              @click="addKey('withdraw',withdraw,'提现规则','1',oldData.withdraw.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.withdraw.id)"
              v-if="oldData.hasOwnProperty('withdraw')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div style="margin:15px 0;width:100%;">提现
            <el-switch v-model="withdraw.isOpen"></el-switch>
          </div>
          <div style="margin:15px 0;width:100%;">
            <el-input type="textarea" :rows="4" v-model="withdraw.tips" placeholder="未开放提现时提示语"></el-input>
          </div>
        </div>
      </div>

      <!-- 视频 -->
      <div class="bannerContent" id="videoShow">
        <div class="itemTitle">
          <span class="bigTitle">视频</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('videoShow')"
              @click="addKey('videoShow',videoShow,'视频（显示或隐藏）','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('videoShow')"
              @click="addKey('videoShow',videoShow,'视频（显示或隐藏）','1',oldData.videoShow.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.videoShow.id)"
              v-if="oldData.hasOwnProperty('videoShow')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div style="margin:15px 0;width:100%;">视频（显示或隐藏）
            <el-switch v-model="videoShow"></el-switch>
          </div>
        </div>
      </div>

      <!-- 小程序规则描述 -->
      <div class="bannerContent" id="regulation">
        <div class="itemTitle">
          <span class="bigTitle">规则描述</span>
          <div style="float:right">
            <el-button
              type="primary"
              v-if="!oldData.hasOwnProperty('regulation')"
              @click="addKey('regulation',regulation,'视频（显示或隐藏）','1')"
            >添加记录</el-button>

            <el-button
              v-if="oldData.hasOwnProperty('regulation')"
              @click="addKey('regulation',regulation,'regulation','1',oldData.regulation.id)"
              type="success"
            >保存修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCongig(oldData.regulation.id)"
              v-if="oldData.hasOwnProperty('regulation')"
            ></el-button>
          </div>
        </div>
        <div class="bannerBox">
          <div style="width:100%;">
            <h4>拼购规则</h4>
            <div style="padding-left: 20px;">
              <span>列表规则</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.pintuan.listdesc"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>商品详情</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.pintuan.detaildesc"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>订单详情规则</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.pintuan.orderdesc"
              ></el-input>
            </div>
          </div>
          <div style="width:100%;">
            <h4>砍价规则</h4>
            <div style="padding-left: 20px;">
              <span>商品规则</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.bargain.goods"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>菜品规则</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.bargain.dish"
              ></el-input>
            </div>
          </div>
          <div style="width:100%;">
            <h4>签到规则</h4>
            <div style="padding-left: 20px;">
              <span>签到规则</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.checkin"
              ></el-input>
            </div>
          </div>
          <div style="width:100%;">
            <h4>红包抽奖规则</h4>
            <div style="padding-left: 20px;">
              <span>红包抽奖规则</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.lotteryredbag"
              ></el-input>
            </div>
          </div>

          <div style="width:100%;">
            <h4>红包贺卡规则</h4>
            <div style="padding-left: 20px;">
              <span>规则</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.redbagdesc"
              ></el-input>
            </div>
          </div>

          <div style="width:100%;">
            <h4>票券说明</h4>
            <div style="padding-left: 20px;">
              <span>说明</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.voucher"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>享7券</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.voucherRule.xiang7"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>砍价</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.voucherRule.kanjia"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>秒杀</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.voucherRule.miaosha"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>拼团</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.voucherRule.pintuan"
              ></el-input>
            </div>
            <div style="padding-left: 20px;">
              <span>享购</span>
              <el-input
                style="margin:15px 0;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="regulation.voucherRule.xianggou"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button @click="getContent" type="info">获取文本</el-button>
    <div id="editorElem" style="text-align:left;height:300px;width:1000px;margin:0 auto 80px;"></div>
  </div>
</template>

<script>
var E = require("wangeditor");
export default {
  name: "xiangqiversion",
  data() {
    return {
      baseUrl: "https://xiang7.net/",
      tonav: [
        {
          name: "轮播图",
          target: "#banner"
        },
        {
          name: "红包贺卡 ",
          target: "#redbag"
        },
        {
          name: "快速入口",
          target: "#navs"
        },
        {
          name: "活动横向滑块",
          target: "#activity"
        },
        {
          name: "首页副轮播",
          target: "#subswiper"
        },

        {
          name: "横幅",
          target: "#hengfu"
        },
        {
          name: "专区图",
          target: "#zone"
        },
        {
          name: "分享",
          target: "#indexShare"
        },
        {
          name: "城市选择",
          target: "#citylist"
        },
        {
          name: "快递",
          target: "#express"
        },
        {
          name: "提现",
          target: "#withdraw"
        },
        {
          name: "视频控制",
          target: "#videoShow"
        },
        {
          name: "规则描述",
          target: "#regulation"
        }
      ],
      editorContent: "",
      subswiper: [], //副轮播
      bannerList: [], //轮播图
      navsList: [], //快捷入口
      navbannerData: {}, //快速入口上方图片
      activityList: [], //活动滑块
      showRebbag: true, //红包显示字段1
      showRebbag2: true, //红包显示字段2
      fresh0: {}, //首页 横幅图
      zoneList: [], //首页专区 3张图
      indexShare: {}, //首页分享图 以及标题
      cityList: [], //小程序城市选择
      express: {}, //快递配送
      withdraw: {}, //提现
      oldData: {},
      regulation: {
        pintuan: {
          listdesc: "",
          detaildesc: "",
          orderdesc: ""
        },
        checkin: "",
        lotteryredbag: "",
        bargain: {
          goods: "",
          dish: ""
        },
        redbagdesc: "",
        voucher: "",
        voucherRule:{
          xiang7:'',
          kanjia:'',
          miaosha:'',
          pintuan:'',
          xianggou:''
        }
      }, //规则描述
      isScroll: false,
      videoShow: false
    };
  },
  created() {
    this.getData();
    console.log("created");
  },
  mounted() {
    var editor = new E("#editorElem");
    editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    editor.create();
    this.$prompt("请输入密码", "提示", {
      confirmButtonText: "确定",
      showClose: false,
      showCancelButton: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
      inputValidator: function(value) {
        return value == "2018" ? true : false;
      }
    })
      .then(({ value }) => {
        this.$message({
          type: "success",
          message: "验证成功 "
        });
      })
      .catch(() => {});
  },

  methods: {
    selectdomain(e) {
      this.$GLOBAL.API = e;
      this.login("check", e);
    },
    login(type, e) {
      let _this = this;
      // this.$GLOBAL.API+"  <==>  this.$GLOBAL.API+"
      this.$axios
        .post(this.$GLOBAL.API + "webApprove/auth/login?userName=13971489895")
        .then(res => {
          _this.token = "Bearer " + res.data.data;
          let _token = "Bearer " + res.data.data;
          sessionStorage.setItem("_TOKEN", _token);
          this.getData(type, e);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getContent: function() {
      alert(this.editorContent);
    },
    addKey(_key, _value, _desc, _type, id) {
      var params = new URLSearchParams();
      params.append("configKey", _key);
      params.append("configDesc", _desc);
      params.append("type", "1");
      if (_value instanceof Array || _value instanceof Object) {
        params.append("configValue", JSON.stringify(_value));
      } else {
        params.append("configValue", _value);
      }
      if (id) {
        params.append("id", id);
      }
      this.$axios
        .post(this.$GLOBAL.API + "globalConfig/add", params, {
          headers: {
            Authorization: sessionStorage.getItem("_TOKEN")
          }
        })
        .then(res => {
          var msg = id ? "保存成功" : "添加配置成功";
          this.$message({
            message: msg,
            type: "success"
          });
          this.getData();
        });
    },
    deleteCongig(id) {
      var params = new URLSearchParams();
      this.$prompt("删除此项配置，需要管理员手机号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value != "15927505686") {
            this.$message.error("管理员手机号不正确");
          } else {
            params.append("id", id);
            this.$axios
              .post(this.$GLOBAL.API + "globalConfig/delete", params, {
                headers: {
                  Authorization: sessionStorage.getItem("_TOKEN")
                }
              })
              .then(res => {
                this.$message({
                  type: "success",
                  message: "已成功删除此配置项: "
                });
              });
          }
        })
        .catch(() => {});
    },
    getData(type, e) {
      this.$axios
        .get(this.$GLOBAL.API + "globalConfig/list?type=1", {
          headers: {
            Authorization: sessionStorage.getItem("_TOKEN")
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.oldData = res.data.data;
            try {
              for (var k in this.oldData) {
                this.oldData[k].configValue = JSON.parse(
                  this.oldData[k].configValue
                );
              }
              for (let key in this.oldData) {
                for (let ind in this) {
                  if (key == ind) {
                    this[ind] = this.oldData[key].configValue;
                  }
                }
              }
              if (type == "check") {
                this.$notify({
                  title: "成功",
                  message:
                    "切换" + (e == "/api" ? "测试服" : "正式服") + "成功",
                  type: "success"
                });
              }
            } catch (err) {}
          }
        });
    },
    itemsortleft(index, keyName) {
      if (index == 0) {
        return false;
      }
      for (var k in this) {
        if (k == keyName) {
          this[k].splice(
            index,
            1,
            ...this[k].splice(index - 1, 1, this[k][index])
          );
        }
      }
    },
    itemsortright(index, keyName) {
      for (var k in this) {
        if (k == keyName) {
          if (index >= this[k].length - 1) {
            return false;
          }
          this[k].splice(
            index,
            1,
            ...this[k].splice(index + 1, 1, this[k][index])
          );
        }
      }
    },
    deleteItem(index, keyName) {
      this.$confirm("删除此项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (var k in this) {
            if (k == keyName) {
              console.log(this[k]);
              this[k].splice(index, 1);
            }
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    deleteItemRedbag() {
      this.$confirm("删除此项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.navbannerData = {};
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    deletehengfuitem() {
      this.$confirm("删除此项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.fresh0 = {};
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    deletindexShare() {
      this.$confirm("删除此项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.indexShare.imgUrl = "";
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    beforeAvatarUpload(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        let obj = {
          imgUrl: res,
          isShow: true,
          isLink: true,
          tips: "",
          linkUrl: ""
        };
        that.bannerList.push(obj);
      });
    },
    beforeAvatarUpload2(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        let obj = {
          imgUrl: res,
          name: "",
          isShow: true,
          isLink: true,
          tips: "",
          linkUrl: ""
        };
        that.navsList.push(obj);
      });
    },
    beforeAvatarUpload3(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        let obj = {
          imgUrl: res,
          isShow: true,
          isLink: true,
          tips: "",
          linkUrl: ""
        };
        that.activityList.push(obj);
      });
    },
    beforeAvatarUpload4(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        that.fresh0 = {
          imgUrl: res,
          isShow: true,
          isLink: true,
          tips: "",
          linkUrl: ""
        };
      });
    },
    beforeAvatarUpload5(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        let obj = {
          imgUrl: res,
          isShow: true,
          isLink: true,
          tips: "",
          linkUrl: ""
        };
        that.zoneList.push(obj);
      });
    },
    beforeAvatarUpload6(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        that.indexShare = {
          imgUrl: res
        };
      });
    },
    beforeAvatarUpload7(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        let obj = {
          imgUrl: res,
          isShow: true,
          name: "",
          isOpen: true,
          tips: ""
        };
        that.cityList.push(obj);
      });
    },
    beforeAvatarUpload8(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        that.navbannerData = {
          imgUrl: res
        };
      });
    },
    beforeAvatarUpload9(file) {
      let that = this;
      uploadImg(file, this).then(res => {
        let obj = {
          imgUrl: res,
          isShow: true,
          isLink: true,
          tips: "",
          linkUrl: ""
        };
        that.subswiper.push(obj);
      });
    }
  }
};

var uploadImg = function(file, _this) {
  return new Promise((resolve, reject) => {
    let form = new FormData();
    let that = _this;
    form.append("file", file);
    form.append("userName", "15927505686");
    that.$axios
      .post(that.$GLOBAL.API + "img/uploadMp4", form, {
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      })
      .then(res => {
        if (res.data.code == 0) {
          return resolve(res.data.data.picUrl);
        }
      });
  });
};

</script> 
<style scoped lang="less">
.domain {
  position: fixed;
  left: 10px;
  top: 400px;
}
.tonav {
  background: #fff;
  box-shadow: 0px 0px 10px #ddd;
  position: fixed;
  right: 0;
  top: 50px;
  a {
    padding: 10px 20px;
    text-decoration: none;
    display: block;
    // width: 120px;
    font-size: 16px;
    color: #191919;
    text-align: left;
    transition: 0.2s all;
  }
  a:hover {
    background: #ddd;
  }
}
.miniprogram {
  position: fixed;
  width: 150px;
  height: 150px;
  left: 0px;
  top: 200px;
  border-radius: 10px;
  padding: 15px;
  background: #fff;
  box-shadow: 0px 0px 10px #ddd;
  img {
    width: 150px;
    height: 150px;
  }
}
.navTitle {
  background: #212122;
  height: 50px;
  width: 100%;
  line-height: 50px;
  padding-left: 100px;
  box-sizing: border-box;
  color: #fff;
  text-align: left;
  font-size: 28px;
}
.navTitle.fixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
.content {
  width: 1000px;
  text-align: left;
  margin: 30px auto;

  .itemTitle {
    padding: 20px 15px;
    border-bottom: 1px solid #e0e0e0;
    .bigTitle {
      color: #191919;
      font-size: 18px;
      font-weight: 700;
    }
    .subTitle {
      margin-left: 5px;
      color: #969696;
      font-size: 16px;
    }
  }
  .bannerContent {
    width: 100%;
    background: #fff;
    margin-bottom: 20px;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px #ddd;
    .bannerBox {
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      .bannerItem:hover {
        box-shadow: 0px 0px 10px #ddd;
      }
      .bannerItem {
        width: 270px;
        display: inline-block;
        padding: 10px;
        margin: 10px;
        border-radius: 10px;
        transition: 0.3s all;
        position: relative;
        .deleteThat {
          position: absolute;
          right: 15px;
          top: 15px;
          cursor: pointer;
        }
        img {
          width: 100%;
          height: 150px;
        }
      }
    }
  }
}
</style>


