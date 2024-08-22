<template>
  <main class="container-fluid px-4 mt-5">
    <h1>Histórico de transações</h1>

    <div class="d-flex mb-4">
      <label for="category" class="d-flex flex-column me-3"
        >Categoria
        <select id="category" name="select" v-model="categorySelected">
          <option value="all" selected>Geral</option>
          <option value="actions" selected>Ações</option>
          <option value="real_estate_funds">Fundos imobiliários</option>
        </select>
      </label>
      <label for="ticker" class="d-flex flex-column">
        Ticker
        <input id="ticker" type="text" placeholder="Ex: PETR3" v-model="ticker" />
      </label>
    </div>

    <template v-if="transactions.length > 0">
      <div class="d-flex flex-wrap">
        <div class="col-2">
          <b>Nome</b>
        </div>
        <div class="col-2">
          <b>Ticker</b>
        </div>
        <div class="col-2">
          <b>Tipo</b>
        </div>
        <div class="col-2">
          <b>Preço</b>
        </div>
        <div class="col-2">
          <b>Qtd/Cotas</b>
        </div>
        <div class="col-2">
          <b>Data e Hora</b>
        </div>
      </div>

      <div
        v-for="(transaction, index) in transactions"
        :key="index"
        class="d-flex flex-wrap line-info"
      >
        <div class="col-2">
          <span class="ms-1">{{ transaction.active.name }}</span>
        </div>
        <div class="col-2">
          <span>{{ transaction.active.ticker }}</span>
        </div>
        <div class="col-2">
          <span class="type-transaction" :class="`${transaction.transaction_type}`">{{
            translateTransactionType(transaction.transaction_type)
          }}</span>
        </div>
        <div class="col-2">
          <span>{{ formatPrice(transaction.active.price) }}</span>
        </div>
        <div class="col-2">
          <span>{{ transaction.amount }}</span>
        </div>
        <div class="col-2">
          <span>{{ formatDateTime(transaction.created_at) }}</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="text-center">
        <span>Não possui nenhuma transação efetuada.</span>
      </div>
    </template>
  </main>
</template>

<script>
import TransactionService from '@/services/transaction'
import { useAuth } from '@/store/auth'

export default {
  data() {
    return {
      transactions: [],
      categorySelected: 'all',
      ticker: '',
      userLogged: useAuth()
    }
  },
  watch: {
    categorySelected(value) {
      if (value == 'all') {
        this.loadTransactions()
      } else {
        this.getTransactionsByFilter('category', value)
      }
    },

    ticker(value) {
      if (value.length > 2) {
        this.getTransactionsByFilter('ticker', value)
      }
    }
  },
  mounted() {
    this.loadTransactions()
  },
  methods: {
    loadTransactions() {
      TransactionService.index(this.userLogged.userLogged.id)
        .then((response) => {
          this.transactions = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    formatDateTime(dateTimeString) {
      const date = new Date(dateTimeString)

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`
    },

    formatPrice(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    },

    translateTransactionType(type) {
      switch (type) {
        case 'buy':
          return 'Compra'
        case 'sale':
          return 'Venda'
      }
    },

    getTransactionsByFilter(type, value) {
      TransactionService.getByFilter(this.userLogged.userLogged.id, type, value)
        .then((response) => {
          this.transactions = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.line-info {
  box-shadow: 0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2);
  border-radius: 8px;
  margin-bottom: 4px;

  span {
    font-size: 12px;
  }
}

input {
  background-color: #dbdbdb;
  color: #000000;
  font-size: 16px;
  padding-left: 10px;
  border-radius: 10px;
  border: none;
  height: 28px;
  width: 275px;

  &:focus {
    outline: none;
  }
}

.type-transaction {
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px !important;
}

.sale {
  background-color: rgb(255, 183, 183);
}

.buy {
  background-color: rgb(183, 255, 183);
}
</style>
