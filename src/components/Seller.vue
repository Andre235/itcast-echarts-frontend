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
        currentPage: 1, // 当前显示的页数
        totalPage: 0, // 总页数
        timerId: null // 定时器ID
      }
    },
    // Vue生命周期：在mounted方法中，DOM元素加载完成
    mounted() {
      this.initChart();
      this.getData();
    },
    destroyed() {
      clearInterval(this.timerId)
    },
    methods: {
      /**
       * 初始化echarts实例对象
       */
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.seller, 'chalk')
        // echarts实例对象对鼠标事件监听(清除定时器)
        this.chartInstance.on('mouseover', () => clearInterval(this.timerId))
        // echarts实例对象对鼠标事件监听(开启定时器)
        this.chartInstance.on('mouseout', () => this.startInterval())
      },

      /**
       * 获取服务器数据
       */
      async getData() {
        const {data: result} = await this.$http.get('seller')
        this.data = result;
        // 将数据从小到大排序
        this.data.sort((a, b) => a.value - b.value)
        // 每5个元素显示一页
        this.totalPage = this.data.length % 5 === 0 ? this.data.length / 5 : this.data.length / 5 + 1;
        console.log(this.totalPage);
        this.updateChart();
      },

      /**
       * 更新图表
       */
      updateChart() {
        const start = (this.currentPage - 1) * 5;
        const end = this.currentPage * 5;
        const showData = this.data.slice(start, end);

        const sellerNames = showData.map(item => item.name)
        const sellerValues = showData.map(item => item.value)
        const option = {
          title: {
            text: '商家销售统计',
            textStyle: {
              fontSize: 66
            },
            left: 20,
            top: 20
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              z: 0, // 调整背景颜色的层级
              lineStyle: {
                width: 66,
                color: '#2D3443'
              }
            }
          },
          // 直接坐标系通用配置
          grid: {
            top: '20%', //边距
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true // 距离包含坐标轴上的文字
          },
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
              data: sellerValues,
              barWidth:66, // 柱子宽度
              label: { // 柱子文字
                show: true,
                position: 'right',
                textStyle: {
                  color: 'white'
                }
              },
              itemStyle: { // 柱状图的每一个柱子条目
                barBorderRadius: [0, 33, 33, 0], // 柱子圆角控制 [左上角圆角半径 右上角圆角半径 右下角 左下角]
                // 颜色渐变
                // 指明颜色渐变方向  两个点的坐标分别是(0,0) --> (1, 0)，因此颜色渐变的方向是从左到右
                // 指明不同百分比的颜色值
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  // 0% 状态下的颜色值
                  {
                    offset: 0,
                    color: '#5052EE'
                  },
                  // 100% 状态下的颜色值
                  {
                    offset: 1,
                    color: '#AB6EE5'
                  }
                ])
              }
            }
          ]
        };
        this.chartInstance.setOption(option);
        // 启动定时器
        this.startInterval();
      },

      /**
       * 启动定时器
       */
      startInterval() {
        if(this.timerId) {
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(() => {
          this.currentPage ++;
          if(this.currentPage > this.totalPage) {
            this.currentPage = 1;
          }
          console.log('this.currentPage: ' + this.currentPage);
          this.updateChart();
        }, 3000)
      }
    }
  }
</script>

<style scoped>

</style>
