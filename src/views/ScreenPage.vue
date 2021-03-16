<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt="">
      </div>
      <!--logo-->
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt="">
      </span>
      <!--标题-->
      <span class="title">分布式存储运维监控系统</span>
      <div class="title-right">
        <img src="/static/img/qiehuan_dark.png" alt="">
        <span class="datetime">2021年3月16日22:22:56</span>
      </div>
    </header>

    <div class="screen-body">
      <section class="screen-left">
        <!--销量趋势图表-->
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <trend ref="trend"/>
          <div class="resize">
            <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"/>
          </div>
        </div>
        <!--商家销售金额图表-->
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <seller ref="seller"/>
          <div class="resize">
            <span @click="changeSize('seller')" :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"/>
          </div>
        </div>
      </section>
      <section class="screen-middle" >
        <!-- 商家分布图表 -->
        <div id="middle-top" :class="[fullScreenStatus.businessMap ? 'fullscreen' : '']">
          <business-map ref="businessMap"/>
          <div class="resize">
            <span @click="changeSize('businessMap')" :class="['iconfont', fullScreenStatus.businessMap ? 'icon-compress-alt' : 'icon-expand-alt']"/>
          </div>
        </div>
        <!-- 地区销量排行图表 -->
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <rank ref="rank"/>
          <div class="resize">
            <span @click="changeSize('rank')" :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"/>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <!-- 热销商品占比图表 -->
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <hot ref="hot"/>
          <div class="resize">
            <span @click="changeSize('hot')" :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"/>
          </div>
        </div>
        <!-- 库存销量分析图表 -->
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <stock ref="stock"/>
          <div class="resize">
            <span @click="changeSize('stock')" :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"/>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import BusinessMap from "@/components/BusinessMap";
  import Hot from "@/components/Hot";
  import Rank from "@/components/Rank";
  import Seller from "@/components/Seller";
  import Stock from "@/components/Stock";
  import Trend from "@/components/Trend";

  export default {
    name: "ScreenPage",
    components: {
      BusinessMap,
      Rank,
      Hot,
      Seller,
      Stock,
      Trend
    },
    data () {
      return {
        // 定义每一个图表的全屏状态
        fullScreenStatus: {
          trend: false,
          seller: false,
          businessMap: false,
          rank: false,
          hot: false,
          stock: false
        }
      }
    },
    methods: {

      /**
       * 全屏/退出全屏
       * @param chartName 组件名称
       */
      changeSize(chartName) {
        this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
        this.$nextTick(() => {
          this.$refs[chartName].adaptScreen()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .fullscreen {
    position: fixed!important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    z-index: 100;
  }

  .screen-container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: #161522;
    color: #fff;
    box-sizing: border-box;
  }
  .screen-header {
    width: 100%;
    height: 64px;
    font-size: 20px;
    position: relative;
    > div {
      img {
        width: 100%;
      }
    }
    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }
    .title-right {
      display: flex;
      align-items: center;
      position:absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-80%);
    }
    .qiehuan {
      width: 28px;
      height: 21px;
      cursor: pointer;
    }
    .datetime {
      font-size: 15px;
      margin-left: 10px;
    }
    .logo {
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-80%);
      img {
        height: 35px;
        width: 128px;
      }
    }
  }
  .screen-body {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;
    .screen-left {
      height: 100%;
      width: 27.6%;
      #left-top {
        height: 53%;
        position: relative;
      }
      #left-bottom {
        height: 31%;
        margin-top: 25px;
        position: relative;
      }
    }
    .screen-middle {
      height: 100%;
      width: 41.5%;
      margin-left: 1.6%;
      margin-right: 1.6%;
      #middle-top {
        width: 100%;
        height: 56%;
        position: relative;
      }
      #middle-bottom {
        margin-top: 25px;
        width: 100%;
        height: 28%;
        position: relative;
      }
    }
    .screen-right {
      height: 100%;
      width: 27.6%;
      #right-top {
        height: 46%;
        position: relative;
      }
      #right-bottom {
        height: 38%;
        margin-top: 25px;
        position: relative;
      }
    }
  }
  .resize {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }

</style>
