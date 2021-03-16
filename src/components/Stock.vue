<template>
  <div class="com-container">
    <div class="com-chart" ref='stock_ref'>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Stock",
    data() {
      return {
        chartInstance: null,
        allData: null,
        currentIndex: 0, //当前索引值
        timerId: null
      }
    },
    mounted() {
      this.initChart()
      this.getData()
      this.startInterval()
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
        this.chartInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
        const initOption = {
          title: {
            text: '▎ 库存和销量分析',
            left: 20,
            top: 20
          }
        }
        this.chartInstance.setOption(initOption)
        // 移除定时器
        this.chartInstance.on('mouseover', ()=> {
          clearInterval(this.timerId)
        })
        // 开启定时器
        this.chartInstance.on('mouseout', ()=> {
          this.startInterval()
        })
      },

      /**
       * 查询数据
       */
      async getData() {
        // 从服务端查询数据
        const {data: result} = await this.$http.get('stock');
        this.allData = result
        console.log(this.allData);
        this.updateChart()
      },

      /**
       * 更新图表
       */
      updateChart() {
        // 中心点坐标数组
        const centerPointArray = [
          ['18%', '40%'],
          ['50%', '40%'],
          ['82%', '40%'],
          ['34%', '75%'],
          ['66%', '75%']
        ]
        const colorArray = [
          ['#4FF778', '#0BA82C'],
          ['#E5DD45', '#E8B11C'],
          ['#E8821C', '#E55445'],
          ['#5052EE', '#AB6EE5'],
          ['#23E5E5', '#2E72BF']
        ]
        // 需要展示的数据
        const startIndex = this.currentIndex * 5
        const endIndex = (this.currentIndex + 1) * 5
        const showData = this.allData.slice(startIndex, endIndex);

        const seriesArray = showData.map((item, index) => {
          return {
            type: 'pie',
            radius: [110, 100],
            center: centerPointArray[index], // 中心点坐标
            hoverAnimation: false, //关闭鼠标移入到饼图时的动画效果
            label: {
              position: 'center',
              color: colorArray[index][0]
            },
            labelLine: {
              show: false // 隐藏指示线
            },
            data: [
              {
                name: item.name + '\n\n' + item.sales,
                value: item.sales,
                itemStyle: {
                  // color: new this.$echarts.
                }
              },
              {
                value: item.stock,
                itemStyle: {
                  color: '#333843'
                }
              }
            ]
          }
        })
        const dataOption = {
          series: seriesArray
        }
        this.chartInstance.setOption(dataOption)
      },

      /**
       * 适配屏幕分辨率
       */
      adaptScreen() {
        const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
        const innerRadius = titleFontSize * 2.8
        const outterRadius = innerRadius * 1.125
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize
            }
          },
          series: [
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },

      /**
       * 开始定时器
       */
      startInterval() {
        if(this.timerId){
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(() => {
          this.currentIndex ++
          if(this.currentIndex > 1){
            this.currentIndex = 0
          }
          this.updateChart()
        }, 2000)
      }
    }
  }
</script>

<style scoped>

</style>
