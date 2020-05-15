import { createStore, action } from 'easy-peasy'

export default createStore({
  form: 'customer',
  changeForm: action((state, payload) => {
    state.form = payload
  })
})
