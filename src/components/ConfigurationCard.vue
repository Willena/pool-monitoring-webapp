<template>
    <b-card title="Configuration" border-variant="dark">
        <b-row>
            <b-col sm="12">
                Select the configuration to edit:
                <b-dropdown id="dropdown-1" :text="currentFile.name" class="m-md-2">
                    <b-dropdown-item v-for="file in configFiles" :key="file.name" @click="loadClickedConfig($event)">
                        {{ file.name }}
                        <b-icon v-if="file.default" icon='star-fill'></b-icon>
                    </b-dropdown-item>
                </b-dropdown>
                <b-button variant="info" class="ml-2" @click="setCurrentConfigAsDefault">Set default</b-button>
                <b-button variant="dark" class="ml-2" @click="addTemperatureRange">
                    <b-icon-plus></b-icon-plus>
                </b-button>
                <b-button variant="success" @click="saveConfig" class="ml-2">
                    <b-icon-file-earmark-arrow-down></b-icon-file-earmark-arrow-down>
                </b-button>
                <b-button variant="outline-info" @click="downloadAsFile" class="ml-2 mr-2">
                    <b-icon-cloud-download></b-icon-cloud-download>
                </b-button>

                <b-form-file
                        class="ml-4"
                        style="width: 15rem"
                        v-model="fileToUpload"
                        placeholder="Choose a file..."
                        drop-placeholder="Drop file here..."
                ></b-form-file>
                <b-button variant="outline-info" @click="uploadFile" class="ml-2">
                    <b-icon-cloud-upload></b-icon-cloud-upload>
                </b-button>

            </b-col>
        </b-row>
        <b-row>
            <b-col sm="12">
                <b-card no-body>
                    <b-tabs v-model="tabIndex">
                        <b-tab title="Temperature configuration">
                            <b-tabs pills card vertical>
                                <SingleTemperatureConfigurationTab v-on:remove-temperature-slot="removeTemperatureSlot"
                                                                   v-for="tableElement in currentConfig.timetable"
                                                                   :key="tableElement.id"
                                                                   v-bind:current-status="currentStatus"
                                                                   v-bind:tab-data="tableElement"></SingleTemperatureConfigurationTab>
                            </b-tabs>
                        </b-tab>
                        <b-tab title="Season configuration">
                            <b-tabs pills card vertical>
                                <SingleSeasonConfigurationTab
                                        v-on:remove-season-slot="removeSeasonSlot"
                                        v-for="season in currentConfig.whitehours"
                                        :key="season.id"
                                        :months-available="availableMonths"
                                        v-bind:season="season"
                                        v-bind:current-status="currentStatus"></SingleSeasonConfigurationTab>
                            </b-tabs>
                        </b-tab>
                    </b-tabs>

                </b-card>
            </b-col>
        </b-row>

    </b-card>
</template>

