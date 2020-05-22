import { createStore, action } from 'easy-peasy'

export default createStore({
  form: {
    name: 'customer',
    changeForm: action((state, payload) => {
      state.name = payload
    })
  },
  modal: {
    show: true,
    toggle: action((state, payload) => {
      state.show = !state.show
    })
  }
})
