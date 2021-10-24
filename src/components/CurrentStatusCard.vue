<template>
    <b-card title="Swiming pool status" bg-variant="primary" sub-title-text-variant="white"
            text-variant="white">

        <b-card-sub-title sub-title-text-variant="white">
            <h6> {{deviceDateStr}} - Uptime : {{deviceUptimeStr}}</h6>
        </b-card-sub-title>

        <b-card-body>
            <b-card-group deck>
                <b-card bg-variant="white" text-variant="dark" title="Temperature">
                    <b-card-body class="text-center">
                        <h1>{{ temperature }}</h1>
                        <span>Ambiant: {{currentStatus.ambiantTemperature}}°C</span>
                    </b-card-body>
                </b-card>

                <b-card bg-variant="white" text-variant="dark">
                    <b-card-title>
                        Pump
                        <b-badge pill variant="success" v-if="!currentStatus.isManual">Auto</b-badge>
                        <b-badge pill variant="warning" v-if="currentStatus.isManual">Manual</b-badge>
                    </b-card-title>

                    <b-card-body class="text-center">
                        <h1 v-if="!currentStatus.isPumpActivated">OFF</h1>
                        <h1 v-if="currentStatus.isPumpActivated">ON</h1>
                        <span>{{ nextActionText }}</span>
                    </b-card-body>
                </b-card>

                <b-card bg-variant="white" text-variant="dark" title="PH level">
                    <b-card-body class="text-center">
                        <h1>{{currentStatus.phLevel}}</h1>
                        <span>Raw : {{currentStatus.phRaw}}</span>
                    </b-card-body>
                </b-card>

                <b-card :class="filterColor" text-variant="dark" title="Filter Pressure">
                    <b-card-body class="text-center">
                        <h1>{{currentStatus.filterPressure}} psi</h1>
                        <span>Raw: {{currentStatus.filterPressureVlt}} V</span>
                    </b-card-body>
                </b-card>

                <b-card bg-variant="white" text-variant="dark" title="ORP/CL-/BR-">
                    <b-card-body class="text-center">
                        <h1>{{currentStatus.OrpClBrLevel}}</h1>
                        <span>Raw: {{currentStatus.orpRaw}}</span>
                    </b-card-body>
                </b-card>

<!--                <b-card bg-variant="white" text-variant="dark" title="Water Level">-->
<!--                  <b-card-body class="text-center">-->
<!--                    <h1>{{currentStatus.waterLevel}}</h1>-->
<!--                  </b-card-body>-->
<!--                </b-card>-->
            </b-card-group>
        </b-card-body>
    </b-card>
</template>

<script>

    import moment from 'moment'

    export default {
        name: 'CurrentStatusCard',
        props: {
            currentStatus: Object
        },
        mounted: function () {

        },
        data() {
            return {}
        },
        computed: {
            filterColor: function (){
              if (this.currentStatus.filterPressure <= 8.7)
                  return ""
              if (this.currentStatus.filterPressure <= 15.95)
                  return "bg-success"
              if (this.currentStatus.filterPressure <= 20.3)
                  return "bg-warning"
              if (this.currentStatus.filterPressure > 20.3 )
                  return "bg-danger"
              return ""
            },
            temperature : function(){
                return this.currentStatus.rtlTemperature
            },
            deviceDate: function () {
                return moment(this.currentStatus.currentTimestamp, 'X');
            },
            deviceUptime: function () {
                return moment.duration(this.currentStatus.uptime, "seconds")
            },
            deviceDateStr: function () {
                return this.deviceDate.toString()
            },
            deviceUptimeStr: function () {
                let date = this.deviceUptime
                return (date.days() > 0 ? date.days() + "d " : '')
                    + (date.hours() > 0 ? date.hours() + "h " : '')
                    + (date.minutes() > 0 ? date.minutes() + "m " : '')
                    + (date.seconds() > 0 ? date.seconds() + "s " : '')
            },
            nextActionText: function () {
                if (this.currentStatus.isManual) {
                    if (this.currentStatus.isPumpActivated)
                        return "OFF " + moment().to(moment().add(this.currentStatus.remainingManualTime, 'seconds'))
                    else {
                        return "Manual ends " + moment().to(moment().add(this.currentStatus.remainingManualTime, 'seconds'))
                    }
                } else {

                    for (let slot of this.currentStatus.currentTimetable) {
                        let splitedStart = slot.on.split(':')
                        let splitedEnd = slot.off.split(':')
                        let startDate = moment().startOf('day').hours(parseInt(splitedStart[0])).minutes(parseInt(splitedStart[1]))
                        let endDate = moment().startOf('day').hours(parseInt(splitedEnd[0])).minutes(parseInt(splitedEnd[1]))

                        if (this.currentStatus.isPumpActivated && moment().isBetween(startDate, endDate)) {
                            return "OFF " + moment().to(endDate)
                        } else if (!this.currentStatus.isPumpActivated && moment().isBefore(startDate)) {
                            return "ON " + moment().to(startDate)
                        }
                    }

                    //Handle the case where time is tomorrow
                    if (this.currentStatus.currentTimetable.length > 0) {
                        let slot = this.currentStatus.currentTimetable[0]
                        let splitedStart = slot.on.split(':')
                        let startDate = moment().startOf('day').add(1, 'day').hours(parseInt(splitedStart[0])).minutes(parseInt(splitedStart[1]))
                        return "ON " + moment().to(startDate)
                    }
                }
                return ""
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