<script>
    import SingleTemperatureConfigurationTab from "@/components/SingleTemperatureConfigurationTab";
    import SingleSeasonConfigurationTab from "@/components/SingleSeasonConfigurationTab";
    import uniqid from 'uniqid'
    import configAPI from "@/classes/api/configAPI";

    export default {
        name: 'ConfigurationCard',
        components: {SingleTemperatureConfigurationTab, SingleSeasonConfigurationTab},
        props: {
            currentStatus: Object
        },
        methods: {
            removeTemperatureSlot: (function () {
                    return function (slot) {
                        {
                            console.log("this", this)
                            console.log("slot", slot)

                            for (let i = 0; i < this.currentConfig.timetable.length; i++) {
                                if (slot.id === this.currentConfig.timetable[i].id) {
                                    this.currentConfig.timetable.splice(i, 1);
                                    return;
                                }
                            }
                        }
                    }
                }
            )(),
            removeSeasonSlot: (function () {
                    return function (slot) {
                        {
                            console.log("this", this)
                            console.log("slot", slot)


                        }
                    }
                }
            )(),
            setCurrentConfigAsDefault() {
                this.saveConfig()
                configAPI.setDefault(this.currentFile.name)
            },
            async loadClickedConfig(evt) {

                for (let f of this.configFiles) {
                    if (f.name === evt.target.innerText.trim()) {
                        this.currentFile = f
                        break
                    }
                }

                let content = await configAPI.getConfig(this.currentFile)
                this.currentConfig = JSON.parse(await content.json())

            },
            addTemperatureRange() {
                if (this.tabIndex === 0) {
                    this.currentConfig.timetable.push({
                        id: uniqid(),
                        splits: 0,
                        duration: 0,
                        minT: 0,
                        maxT: 0,
                        table: []
                    })
                } else if (this.tabIndex === 1) {
                    this.currentConfig.whitehours.push({
                        id: uniqid(),
                        name: "newSeason",
                        months: [],
                        table: []
                    })
                }

            },
            saveConfig() {
                configAPI.setConfig(this.currentFile.name, JSON.stringify(this.removeIdsFromConfig(this.currentConfig)))
            },
            removeIdsFromConfig(config) {
                let jsonCopy = JSON.parse(JSON.stringify(config))

                for (let e of jsonCopy.timetable) {
                    delete e.id
                }

                for (let e of jsonCopy.whitehours) {
                    delete e.id
                    for (let v of e.table) {
                        delete v.id
                    }
                }
                return jsonCopy
            },
            downloadAsFile() {
                let fileContent = JSON.stringify(this.removeIdsFromConfig(this.currentConfig))
                let fakeLink = document.createElement("a")
                fakeLink.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(fileContent))
                fakeLink.setAttribute("download", this.currentFile.name)
                fakeLink.style.display = 'none';
                document.body.appendChild(fakeLink);
                fakeLink.click()
                document.body.removeChild(fakeLink);
            },
            uploadFile() {
                configAPI.setConfig(this.fileToUpload[0].name, this.fileToUpload[0], false)
            },
            async getAvailableConfigFiles() {
                console.log("Fetching files")
                let defaultConfig = (await configAPI.getDefault()).text

                let configFiles = (await configAPI.getFileList()).json

                console.log(defaultConfig)
                console.log(configFiles)


                for (let f of configFiles) {
                    this.configFiles.push({
                        name: f.name,
                        default: defaultConfig === f.name
                    })
                }
            }

        }
        ,
        async mounted() {

            await  this.getAvailableConfigFiles()

            //Get first default file
            for (let f of this.configFiles) {
                if (f.default) {
                    this.currentFile = this.configFiles[0]
                    break
                }
            }


            //Add id ot all
            for (let e of this.currentConfig.timetable)
                e.id = uniqid()

        }
        ,
        data() {
            return {
                tabIndex: 0,
                currentFile: "",
                fileToUpload: "",
                availableMonths: [
                    {value: 1, text: "January"},
                    {value: 2, text: "February"},
                    {value: 3, text: "March"},
                    {value: 4, text: "April"},
                    {value: 5, text: "May"},
                    {value: 6, text: "June"},
                    {value: 7, text: "July"},
                    {value: 8, text: "August"},
                    {value: 9, text: "September"},
                    {value: 10, text: "October"},
                    {value: 11, text: "November"},
                    {value: 12, text: "December"}],
                configFiles: [
                    {"default": true, "name": "config.json"},
                    {"default": false, "name": "config2.json"}],

                currentConfig:
                    {
                        "timetable": [
                            {"minT": -10, "maxT": 5, "table": [{"on": "5:30", "off": "7:30"}]},
                            {
                                "minT": 5,
                                "maxT": 10,
                                "splits": 1,
                                "duration": 7200
                            }, {"minT": 10, "maxT": 12, "splits": 1, "duration": 14400}, {
                                "minT": 12,
                                "maxT": 16,
                                "splits": 2,
                                "duration": 21600
                            }, {"minT": 16, "maxT": 24, "splits": 2, "duration": 28800}, {
                                "minT": 24,
                                "maxT": 27,
                                "splits": 3,
                                "duration": 43200
                            }, {"minT": 27, "maxT": 30, "splits": 4, "duration": 72000}, {
                                "minT": 30,
                                "maxT": 50,
                                "splits": 1,
                                "duration": 86400
                            }],
                        "whitehours": [
                            {
                                "name": "summer",
                                "months": [4, 5, 6, 7, 8, 9],
                                "table": [{"on": "5:30", "off": "22:30"}]
                            },
                            {
                                "name": "winter",
                                "months": [10, 11, 12, 1, 2, 3],
                                "table": [{"on": "7:30", "off": "16:30"}]
                            }
                        ]
                    }
            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
