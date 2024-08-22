<template>
  <main class="container-fluid px-4 mt-5">
    <h2 class="text-center">Dashboard</h2>

    <div
      v-if="chartOptions.xaxis.categories.length > 0"
      class="col-12 col-sm-12 col-md-12 col-lg-6 mt-3"
    >
      <apexchart type="area" :options="chartOptions" :series="series" />
    </div>
  </main>
</template>

<script>
import EvolutionService from '@/services/evolution'
import { useAuth } from '@/store/auth'

export default {
  data() {
    return {
      userLogged: useAuth(),

      series: [
        {
          name: 'Ações',
          data: []
        },
        {
          name: 'Fundos imobiliários',
          data: []
        }
      ],
      chartOptions: {
        title: {
          text: 'Histórico de ativos',
          align: 'center'
        },
        chart: {
          height: 350,
          type: 'area',
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return 'R$' + value.toFixed(2).replace('.', ',')
            }
          }
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'
          }
        }
      }
    }
  },
  mounted() {
    this.loadEvolutionOfHeritage()
  },
  methods: {
    loadEvolutionOfHeritage() {
      EvolutionService.index(this.userLogged.userLogged.id)
        .then((response) => {
          let result = [
            {
              name: 'Ações',
              data: []
            },
            {
              name: 'Fundos imobiliários',
              data: []
            }
          ]

          result.map((element) => {
            if (element.name === 'Ações') {
              element.data = response.data.actions.map((item) => item.value)
            } else {
              element.data = response.data.real_estate_funds.map((item) => item.value)
            }
          })

          this.series = result
          this.chartOptions.xaxis.categories = response.data.actions.map((item) => item.created_at)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
