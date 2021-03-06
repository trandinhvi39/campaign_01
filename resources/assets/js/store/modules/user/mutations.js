import * as types from './mutation-types'
import axios from 'axios'

export default {
    [types.SET_CURRENT_PAGE_USER](state, data) {
        state.currentPageUser = data.currentPageUser
        state.listActivity = data.listActivity
    },
    [types.SET_LIST_ACTIVITY](state, listActivity) {
        let old_data = state.listActivity.data
        state.listActivity = listActivity
        state.listActivity.data = $.merge(old_data, state.listActivity.data)
    },
    [types.SET_LOADING](state, loading) {
        state.loading = loading
    },
    [types.UPDATE_CURRENT_PAGE_USER](state, data) {
        state.currentPageUser = data
    }
};
