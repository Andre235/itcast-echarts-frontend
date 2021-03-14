<template>
  <div class="com-container">
    <div class="com-chart" ref="trend">

    </div>
  </div>
</template>

<script>
  export default {
    name: "Trend",
    data() {
      return {
        chartInstance: null,
        allData: null

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
        this.chartInstance = this.$echarts.int(this.$refs.trend)
        const initOption = {

        }
        this.chartInstance.setOption(initOption)

      },

      /**
       * 查询数据
       */
      async getData() {
        // 从服务端查询数据
        await this.$http.get();
        // allData赋值
        this.allData = null
        this.updateChart()
      },

      /**
       * 更新图表
       */
      updateChart() {
        const dataOption = null
        this.chartInstance.setOption(dataOption)
      },

      /**
       * 适配屏幕分辨率
       */
      adaptScreen() {
        const adapterOption = null
        this.chartInstance.setOption(adapterOption)

        // 手动对echarts实例对象进行resize
        this.chartInstance.resize()
      }
    }
  }
</script>

<style scoped>

</style>
