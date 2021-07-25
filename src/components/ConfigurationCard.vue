<template>

    <b-card title="Configuration" border-variant="dark" v-if="currentConfig !== undefined">
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
                <b-button variant="dark" class="ml-2" @click="addTemperatureRange" v-b-tooltip.hover title="Add Temperature/Season range">
                    <b-icon-plus></b-icon-plus>
                </b-button>
                <b-button variant="success" @click="saveConfig" class="ml-2" v-b-tooltip.hover title="Save config">
                    <b-icon-file-earmark-arrow-down></b-icon-file-earmark-arrow-down>
                </b-button>
                <b-button variant="outline-info" @click="downloadAsFile" class="ml-2 mr-2" v-b-tooltip.hover title="Download config as Json">
                    <b-icon-cloud-download></b-icon-cloud-download>
                </b-button>

                <b-form-file
                    class="ml-4"
                    accept="application/json"
                    style="width: 15rem"
                    v-model="fileToUpload"
                    placeholder="Choose a file..."
                    drop-placeholder="Drop file here..."
                ></b-form-file>
                <b-button variant="outline-info" @click="uploadFile" class="ml-2" v-b-tooltip.hover title="Upload config">
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
                    for (let i = 0; i < this.currentConfig.timetable.length; i++) {
                        if (slot.id === this.currentConfig.timetable[i].id) {
                            this.currentConfig.timetable.splice(i, 1);
                            return;
                        }
                    }

                }
            }
        )(),
        removeSeasonSlot: (function () {
                return function (slot) {
                    for (let i = 0; i < this.currentConfig.whitehours.length; i++) {
                        if (slot.id === this.currentConfig.whitehours[i].id) {
                            this.currentConfig.whitehours.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        )(),
        setCurrentConfigAsDefault() {
            this.saveConfig()
            configAPI.setDefault("/config/" + this.currentFile.name)
        },
        async loadClickedConfig(evt) {

            for (let f of this.configFiles) {
                if (f.name === evt.target.innerText.trim()) {
                    console.log("Found file")
                    this.currentFile = f
                    break
                }
            }

            console.log(this.currentFile)
            await this.loadConfig(this.currentFile.name)

        },
        async loadConfig(file) {
            let content = await configAPI.getConfig(file)
            this.currentConfig = content.data
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
                for (let v of e.table) {
                    delete v.id
                }
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

            console.log("Config", this.removeIdsFromConfig(this.currentConfig))
            let fakeLink = document.createElement("a")
            fakeLink.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(fileContent))
            fakeLink.setAttribute("download", this.currentFile.name)
            fakeLink.style.display = 'none';
            document.body.appendChild(fakeLink);
            fakeLink.click()
            document.body.removeChild(fakeLink);
        },
        async uploadFile() {
            console.log(this.fileToUpload)
            await configAPI.setConfig(this.fileToUpload.name, this.fileToUpload, false)
            await this.getAvailableConfigFiles()
        },
        async getAvailableConfigFiles() {
            console.log("Fetching files")
            let defaultConfig = (await configAPI.getDefault()).data
            let configFiles = (await configAPI.getFileList()).data

            this.configFiles = []

            for (let f of configFiles) {
                if (f.name === "default.txt")
                    continue

                if (defaultConfig === "/config/" + f.name) {
                    this.currentFile = f
                }

                this.configFiles.push({
                    name: f.name,
                    default: defaultConfig === "/config/" + f.name
                })
            }
        }

    }
    ,
    async mounted() {

        await this.getAvailableConfigFiles()
        await this.loadConfig(this.currentFile.name)

        //Add id ot all
        for (let e of this.currentConfig.timetable)
            e.id = uniqid()

        for (let w of this.currentConfig.whitehours)
            w.id = uniqid()

    },
    data() {
        return {
            tabIndex: 0,
            currentFile: "",
            fileToUpload: undefined,
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
            configFiles: [],
            currentConfig: undefined
        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
