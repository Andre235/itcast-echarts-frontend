<template>
  <div class="com-container">
    <div class="com-chart" ref="rank">
      <span>销售排行</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Rank",
    data() {
      return {
        chartInstance: null,
        allData: null,
        zoomStartIndex: 1, // zoom区域缩放起始下标
        zoomEndIndex: 9, // zoom区域缩放终点下标
        timerId: null, // 定时器ID
      }
    },
    computed: {
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
      clearInterval(this.timerId)
    },

    methods: {
      /**
       * 初始化图表
       */
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.rank, 'chalk')
        const initOption = {
          xAxis: {
            type: 'category' // 类目轴
          },
          yAxis: {
            type: 'value' // 数值型
          },
          title: {
            text: '▎地区销售排行',
            left: 20,
            top: 20
          },
          grid: {
            top: '40%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          tooltip: {
            show: true
          },
          series: [
            {
              type: 'bar' // 柱状图
            }
          ]
        }
        this.chartInstance.setOption(initOption)

        this.chartInstance.on('mouseover', () => {
          clearInterval(this.timerId)
        })
        this.chartInstance.on('mouseout', () => {
          this.startInterval()
        })
      },

      /**
       * 查询数据
       */
      async getData() {
        // 从服务端查询数据
        const {data: result} = await this.$http.get('rank');
        this.allData = result.sort((item1, item2) => item2.value - item1.value)
        this.updateChart()
        this.startInterval()
      },

      /**
       * 更新图表
       */
      updateChart() {
        const colorArr = [
          ['#0BA82C', '#4FF778'],
          ['#2E72BF', '#23E5E5'],
          ['#5052EE', '#AB6EE5']
        ]

        const provinceArray = this.allData.map(item => item.name)
        const valueArray = this.allData.map(item => item.value)

        const dataOption = {
          xAxis: {
            data: provinceArray,
          },
          dataZoom: {
            show: false,
            startValue: this.zoomStartIndex,
            endValue: this.zoomEndIndex,
          },
          series: [
            {
              data: valueArray,
              itemStyle: {
                color: arg => {
                  let targetColorArr = null
                  if (arg.value > 300) {
                    targetColorArr = colorArr[0]
                  } else if (arg.value > 200) {
                    targetColorArr = colorArr[1]
                  } else {
                    targetColorArr = colorArr[2]
                  }
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: targetColorArr[0]
                    },
                    {
                      offset: 1,
                      color: targetColorArr[1]
                    }
                  ])
                }
              }
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },

      /**
       * 适配屏幕分辨率
       */
      adaptScreen() {
        const titleFontSize = this.$refs.rank.offsetWidth / 100 * 3.6
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize
            }
          },
          series: [
            {
              barWidth: titleFontSize,
              itemStyle: {
                barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
              }
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)

        // 手动对echarts实例对象进行resize
        this.chartInstance.resize()
      },

      /**
       * 通过数值大小返回响应的颜色
       * @param value
       * @returns {string}
       */
      getColorByValue(value) {
        if(value > 300) {
          return 'red'
        } else if(value > 200) {
          return 'blue'
        } else {
          return 'green'
        }
      },

      /**
       * 开启定时器
       */
      startInterval() {
        if(this.timerId) {
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(() => {
          this.zoomStartIndex ++
          this.zoomEndIndex ++
          if(this.zoomEndIndex > this.allData.length - 1){
            this.zoomStartIndex = 0
            this.zoomEndIndex = 9
          }
          this.updateChart()
        }, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
