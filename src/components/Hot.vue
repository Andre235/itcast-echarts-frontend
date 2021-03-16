<template>
  <div class="com-container">
    <div class="com-chart" ref="hot"/>
    <span class="iconfont arr-left" @click="changeCurrentIndex(false)" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="changeCurrentIndex(true)" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{currentCategoryName}}</span>
  </div>
</template>

<script>
  export default {
    name: "Hot",
    data() {
      return {
        chartInstance: null,
        allData: null,
        currentIndex: 0, // 当前所展示的一级分类的索引
        titleFontSize: 0
      }
    },
    computed: {
      currentCategoryName() {
        return this.allData === null ? '' : this.allData[this.currentIndex].name
      },
      comStyle() {
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
       * 初始化图表
       */
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.hot, 'chalk')
        const initOption = {
          title: {
            text: '▎ 热销商品的占比',
            left: 20,
            top: 20
          },
          legend: {
            top: '12%',
            icon: 'circle'
          },
          tooltip: {
            show: true,
            formatter: args => {
              const thirdCategory = args.data.children
              // 计算出所有三级分类的数值总和
              let totalValue = 0
              thirdCategory.forEach(item => {
                totalValue += item.value
              })
              let resultString = ''
              thirdCategory.forEach(item => {
                resultString += `
                  ${item.name}: ${parseInt(item.value / totalValue * 100) + '%'}
                  <br/>
                `
              })
              return resultString
            }
          },
          series: {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        }
        this.chartInstance.setOption(initOption)
      },

      /**
       * 查询数据
       */
      async getData() {
        // 从服务端查询数据
        const {data: result} = await this.$http.get('hotProduct');
        this.allData = result
        this.updateChart()
      },

      /**
       * 更新图表
       */
      updateChart() {
        const seriesData = this.allData[this.currentIndex].children.map(item => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          }
        })
        const legendArray  = this.allData[this.currentIndex].children.map(item => item.name)
        const dataOption = {
          legend: {
            data: legendArray
          },
          series: [
            {
              data: seriesData
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },

      /**
       * 适配屏幕分辨率
       */
      adaptScreen() {
        this.titleFontSize = this.$refs.hot.offsetWidth / 100 * 3.6
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: this.titleFontSize
            }
          },
          legend: {
            itemWidth: this.titleFontSize,
            itemHeight: this.titleFontSize,
            itemGap: this.titleFontSize / 2,
            textStyle: {
              fontSize: this.titleFontSize / 2
            }
          },
          series: [
            {
              radius: this.titleFontSize * 4.5,
              center: ['50%', '60%']
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)

        // 手动对echarts实例对象进行resize
        this.chartInstance.resize()
      },

      /**
       * 改变当前所展示的饼状图的索引
       * @param directionFlag false：上一个图表数据   true：下一个图表数据
       */
      changeCurrentIndex(directionFlag) {
        if(directionFlag){
          this.currentIndex ++
          if(this.currentIndex === this.allData.length){
            this.currentIndex = 0
          }
        }
        if(! directionFlag){
          this.currentIndex --
          if(this.currentIndex === -1){
            this.currentIndex = this.allData.length - 1
          }
        }
        this.updateChart()
      }
    }
  }
</script>

<style lang="less" scoped>
  .arr-left {
    position:absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: white;
    font-size: 50px;
  }
  .arr-right {
    position:absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: white;
    font-size: 50px;
  }
  .cat-name {
    position:absolute;
    left: 80%;
    bottom: 20px;
    color: white;
  }
</style>
