<script setup lang="ts">
  import { ref, computed, PropType } from 'vue'
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  import COLORS from '@/utils/helpers/colors'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

  const props = defineProps({
    labels: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    data: {
      type: Array as PropType<number[]>,
      default: () => []
    }
  })

  const data = computed(() => ({
    labels: props.labels,
    datasets: [
      {
        label: 'Количество',
        borderColor: COLORS,
        backgroundColor: COLORS,
        hoverBackgroundColor: COLORS,
        data: props.data,
        borderRadius: 6,
        datalabels: {
          align: 'end',
          anchor: 'end'
        }
      }
    ]
  })) as any

  const options = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#cccccc',
        color: '#171717',
        font: {
          weight: 'bold'
        },
        formatter: Math.round,
        padding: 6
      }
    },
    layout: {
      padding: {
        top: 40,
        right: 16,
        bottom: 0,
        left: 16
      }
    },
    scales: {
      x: {
        grid: {
          color: 'transparent',
          borderColor: 'transparent',
          tickColor: 'transparent'
        }
      },
      y: {
        grid: {
          borderColor: 'transparent',
          tickColor: 'transparent'
        }
      }
    }
  }) as any
</script>

<template>
  <Bar :data="data" :options="options" />
</template>

<style></style>
