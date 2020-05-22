<template>
    <b-tab :title="computedTitle">

        <b-form-checkbox v-model="displayTable" name="check-button" switch>
            Use a custom table
        </b-form-checkbox>


        <b-form-group
                label-cols-sm="2"
                label="Start temperature: "
                label-for="start-temp"
        >
            <b-input-group>
                <b-form-spinbutton v-model="tabData.minT" id="start-temp" inline min="-20"
                                   max="50"></b-form-spinbutton>
            </b-input-group>

        </b-form-group>
        <b-form-group
                label-cols-sm="2"
                label="End temperature: "
                label-for="end-temp"
        >
            <b-input-group>
                <b-form-spinbutton v-model="tabData.maxT" id="end-temp" inline min="-20"
                                   max="50"></b-form-spinbutton>
            </b-input-group>

        </b-form-group>
        <b-collapse v-bind:visible="!displayTable" id="collapse-3">
            <b-form-group
                    label-cols-sm="2"
                    label="Splits: "
                    label-for="time-splits"
            >
                <b-input-group>
                    <b-form-spinbutton v-model="tabData.splits" id="time-splits" inline min="1"
                                       max="24"></b-form-spinbutton>
                </b-input-group>

            </b-form-group>
            <b-form-group
                    label-cols-sm="2"
                    label="Duration :"
                    label-for="nested-state"
            >
                <b-input-group>
                    <b-form-input id="nested-state" v-model="duration"
                                  type="text"
                                  @change="convertToSeconds"
                                  placeholder="HH:mm"></b-form-input>
                    <b-input-group-append>
                        <b-form-timepicker
                                v-model="duration"
                                button-only
                                right
                                locale="fr"
                                aria-controls="StartTimeInput"
                        ></b-form-timepicker>
                    </b-input-group-append>
                </b-input-group>

            </b-form-group>
        </b-collapse>
        <b-collapse v-bind:visible="displayTable" id="collapse-3">
            <timeline ref="timeline"
                      :items="items_table"
                      :groups="groups_table"
                      :options="options_table"></timeline>
        </b-collapse>


        <b-card-footer>
            <div class="rigth">
                <b-button @click="$emit('remove-temperature-slot', tabData)" variant="outline-danger">
                    <b-icon-trash-fill></b-icon-trash-fill>
                </b-button>
            </div>
        </b-card-footer>
    </b-tab>
</template>

<script>
    import moment from 'moment'

    export default {
        name: 'SingleTemperatureConfigurationTab',
        props: {
            tabData: Object,
            currentStatus: Object
        },
        methods: {
            convertToSeconds() {
                return this.tabData.duration = moment.duration(this.duration).asSeconds()
            },
            convertToTime(seconds) {
                let d = moment.duration(seconds, 'seconds')
                return (d.hours() < 10 ? '0' : '') + d.hours() + ":" + (d.minutes() < 10 ? '0' : '') + d.minutes()
            },
            findTableItemWithId(id) {
                for (let item of this.tabData.table) {
                    if (item.id === id)
                        return item;
                }
            },
            createItem(item) {
                item.end = new Date().setTime(item.start.getTime() + 3600 * 1000)
                item.content = ''

                let startD = moment.duration(item.start.getTime(), 'milliseconds')
                let endD = moment.duration(item.end, 'milliseconds')

                this.tabData.table.push(
                    {
                        id: item.id,
                        on: this.convertToTime(startD.asSeconds()),
                        off: this.convertToTime(endD.asSeconds())
                    }
                )
            },
            removeItem(item) {
                for (let i = 0; i < this.tabData.table.length; i++) {
                    if (item.id === this.tabData.table[i].id) {
                        this.tabData.table.splice(i, 1)
                        return
                    }
                }
            },
            updateItem(item) {
                const tabElement = this.findTableItemWithId(item.id)

                let startD = moment(item.start.getTime(), 'x')
                let endD = moment(item.end.getTime(), 'x')

                tabElement.on = startD.hours() + ":" + startD.minutes()
                tabElement.off = endD.hours() + ":" + endD.minutes()
            }
        },
        mounted() {
            // Add the background

            this.items_table.length = 0;

            for (let seasonTable of this.currentStatus.currentSeason.table) {
                let start = moment.duration(seasonTable.on)
                let end = moment.duration(seasonTable.off)
                this.items_table.push({
                    id: "T" + this.items_table.length,
                    content: "Auto range",
                    start: moment().startOf('day').hours(start.hours()).minutes(start.minutes()),
                    end: moment().startOf('day').hours(end.hours()).minutes(end.minutes()),
                    type: "background",
                })
            }

            this.duration = this.convertToTime(this.tabData.duration)

            if (this.tabData.table && this.tabData.table.length > 0) {
                this.displayTable = true;
                for (let item of this.tabData.table) {

                    let splitedStart = moment.duration(item.on)
                    let splitedEnd = moment.duration(item.off)
                    let startDate = moment().startOf('day').hours(splitedStart.hours()).minutes(splitedStart.minutes())
                    let endDate = moment().startOf('day').hours(splitedEnd.hours()).minutes(splitedEnd.minutes())

                    item.id = this.items_table.length

                    this.items_table.push({
                        id: this.items_table.length,
                        group: 0,
                        start: startDate,
                        end: endDate
                    })
                }
            }
        },
        computed: {
            computedTitle() {
                return this.tabData.minT + "° - " + this.tabData.maxT + "°"
            }
        },
        data() {
            return {
                displayTable: false,
                duration: "",
                groups_table: [
                    {
                        id: 0,
                        content: 'Auto'
                    }
                ],
                items_table: [],
                options_table: {
                    editable: true,
                    start: new Date().setHours(0, 0, 0),
                    end: new Date().setHours(24, 0, 0),
                    max: new Date().setHours(24, 0, 0),
                    min: new Date().setHours(0, 0, 0),
                    moveable: false,
                    // timeAxis: {scale: 'hour', step: 1},
                    onAdd: (function (that) {
                        return function (item, callback) {
                            that.createItem(item)
                            callback(item)
                        }
                    })(this),
                    onRemove: (function (that) {
                        return function (item, callback) {
                            that.removeItem(item)
                            callback(item);
                        }
                    })(this),
                    onMove: (function (that) {
                        return function (item, callback) {
                            that.updateItem(item)
                            callback(item)
                        }
                    })(this)
                },
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
