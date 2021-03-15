<template>
  <div class="com-container">
    <div class="title" :style="titleStyle">
      <span>{{showTitle}}</span>
      <span class="iconfont title-icon" :style="titleStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelectType(item)">
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend"/>
  </div>
</template>

<script>
  export default {
    name: "Trend",
    data() {
      return {
        chartInstance: null,
        allData: null,
        showChoice: false, // 可选项数据
        selectedTypeKey: 'map', // 默认选中的图表数据类型的键
        titleFontSize: 0, // 标题字体的大小
      }
    },
    computed: {
      selectTypes() {
        if (!this.allData) {
          return []
        } else {
          return this.allData.type.filter(item => item.key !== this.selectedTypeKey)
        }
      },
      showTitle() {
        if(!this.allData){
          return ''
        }else {
          return this.allData[this.selectedTypeKey].title
        }
      },
      titleStyle() {
        return {
          fontSize: this.titleFontSize + 'px'
        }
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
       * 改变选中的数据类型
       */
      handleSelectType(item) {
        this.selectedTypeKey = item.key
        this.updateChart()
        this.showChoice = false
      },

      /**
       * 初始化图表
       */
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.trend, 'chalk')
        const initOption = {
          xAxis: {
            type: 'category',
            boundaryGap: false // X轴是否需要间隙(紧挨着Y坐标轴)
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {  // 工具提示
            trigger: 'axis'
          },
          legend: {
            left: 20,
            top: '15%',
            icon: 'circle' // 图例图标设置为圆形
          },
          grid: {
            left: '3%',
            top: '35%',
            right: '4%',
            bottom: '1%',
            containLabel: true // 把坐标轴的文字也控制在偏移的大小范围内
          }
        }
        this.chartInstance.setOption(initOption)
      },

      /**
       * 查询数据
       */
      async getData() {
        // 从服务端查询数据
        const {data: result} = await this.$http.get('trend');
        console.log(result);
        // allData赋值
        this.allData = result
        this.updateChart()
      },

      /**
       * 更新图表
       */
      updateChart() {
        // 半透明的颜色值
        const colorArr1 = [
          'rgba(11, 168, 44, 0.5)',
          'rgba(44, 110, 255, 0.5)',
          'rgba(22, 242, 217, 0.5)',
          'rgba(254, 33, 30, 0.5)',
          'rgba(250, 105, 0, 0.5)'
        ]
        // 全透明的颜色值
        const colorArr2 = [
          'rgba(11, 168, 44, 0)',
          'rgba(44, 110, 255, 0)',
          'rgba(22, 242, 217, 0)',
          'rgba(254, 33, 30, 0)',
          'rgba(250, 105, 0, 0)'
        ]

        const xAxisData = this.allData.common.month
        // y轴数据
        const valueArray = this.allData[this.selectedTypeKey].data
        const seriesArray = valueArray.map((item, index) => {
          return {
            name: item.name,
            type: 'line',
            data: item.data,
            stack: this.selectedTypeKey, // 设置折线图效果为堆叠图
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                // 0% 状态下的颜色值
                {
                  offset: 0,
                  color: colorArr1[index]
                },
                // 100% 状态下的颜色值
                {
                  offset: 1,
                  color: colorArr2[index]
                }
              ])
            },
          }
        })
        // 图例数组
        const legendArray = valueArray.map(item => item.name)
        const dataOption = {
          xAxis: {
            data: xAxisData
          },
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
        // 标题的大小
        this.titleFontSize = this.$refs.trend.offsetWidth / 100 * 3.6;
        const adapterOption = {
          legend: {
            itemWidth: this.titleFontSize,
            itemHeight: this.titleFontSize,
            itemGap: this.titleFontSize,
            textStyle: {
              fontSize: this.titleFontSize / 2
            }
          }
        }
        this.chartInstance.setOption(adapterOption)

        // 手动对echarts实例对象进行resize
        this.chartInstance.resize()
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: white;
    .title-icon {
      margin-left: 10px;
      cursor: pointer;
    }
    .select-con {
      background-color: #222733;
    }
  }
</style>
