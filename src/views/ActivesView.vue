<template>
  <main class="container-fluid px-4 mt-5">
    <div v-if="messageAlert.length > 0" class="d-flex align-items-center justify-content-center">
      <div style="position: fixed; top: 20px" class="alert alert-success mt-5" role="alert">
        {{ messageAlert }}
      </div>
    </div>
    <h2>Ações e Fundos imobiliários</h2>

    <div class="d-flex align-items-center mb-5">
      <div>
        <input
          type="text"
          placeholder="Digite o Nome ou Ticker do ativo"
          v-model="activeFilter"
          @input="validator = null"
        />
        <div v-if="validator === false" class="invalid-field ps-2">
          <span>Informe um nome ou ticker válido</span>
        </div>
      </div>
      <button class="ms-3 search-button" title="Buscar ativo" @click="searchActive">
        <i class="ri-search-line"></i>
      </button>
    </div>

    <template v-if="actives.length > 0">
      <div class="d-flex flex-wrap">
        <div class="col-3">
          <b>Nome</b>
        </div>
        <div class="col-2">
          <b>Ticker</b>
        </div>
        <div class="col-2">
          <b>Preço</b>
        </div>
        <div class="col-2">
          <b>Categoria</b>
        </div>
        <div class="d-flex justify-content-end col-3"></div>
      </div>

      <div
        v-for="(active, index) in actives"
        :key="index"
        class="d-flex flex-wrap align-items-center line-info mb-2 px-1"
      >
        <div class="col-3">
          <span>{{ active.name }}</span>
        </div>
        <div class="col-2">
          <span>{{ active.ticker }}</span>
        </div>
        <div class="col-2">
          <span>{{ formatPrice(active.price) }}</span>
        </div>
        <div class="col-2">
          <span>{{ translateType(active.type) }}</span>
        </div>
        <div class="d-flex justify-content-end col-3">
          <button
            v-if="transactionIds.includes(active.id)"
            class="btn-sell me-2"
            data-bs-toggle="modal"
            data-bs-target="#sellAssetModal"
            @click="makeTransaction(active, 'Venda', 'sale')"
          >
            <span>Vender</span>
          </button>
          <button
            class="btn-pay"
            data-bs-toggle="modal"
            data-bs-target="#buyAssetModal"
            @click="makeTransaction(active, 'Compra', 'buy')"
          >
            <span>Comprar</span>
          </button>
        </div>
      </div>

      <nav aria-label="Page navigation" class="d-flex justify-content-center mt-5">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: !prevPageUrl }">
            <a class="page-link" href="#" @click.prevent="loadActives(prevPageUrl)"
              ><span aria-hidden="true">&laquo;</span></a
            >
          </li>

          <li class="page-item" v-if="currentPage > 2">
            <a class="page-link" href="#" @click.prevent="loadActives('/actives?page=1')">1</a>
          </li>
          <li class="page-item" v-if="currentPage > 3">
            <span class="page-link">...</span>
          </li>

          <li
            class="page-item"
            v-for="page in pages"
            :key="page"
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="loadActives('/actives?page=' + page)">{{
              page
            }}</a>
          </li>

          <li class="page-item" v-if="currentPage < lastPage - 2">
            <span class="page-link">...</span>
          </li>
          <li class="page-item" v-if="currentPage < lastPage - 1">
            <a
              class="page-link"
              href="#"
              @click.prevent="loadActives('/actives?page=' + lastPage)"
              >{{ lastPage }}</a
            >
          </li>

          <li class="page-item" :class="{ disabled: !nextPage }">
            <a class="page-link" href="#" @click.prevent="loadActives(nextPage)"
              ><span aria-hidden="true">&raquo;</span></a
            >
          </li>
        </ul>
      </nav>
    </template>
    <template v-else>
      <div class="text-center">
        <span>Ativo não encontrado.</span>
      </div>
    </template>
  </main>

  <ModalConfirmTransaction :active="actionSelected" @transactionCreated="transactionCreated" />
  <ModalConfirmSellTransaction :active="actionSelected" @transactionCreated="transactionCreated" />
</template>

