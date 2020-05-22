<template>
    <b-card title="Time table" border-variant="info">
        <b-card-text>
            <p>This card shows the current timeline for manual and auto mode. It displays only moments
                when the pump will be ON</p>
            <div>
                <timeline ref="timeline"
                          :items="items"
                          :groups="groups"
                          :options="options">
                </timeline>
            </div>
        </b-card-text>
    </b-card>
</template>

<script>
    import moment from "moment";

    export default {
        name: 'TimetableCard',
        props: {
            currentStatus: Object
        },
        methods: {
            updateItems() {
                this.items.length = 0

                for (let seasonTable of this.currentStatus.currentSeason.table) {
                    let start = moment.duration(seasonTable.on)
                    let end = moment.duration(seasonTable.off)
                    this.items.push({
                        id: "T" + this.items.length,
                        content: "Auto range",
                        start: moment().startOf('day').hours(start.hours()).minutes(start.minutes()),
                        end: moment().startOf('day').hours(end.hours()).minutes(end.minutes()),
                        type: "background",
                    })
                }

                for (let slot of this.currentStatus.currentTimetable) {
                    let splitedStart = slot.on.split(':')
                    let splitedEnd = slot.off.split(':')
                    let startDate = moment().startOf('day').hours(parseInt(splitedStart[0])).minutes(parseInt(splitedStart[1]))
                    let endDate = moment().startOf('day').hours(parseInt(splitedEnd[0])).minutes(parseInt(splitedEnd[1]))

                    this.items.push({
                        id: this.items.length,
                        group: 0,
                        start: startDate,
                        end: endDate
                    })
                }

                if (this.currentStatus.isManual && this.currentStatus.isPumpActivated) {
                    let startDate = moment()
                    let endDate = moment().add(this.currentStatus.remainingManualTime, 'seconds')

                    this.items.push({
                        id: this.items.length,
                        group: 1,
                        start: startDate,
                        end: endDate
                    })
                }
            }
        },
        mounted() {

            // update itemes
            this.updateItems();
        },
        data() {
            return {
                groups: [
                    {
                        id: 0,
                        content: 'Auto'
                    },
                    {
                        id: 1,
                        content: 'Manual'
                    }
                ],
                items: [],
                options: {
                    editable: false,
                    start: new Date().setHours(0, 0, 0),
                    end: new Date().setHours(24, 0, 0),
                    max: new Date().setHours(24, 0, 0),
                    min: new Date().setHours(0, 0, 0),
                    moveable: false,
                    // timeAxis: {scale: 'hour', step: 1},
                },
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
