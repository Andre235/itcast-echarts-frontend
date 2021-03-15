<template>
  <div class="com-container" @dblclick="backToChina">
    <div class="com-chart" ref="chinaMap">
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import chinaMap from "../../public/static/map/china.json";
  import {getProvinceMapInfo} from '@/utils/map_utils'

  export default {
    name: "BusinessMap",
    data() {
      return {
        chartInstance: {},
        allData: {},
        chinaMapData: {},
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
        this.chartInstance = this.$echarts.init(this.$refs.chinaMap, 'chalk')
        // 注册地图数据
        this.$echarts.registerMap('china', chinaMap)
        const initOption = {
          title: {
            text: '▎商家地图分布',
            left: 20,
            top: 20,
          },
          geo: {
            type: 'map',
            map: 'china', // 地图矢量数据
            top: '5%',
            bottom: '5%',
            itemStyle: {
              areaColor: '#2E72BF',
              borderColor: '#333',
            },
          },
          legend: {
            left: '5%',
            bottom: '5%',
            orient: 'vertical'
          }
        }
        this.chartInstance.setOption(initOption)

        // chart对点击事件的监听
        this.chartInstance.on('click', async (args) => {
          const provinceMapInfo = getProvinceMapInfo(args.name);
          if(!this.chinaMapData[provinceMapInfo.key]) {
            // 获取这个省份的地图矢量数据
            const {data: result} = await axios.get('http://localhost:8081' + provinceMapInfo.path)
            this.chinaMapData[provinceMapInfo.key] = result
            this.$echarts.registerMap(provinceMapInfo.key, result)
            const changeOption = {
              geo: {
                map: provinceMapInfo.key
              }
            }
            this.chartInstance.setOption(changeOption)
          }
        })
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
            rippleEffect: { //控制涟漪效果
              scale: 10, // 涟漪缩放大小
              brushType: 'stroke' //空心涟漪效果
            },
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
        const titleFontSize = this.$refs.chinaMap.offsetWidth / 100 * 3.6
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize,
            }
          },
          legend: {
            itemWidth: titleFontSize / 3,
            itemHeight: titleFontSize / 3,
            itemGap: titleFontSize / 3,
            textStyle: {
              fontSize: titleFontSize / 3
            }
          }
        }
        this.chartInstance.setOption(adapterOption)

        // 手动对echarts实例对象进行resize
        this.chartInstance.resize()
      },

      /**
       * 回到中国地图
       */
      backToChina() {
        const chinaOption = {
          geo: {
            map: 'china'
          }
        }
        this.chartInstance.setOption(chinaOption)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
