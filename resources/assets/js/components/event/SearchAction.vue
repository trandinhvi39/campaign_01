<template>
    <div class="container">
        <div class="row">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="ui-block">
                    <div class="ui-block-title search_action">
                        <div class="row">
                            <input
                                v-if="$route.name == 'event.index'"
                                v-model="key_search"
                                @input="search"
                                class="form-control input-search-action"
                                :placeholder="$t('events.search_action')"
                                type="text">
                            <router-link
                                v-else
                                :to="{ name: 'event.index' }"
                                class="btn btn-primary btn-md-2"
                                data-toggle="modal"
                                data-target="#update-header-photo">
                                {{ $t('events.donation.actions') }}
                            </router-link>
                        </div>
                        <div class="align-right">
                            <button
                                href="#"
                                class="btn btn-primary btn-md-2 bg-breez"
                                data-toggle="modal"
                                data-target="#update-header-photo"
                                @click="createAction">
                                {{ $t('events.create_action') }}
                            </button>
                            <div class="btn-group" v-show="event.complete_percent.length">
                                <button
                                    href="#"
                                    class="btn btn-primary btn-md-2 bg-breez"
                                    data-toggle="modal"
                                    @click="showModal = true"
                                    data-target="#update-header-photo">
                                    {{ $t('events.donation.donate') }}
                                </button>
                                <router-link
                                    tag="button"
                                    class="btn btn-primary btn-md-2 bg-breez"
                                    :to="{ name: 'event.donation' }"
                                    active-class="active"
                                    data-toggle="modal"
                                    data-target="#update-header-photo">
                                    {{ $t('events.donation.donation_details') }}
                                </router-link>
                            </div>
                            <div class="btn-group">
                                <router-link
                                    tag="button"
                                    class="btn btn-primary btn-md-2 bg-breez"
                                    :to="{ name: 'expense.list' }"
                                    active-class="active"
                                    data-toggle="modal"
                                    data-target="#update-header-photo">
                                    {{ $t('events.expenses.expense') }}
                                </router-link>
                            </div>
                            <div class="more">
                                <svg class="olymp-three-dots-icon"><use xlink:href="/frontend/icons/icons.svg#olymp-three-dots-icon"></use></svg>
                                <ul class="more-dropdown">
                                    <li>
                                        <a href="#">Edit Post</a>
                                    </li>
                                    <li>
                                        <a href="#">Delete Post</a>
                                    </li>
                                    <li>
                                        <a href="#">Turn Off Notifications</a>
                                    </li>
                                    <li>
                                        <a href="#">Select as Featured</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <create-action :show.sync="show">
        </create-action>
        <modal :show.sync="showModal">
            <template slot="header">
                {{ $t('events.donation.title') }}
            </template>
            <div class="ui-block-content">
                <template v-for="(goal, i) in event.complete_percent">

                    <span>{{ $t('events.donation.receive') }} {{ donateInfo[i] }}/{{ goal.goal }} {{ goal.donation_type.quality.name }} {{ goal.donation_type.name }}</span>
                    <div class="progress">
                        <div
                            class="progress-bar progress-bar-striped active bg-primary"
                            role="progressbar"
                            :style="{ width: (donateInfo[i]/goal.goal > 1 ? goal.goal/donateInfo[i] : donateInfo[i]/goal.goal) * 100 + '%'}"
                            :aria-valuenow="donateInfo[i]/goal.goal*100"
                            aria-valuemin="0"
                            :aria-valuemax="donateInfo[i]/goal.goal*100 > 100 ? Math.round(donateInfo[i]/goal.goal*100) : 100">
                            {{  donateInfo[i]/goal.goal > 1 ? 100 : Math.round(donateInfo[i]/goal.goal*100) }}%
                        </div>
                        <div
                            class="progress-bar progress-bar-striped bg-success active"
                            role="progressbar"
                            :style="{ width: 100 * (1 - goal.goal/donateInfo[i]) + '%' }"
                            v-show="donateInfo[i]/goal.goal > 1">
                            {{ Math.round(donateInfo[i]/goal.goal*100)- 100 }}% over
                        </div>
                    </div>
                </template>
                <div class="form-group label-floating is-select">
                    <label class="control-label">{{ $t('events.donation.select_type') }}</label>
                    <select class="selectpicker form-control dropup" multiple v-model="goal_id" ref="select" data-dropup-auto="false">
                        <option v-for="goal in event.complete_percent" :value="goal.id">{{ goal.donation_type.name }}</option>
                    </select>
                </div>
                <div class="form-group label-floating" :class="{ 'has-danger': errors.has('donate-' + index) }" v-for="(goal, index) in goal_id">
                    <label class="control-label">
                        {{ $t('events.donation.how_much') }} ({{ selectDonate(goal).quality.name }} {{ selectDonate(goal).name }})
                    </label>
                    <input
                        class="form-control"
                        type="text"
                        :name="'donate-' + index"
                        v-model="donate[index]"
                        v-validate="'required|numeric|min_value:1'"
                        data-vv-delay="100"
                        value="">
                    <span v-show="errors.has('donate-' + index)" class="material-input text-danger clearfix">
                        {{ errors.first('donate-' + index) }}
                    </span>
                </div>
            </div>
            <div class="modal-footer" slot="footer">
                <button
                    type="button"
                    class="btn btn-secondary btn-lg btn--half-width"
                    @click.prevent="showModal = false">
                    {{ $t('actions.cancel') }}
                </button>
                <button
                    type="button"
                    class="btn btn-primary btn-lg half-width"
                    @click.prevent="handleDonate"
                    :disabled="!!!goal_id.length" >
                    {{ $t('events.donation.donate') }}
                </button>
            </div>
        </modal>
        <message :show.sync="showMessage">
            <h2 class="exclamation-header" slot="header">
                <span class="fa fa-check-circle"></span>&nbsp;{{ $t('events.donation.thank_title') }}
            </h2>
            <div class="body-modal" slot="main">
                <p>{{ $t('events.donation.thank_message') }}</p>
                <ul>
                    <li v-for="(goal, index) in goal_id">
                        <p>{{ donate[index] }} {{ selectDonate(goal).quality.name }} {{ selectDonate(goal).name }}</p>
                    </li>
                </ul>
            </div>
        </message>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import CreateAction from './CreateAction.vue'
    import Modal from '../libs/SelectImageModal.vue'
    import Message from '../libs/Modal.vue'

    export default {
        data: () => {
            return {
                key_search: '',
                show: false,
                showModal: false,
                showMessage: false,
                goal_id: [],
                donate: [],
            }
        },
        computed: {
            ...mapState('event', ['event']),
            donateInfo() {
                let donated = []
                this.event.complete_percent.forEach((value, index) => {
                    donated[index] = value.donations.filter(donation => donation.status == 1).reduce((sum, value) => sum + value.value, 0)
                })
                return donated
            },
        },
        methods: {
            ...mapActions('event', [
                'search_action',
                'update_donate',
            ]),

            search: _.debounce(function () {
                if (this.key_search) {
                    this.search_action({ event_id: this.$route.params.event_id, key_search: this.key_search.replace(/ +/g, ' ') })
                } else {
                    this.search_action({ event_id: this.$route.params.event_id, key_search: this.key_search })
                }
            }, 1000),

            createAction() {
                this.show = true
            },

            handleDonate() {
                this.$validator.validateAll().then((result) => {
                    this.update_donate({
                        event_id: this.$route.params.event_id,
                        goal_id: this.goal_id,
                        value: this.donate
                    })
                        .then(res => {
                            this.showModal = false
                            this.showMessage = true
                        })
                })
            },

            selectDonate(goal_id) {
                return this.event.complete_percent.filter(obj => obj.id == goal_id)[0].donation_type
            }
        },
        watch: {
            showMessage(show) {
                if (!show) {
                    $(this.$refs.select).selectpicker('deselectAll')
                    this.donate = []
                    this.goal_id = []
                }
            }
        },
        mounted() {
            $(this.$refs.select).selectpicker('show')
        },
        components: {
            Modal,
            Message,
            CreateAction
        }
    }
</script>

<style lang="scss" scoped>
    .search_action {
        padding: 7px !important;
        .input-search-action {
            height: 42px !important;
            width: 50%;
            display: inline-block !important;
            float: left;
            padding: .8rem 2.1rem !important;
            margin-top: 2px !important;
        }
        .more {
            display: inline;
        }
    }
    .progress {
        margin-bottom: 15px !important;
    }
    .btn-group {
        .bg-breez {
            border-color: #5bc0de;
        }
    }
</style>
