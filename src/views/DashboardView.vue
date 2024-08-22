<template>
  <main class="container px-4 mt-5">
    <h2 class="text-center mb-2">Dashboard</h2>

    <div class="d-flex flex-wrap justify-content-center gap-3">
      <div class="d-flex flex-column align-items-center card-active mb-3">
        <span class="card-title">Ações</span>
        <span>{{
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(actives.cashValueAction)
        }}</span>
      </div>
      <div class="d-flex flex-column align-items-center card-active mb-3">
        <span class="card-title">Nº cotas em ações</span>
        <span>{{ actives.amountAction }}</span>
      </div>
      <div class="d-flex flex-column align-items-center card-active mb-3">
        <span class="card-title">Fundos imobiliários</span>
        <span>{{
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(actives.cashValueFunds)
        }}</span>
      </div>
      <div class="d-flex flex-column align-items-center card-active mb-3">
        <span class="card-title">Nº cotas em Fundos imobiliários</span>
        <span>{{ actives.amountFunds }}</span>
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <div
        v-if="chartOptions.xaxis.categories.length > 0"
        class="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-9 mt-3"
      >
        <apexchart type="area" :options="chartOptions" :series="series" />
      </div>
    </div>
  </main>
</template>

<script>
import EvolutionService from '@/services/evolution'
import WalletService from '@/services/wallet'
import { useAuth } from '@/store/auth'

export default {
  data() {
    return {
      userLogged: useAuth(),
      actives: {
        cashValueAction: 0,
        amountAction: 0,
        cashValueFunds: 0,
        amountFunds: 0
      },

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
    this.loadWallet()
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
    },

    loadWallet() {
      WalletService.index(this.userLogged.userLogged.id)
        .then((response) => {
          response.data.map((element) => {
            if (element.active.type === 'real_estate_funds') {
              this.actives.amountFunds += element.amount
              this.actives.cashValueFunds += parseFloat(element.cash_value)
            } else {
              this.actives.amountAction += element.amount
              this.actives.cashValueAction += parseFloat(element.cash_value)
            }
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-active {
  width: 226px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .card-title {
    font-size: 12px;
  }

  span {
    font-weight: 600;
    font-size: 20px;
  }
}
</style>
