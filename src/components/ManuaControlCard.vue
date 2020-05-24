<template>
    <b-card bg-variant="secondary" text-variant="white">
        <b-card-title>
            Manual control
            <b-badge pill variant="danger" v-if="currentStatus.isManual">In use !</b-badge>
        </b-card-title>
        <b-card-body>
            <p>This card allows you to manually manage the pump, bypassing the timetable currently in
                place.</p>

            <b-card bg-variant="white" text-variant="dark" title="">
                <b-card-text>

                    <b-form-checkbox v-model="showAdvencedOption" name="check-button" switch>
                        Advanced options
                    </b-form-checkbox>

                    <b-collapse v-model="showAdvencedOption" id="collapse-3">

                        <b-form-group
                                class="mt-2"
                                label-cols-sm="2"
                                label="Duration :"
                                label-for="nested-country"
                        >
                            <div>
                                <b-form-spinbutton id="sb-vertical" min="0" v-model="duration_days" inline
                                ></b-form-spinbutton>
                                <span class="ml-2 mr-2">days</span>
                                <b-form-spinbutton id="sb-vertical" min="0" v-model="duration_hours" inline
                                ></b-form-spinbutton>
                                <span class="ml-2 mr-2">hours</span>
                                <b-form-spinbutton id="sb-vertical" min="0" v-model="duration_minutes" inline
                                ></b-form-spinbutton>
                                <span class="ml-2 mr-2">minutes</span>

                            </div>

                        </b-form-group>


                    </b-collapse>

                </b-card-text>
                <b-card-footer>
                    <b-button variant="dark" v-if="currentStatus.isManual"  class="mr-2" @click="reset">Reset to Auto mode</b-button>
                    <b-button variant="info" @click="setOn" class="ml-2 mr-2">Set ON <span v-if="showAdvencedOption">{{selectedDuration}}</span></b-button>
                    <b-button variant="danger" @click="setOff" class="ml-2">Set OFF <span v-if="showAdvencedOption">{{selectedDuration}}</span></b-button>
                </b-card-footer>
            </b-card>


        </b-card-body>
    </b-card>
</template>

<script>

    import moment from 'moment'
    import {ApiFactory} from "@/classes/api/ApiFactory";

    export default {
        name: 'ManualControlCard',
        props: {
            currentStatus: Object
        },
        data() {
            return {
                showAdvencedOption: false,
                duration_minutes : 0,
                duration_hours : 0,
                duration_days : 0,
            }
        },
        methods: {
            setOn(){

                let secs = this.totalDuration.asSeconds();

                if (this.showAdvencedOption && secs > 0)
                    ApiFactory.manual.setManualState( secs , true).then(() => this.$emit('update-status'))
                else
                    ApiFactory.manual.setManualStateInfinite(true).then(() => this.$emit('update-status'))
            },
            setOff(){
                let secs = this.totalDuration.asSeconds();
                if (this.showAdvencedOption && secs > 0)
                    ApiFactory.manual.setManualState( secs , false).then(() => this.$emit('update-status'))
                else
                    ApiFactory.manual.setManualStateInfinite(false).then(() => this.$emit('update-status'))
            },
            reset(){
                ApiFactory.manual.resetManualState().then(() => this.$emit('update-status'))
            }
        },
        computed : {
            selectedDuration : function () {

                let date = this.totalDuration

                return   (date.days() > 0 || date.hours() > 0 || date.minutes() > 0) ? "for "+
                    (date.days() > 0 ? date.days() + " days " :'')
                    + (date.hours() > 0 ? date.hours() + " hours " :'')
                    + (date.minutes() > 0 ? date.minutes() + " minutes ":'') : ''

            },
            totalDuration : function () {
                return  moment.duration({
                    minutes: this.duration_minutes,
                    hours: this.duration_hours,
                    days: this.duration_days,
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
