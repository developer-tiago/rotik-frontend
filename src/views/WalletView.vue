<template>
  <main class="container-fluid px-4 mt-5">
    <h2>Minha carteira</h2>
    <div class="d-flex flex-wrap mb-5">
      <div v-if="seriesGeral.length > 0" class="col-12 col-sm-12 col-md-12 col-lg-4 mt-3">
        <apexchart type="donut" :options="chartOptionsGeral" :series="seriesGeral" />
      </div>
      <div v-if="seriesActions.length > 0" class="col-12 col-sm-12 col-md-12 col-lg-4 mt-3">
        <apexchart type="donut" :options="chartOptionsActions" :series="seriesActions" />
      </div>
      <div v-if="seriesFunds.length > 0" class="col-12 col-sm-12 col-md-12 col-lg-4 mt-3">
        <apexchart type="donut" :options="chartOptionsFunds" :series="seriesFunds" />
      </div>
    </div>

    <div
      v-if="seriesGeral.length == 0 && seriesActions.length == 0 && seriesFunds.length == 0"
      class="text-center"
    >
      <span>Sua carteira está vazia. Adicione ativos para começar a investir.</span>
    </div>

    <div class="d-flex flex-wrap">
      <div
        v-if="seriesEvolutionFunds[0].data.length > 0"
        class="col-12 col-sm-12 col-md-12 col-lg-6"
      >
        <apexchart
          type="line"
          :options="chartOptionsEvolutionFunds"
          :series="seriesEvolutionFunds"
        />
      </div>
      <div
        v-if="seriesEvolutionActions[0].data.length > 0"
        class="col-12 col-sm-12 col-md-12 col-lg-6"
      >
        <apexchart
          type="line"
          :options="chartOptionsEvolutionActions"
          :series="seriesEvolutionActions"
        />
      </div>
    </div>
  </main>
</template>

<script>
import WalletService from '@/services/wallet'
import EvolutionService from '@/services/evolution'
import { useAuth } from '@/store/auth'

export default {
  data() {
    return {
      seriesGeral: [],
      chartOptionsGeral: {
        legend: {
          position: 'bottom',
          align: 'center'
        },
        title: {
          text: 'Distribuição geral',
          align: 'center'
        },
        labels: [],
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value) {
              return 'R$' + value.toFixed(2).replace('.', ',')
            }
          }
        }
      },

      seriesActions: [],
      chartOptionsActions: {
        legend: {
          position: 'bottom',
          align: 'center'
        },
        title: {
          text: 'Distribuição de ações',
          align: 'center'
        },
        labels: [],
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value) {
              return 'R$' + value.toFixed(2).replace('.', ',')
            }
          }
        }
      },

      seriesFunds: [],
      chartOptionsFunds: {
        legend: {
          position: 'bottom',
          align: 'center'
        },
        title: {
          text: 'Distribuição de fundos imobiliários',
          align: 'center'
        },
        labels: [],
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value) {
              return 'R$' + value.toFixed(2).replace('.', ',')
            }
          }
        }
      },

      seriesEvolutionFunds: [
        {
          name: 'Valor',
          data: []
        }
      ],
      chartOptionsEvolutionFunds: {
        chart: {
          height: 350,
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Evolução Fundos imobiliários',
          align: 'center'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return 'R$' + value.toFixed(2).replace('.', ',')
            }
          }
        }
      },

      seriesEvolutionActions: [
        {
          name: 'Valor',
          data: []
        }
      ],
      chartOptionsEvolutionActions: {
        chart: {
          height: 350,
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Evolução Ações',
          align: 'center'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return 'R$' + value.toFixed(2).replace('.', ',')
            }
          }
        }
      },

      userLogged: useAuth()
    }
  },
  mounted() {
    this.loadWalletDistribution()
    this.loadEvolutionOfHeritage()
  },
  methods: {
    loadWalletDistribution() {
      WalletService.show(this.userLogged.userLogged.id)
        .then((response) => {
          this.generalDistribution(response.data.all)

          this.activesDistributions(response.data.actions, 'actions')

          this.activesDistributions(response.data.real_estate_funds, 'funds')
        })
        .catch((error) => {
          console.log(error)
        })
    },

    loadEvolutionOfHeritage() {
      EvolutionService.index(this.userLogged.userLogged.id)
        .then((response) => {
          this.organizeLastSevenDays(response.data.real_estate_funds, 'real_estate_funds')
          this.organizeLastSevenDays(response.data.actions, 'actions')
        })
        .catch((error) => {
          console.log(error)
        })
    },

    generalDistribution(data) {
      let valueAction = 0
      let valueFunds = 0

      data.map((element) => {
        if (element.active.type === 'actions') {
          valueAction += parseFloat(element.cash_value)
        } else {
          valueFunds += parseFloat(element.cash_value)
        }
      })

      this.chartOptionsGeral.labels = [
        valueAction > 0 ? 'Ações' : 'Ações',
        valueFunds > 0 ? 'Fundos Imobiliários' : 'Fundos Imobiliários'
      ]

      if (valueAction == 0 && valueFunds == 0) {
        this.seriesGeral = []
        return
      }

      this.seriesGeral = [valueAction, valueFunds]
    },

    activesDistributions(data, type) {
      let nameActive = []
      let valueActive = []

      data.map((element) => {
        nameActive.push(element.active.name)
        valueActive.push(parseFloat(element.cash_value))
      })

      if (type === 'actions') {
        this.chartOptionsActions.labels = nameActive
        this.seriesActions = valueActive
      }
      {
        this.chartOptionsFunds.labels = nameActive
        this.seriesFunds = valueActive
      }
    },

    organizeLastSevenDays(data, type) {
      let date = []
      let value = []

      data.map((element) => {
        date.push(this.formatDate(element.created_at))
        value.push(element.value)
      })

      if (type === 'real_estate_funds') {
        this.chartOptionsEvolutionFunds.xaxis.categories = date
        this.seriesEvolutionFunds[0].data = value
      } else {
        this.chartOptionsEvolutionActions.xaxis.categories = date
        this.seriesEvolutionActions[0].data = value
      }
    },

    formatDate(isoString) {
      const date = new Date(isoString)
      const day = String(date.getUTCDate()).padStart(2, '0')
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const year = date.getUTCFullYear()

      return `${day}/${month}/${year}`
    }
  }
}
</script>
