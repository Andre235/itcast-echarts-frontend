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
        allData: null
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
      },

      /**
       * 查询数据
       */
      async getData() {
        // 从服务端查询数据
        const {data: result} = await this.$http.get('rank');
        console.log(result);
        this.allData = result.sort((item1, item2) => item2.value - item1.value)
        this.updateChart()
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
        console.log(provinceArray);
        const valueArray = this.allData.map(item => item.value)
        console.log(valueArray);

        const dataOption = {
          xAxis: {
            data: provinceArray,
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
        const adapterOption = {}
        this.chartInstance.setOption(adapterOption)

        // 手动对echarts实例对象进行resize
        this.chartInstance.resize()
      },

      getColorByValue(value) {
        if(value > 300) {
          return 'red'
        } else if(value > 200) {
          return 'blue'
        } else {
          return 'green'
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
