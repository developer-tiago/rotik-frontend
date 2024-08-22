<template>
  <div
    class="modal fade"
    id="buyAssetModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 v-if="active" class="modal-title fs-5" id="exampleModalLabel">
            {{ active.title }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div v-if="active" class="modal-body d-flex align-items-center justify-content-between">
          <label for="amount-actives" class="d-flex flex-column">
            Quantidade de ativos
            <input
              id="amount-actives"
              type="number"
              v-model="amount"
              min="1"
              max="50"
              @input="validator.amount = null"
            />
            <div v-if="validator.amount === false" class="invalid-field">
              {{ messageError }}
            </div>
          </label>
          <div class="d-flex flex-column value-contributed">
            <b>Valor aportado</b>
            <span>{{ formatPrice(amount * active.price) }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-confirm" @click="confirmPurchase">
            Comprar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TransactionService from '@/services/transaction'

export default {
  props: {
    active: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      amount: 1,
      validator: {
        amount: null
      },
      messageError: ''
    }
  },

  methods: {
    confirmPurchase() {
      if (this.checkField()) {
        this.validator.amount = false
        return
      }

      TransactionService.makeTransaction({
        active_id: this.active.id,
        user_id: this.active.user_id,
        transaction_type: this.active.transaction_type,
        amount: this.amount,
        price: this.active.price
      })
        .then((response) => {
          const modalElement = document.getElementById('buyAssetModal')
          // eslint-disable-next-line no-undef
          const modal = bootstrap.Modal.getInstance(modalElement)
          this.amount = 1
          if (modal) {
            modal.hide()
          }

          this.$emit('transactionCreated', response)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    checkField() {
      const regex = /^\d+$/
      const onlyNumber = regex.test(this.amount)

      if (!onlyNumber) {
        this.messageError = 'Valor inválido'
        return true
      }

      return false
    },

    formatPrice(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.value-contributed {
  background-color: rgb(206, 253, 208);
  padding: 8px 16px;
  border-radius: 10px;
}

.btn-confirm {
  background-color: #77abf7;
}

.invalid-field {
  color: red;
  font-size: 12px;
}
</style>
