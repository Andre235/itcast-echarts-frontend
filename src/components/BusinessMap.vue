<template>
  <div class="com-container">
    <div class="com-chart" ref="chinaMap" :style="{width: '100%', height: '100%'}">
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import chinaMap from "../../public/static/map/china.json";

  export default {
    name: "BusinessMap",
    data() {
      return {
        chartInstance: null,
        allData: null,
        chinaMapData: null,
      }
    },
    mounted() {
      this.initChart()
      this.getData()

      window.addEventListener('resize', this.adaptScreen)
      // 组件初次加载的时候需要手动进行屏幕适配
      this.adaptScreen()
    },

    destroyed() {
      // 组件销毁的时候需要手动移除windows的事件监听器(防止内存泄漏)
      window.removeEventListener('resize', this.adaptScreen)
    },

    methods: {
      /**
       * 初始化图表
       */
      async initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.chinaMap)
        // 注册地图数据
        this.$echarts.registerMap('china', chinaMap)
        const initOption = {
          geo: {
            type: 'map',
            map: 'china' // 地图矢量数据
          }
        }
        this.chartInstance.setOption(initOption)
      },

      /**
       * 查询数据
       */
      async getData() {
        // 从服务端查询数据
        const {data: result} = await this.$http.get('map');
        // allData赋值
        this.allData = result
        this.updateChart()
      },

      /**
       * 更新图表
       */
      updateChart() {
        // 获取地图需要的散点数据，map对象返回的是一个数组
        const seriesArray = this.allData.map(item => {
          // return的这个对象就代表这个类别下的散点数据
          return {
            type: 'effectScatter', // 涟漪类型散点
            name: item.name,
            data: item.children,
            coordinateSystem: 'geo', // 如果想要在地图中显示散点数据，我们需要给散点图添加此配置
          }
        })
        // 图例数据
        const legendArray = this.allData.map(item => item.name)
        const dataOption = {
          legend: {
            data: legendArray
          },
          series: seriesArray
        }
        this.chartInstance.setOption(dataOption)
      },

      /**
       * 适配屏幕分辨率
       */
      adaptScreen() {
        const adapterOption = {}
        this.chartInstance.setOption(adapterOption)

        // 手动对echarts实例对象进行resize
        this.chartInstance.resize()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
