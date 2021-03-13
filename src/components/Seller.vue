<template>
  <div class="com-container">
    <div class="com-chart" ref="seller">

    </div>
  </div>

</template>

<script>
  export default {
    name: "Seller",
    data() {
      return {
        chartInstance: null,
        data: null,
      }
    },
    // Vue生命周期：在mounted方法中，DOM元素加载完成
    mounted() {
      this.initChart();
      this.getData();
    },
    methods: {
      /**
       * 初始化echarts实例对象
       */
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.seller)
      },

      /**
       * 获取服务器数据
       */
      async getData() {
        const {data: result} = await this.$http.get('seller')
        this.data = result;
        console.log(result);
        this.updateChart();
      },

      /**
       * 更新图表
       */
      updateChart() {
        const sellerNames = this.data.map(item => item.name)
        // console.log(sellerNames);
        const sellerValues = this.data.map(item => item.value)
        // console.log(sellerValues);
        const option = {
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: sellerNames
          },
          series: [
            {
              type: 'bar',
              data: sellerValues
            }
          ]
        };
        this.chartInstance.setOption(option)
      }
    }
  }
</script>

<style scoped>

</style>