<script>
import ActiveService from '@/services/active'
import WalletService from '@/services/wallet'
import ModalConfirmTransaction from '@/components/ModalConfirmTransaction.vue'
import ModalConfirmSellTransaction from '@/components/ModalConfirmSellTransaction.vue'
import { useAuth } from '@/store/auth'

export default {
  components: {
    ModalConfirmTransaction,
    ModalConfirmSellTransaction
  },

  data() {
    return {
      actives: [],
      validator: null,
      actionSelected: null,
      activeFilter: '',
      transactions: [],
      transactionIds: [],
      userLogged: useAuth(),
      messageAlert: '',

      currentPage: null,
      totalRows: null,
      perPage: null,
      lastPage: null,
      nextPage: null,
      prevPageUrl: null
    }
  },
  computed: {
    pages() {
      let pages = []
      let start = Math.max(1, this.currentPage - 2)
      let end = Math.min(this.lastPage, this.currentPage + 2)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  watch: {
    activeFilter(value) {
      if (value.length == 0) {
        this.loadActives('/actives?page=1')
      }
    }
  },
  mounted() {
    this.loadTransactions()
    this.loadActives('/actives')
  },
  methods: {
    loadActives(page) {
      ActiveService.paginate(page)
        .then((response) => {
          this.actives = response.data.data

          // Configuração da paginação
          this.currentPage = response.data.current_page
          this.perPage = response.data.per_page
          this.totalRows = response.data.total
          this.lastPage = response.data.last_page
          this.nextPage = response.data.next_page_url
          this.prevPageUrl = response.data.prev_page_url
        })
        .catch((error) => {
          console.log(error)
        })
    },

    async loadTransactions() {
      await WalletService.index(this.userLogged.userLogged.id)
        .then((response) => {
          this.transactions = response.data
          this.transactionIds = response.data.map((obj) => obj.active_id)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    formatPrice(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    },

    translateType(type) {
      switch (type) {
        case 'real_estate_funds':
          return 'Fundos imobiliários'
        case 'actions':
          return 'Ações'
      }
    },

    searchActive() {
      if (this.activeFilter == '') {
        this.validator = false
        return
      }

      ActiveService.getActiveByNameOrTicker(this.activeFilter)
        .then((response) => {
          this.actives = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    makeTransaction(active, title, type) {
      let data = active
      data.transaction_type = type
      data.title = title + ' ' + active.name
      data.user_id = this.userLogged.userLogged.id

      if (type === 'sale') {
        let availableQuantity = this.transactions.find((obj) => obj.active_id === data.id)

        data.available_quantity = availableQuantity.amount
      }

      this.actionSelected = data
    },

    transactionCreated(payload) {
      this.transactions = payload.data
      this.transactionIds = payload.data.map((obj) => obj.active_id)

      this.messageAlert = 'Transação realizada com sucesso!'

      setTimeout(() => {
        this.messageAlert = ''
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  background-color: #dbdbdb;
  color: #000000;
  font-size: 16px;
  padding-left: 10px;
  border-radius: 10px;
  border: none;
  height: 28px;
  width: 265px;

  &:focus {
    outline: none;
  }
}

.search-button {
  text-decoration: none;
  border-radius: 8px;
  padding: 14px 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);

  i {
    color: #000;
  }
}

button {
  border: none;
  border-radius: 8px;
  padding: 0px 4px;
  display: flex;
  align-items: center;
  height: 20px;
}

.line-info {
  box-shadow: 0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2);
  border-radius: 8px;
  margin-bottom: 4px;

  span {
    font-size: 12px;
  }

  .btn-sell {
    background: rgb(255, 183, 183);

    span {
      line-height: 1;
      font-size: 10px;
    }
  }

  .btn-pay {
    background: rgb(183, 255, 183);

    span {
      line-height: 1;
      font-size: 10px;
    }
  }
}

.page-link {
  color: black;

  &:active {
    background-color: rgb(255, 148, 148) !important;
  }
}

.active > .page-link {
  background-color: #ff859b;
  border-color: #ff859b;
}

.page-link {
  &:focus {
    outline: none;
  }
}

.page-link:focus,
.page-link:hover {
  color: initial;
  box-shadow: none;
  outline: none;
}

.invalid-field {
  color: red;
  font-size: 12px;
}
</style>
