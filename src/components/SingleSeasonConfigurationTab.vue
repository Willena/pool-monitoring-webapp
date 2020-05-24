<template>
    <b-tab :title="season.name">

        <b-form-group
                label-cols-sm="2"
                label="Name : "
                label-for="season-name">
            <b-input-group>
                <b-form-input id="season-name" v-model="season.name" type="text"></b-form-input>
            </b-input-group>

        </b-form-group>

        <b-form-group
                label-cols-sm="2"
                label="Month :"
                label-for="season-months">
            <b-input-group>
                <b-form-select v-model="season.months" :options="monthsAvailable" multiple
                               :select-size="4"></b-form-select>
            </b-input-group>

        </b-form-group>

        <timeline ref="timeline"
                  :items="items_table"
                  :groups="groups_table"
                  :options="options_table"></timeline>

        <b-card-footer>
            <div class="rigth">
                <b-button @click="$emit('remove-season-slot', season)" variant="outline-danger">
                    <b-icon-trash-fill></b-icon-trash-fill>
                </b-button>
            </div>
        </b-card-footer>
    </b-tab>
</template>

<script>
    import moment from 'moment'

    export default {
        name: 'SingleSeasonConfigurationTab',
        props: {
            season: Object,
            currentStatus: Object,
            monthsAvailable: Array
        },
        methods: {
            convertToTime(seconds) {
                let d = moment.duration(seconds, 'seconds')
                return (d.hours() < 10 ? '0' : '') + d.hours() + ":" + (d.minutes() < 10 ? '0' : '') + d.minutes()
            },
            findTableItemWithId(id) {
                for (let item of this.season.table) {
                    if (item.id === id)
                        return item;
                }
            },
            createItem(item) {
                item.end = new Date().setTime(item.start.getTime() + 3600 * 1000)
                item.content = ''

                let startD = moment.duration(item.start.getTime(), 'milliseconds')
                let endD = moment.duration(item.end, 'milliseconds')

                this.season.table.push(
                    {
                        id: item.id,
                        on: this.convertToTime(startD.asSeconds()),
                        off: this.convertToTime(endD.asSeconds())
                    }
                )
            },
            removeItem(item) {
                for (let i = 0; i < this.season.table.length; i++) {
                    if (item.id === this.season.table[i].id) {
                        this.season.table.splice(i, 1)
                        return
                    }
                }
            },
            updateItem(item) {
                const tabElement = this.findTableItemWithId(item.id)

                let startD = moment(item.start.getTime(), 'x')
                let endD = moment(item.end.getTime(), 'x')

                tabElement.on = (startD.hours()<10 ? '0':'') + startD.hours() + ":" +  (startD.minutes()<10 ? '0':'') + startD.minutes()
                tabElement.off = (endD.hours()<10 ? '0':'') + endD.hours() + ":" +  (endD.minutes()<10 ? '0':'') + endD.minutes()

                item.content = tabElement.on + ' - ' + tabElement.off
            }
        },
        mounted() {
            this.items_table.length = 0;

            console.log("Seasons", this.season)

            for (let item of this.season.table) {

                console.log(item)

                let splitedStart = moment.duration(item.on)
                let splitedEnd = moment.duration(item.off)
                let startDate = moment().startOf('day').hours(splitedStart.hours()).minutes(splitedStart.minutes())
                let endDate = moment().startOf('day').hours(splitedEnd.hours()).minutes(splitedEnd.minutes())

                item.id = this.items_table.length

                this.items_table.push({
                    id: this.items_table.length,
                    group: 0,
                    content: item.on + ' - ' + item.off,
                    start: startDate,
                    end: endDate
                })
            }
        },
        computed: {},
        data() {
            return {
                groups_table: [
                    {
                        id: 0,
                        content: 'Season'
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
