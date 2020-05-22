<template>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <a class="navbar-brand" href="#">Swimming pool</a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                    aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#home">Summary</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#manual">Manual control</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#timetable">Timetable</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#config">Configuration</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#update">Update</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/edit/">File explorer</a>
                    </li>

                </ul>
            </div>
        </nav>
        <b-container>
            <!--  Status -->
            <b-row class="mb-3 mt-3">
                <b-col sm="12">
                    <CurrentStatusCard v-bind:current-status="currentStatus"></CurrentStatusCard>
                </b-col>
            </b-row>
            <!--  Manual -->
            <b-row class="mb-3 mt-3">
                <b-col sm="12">
                    <ManualControlCard v-bind:current-status="currentStatus"></ManualControlCard>
                </b-col>
            </b-row>
            <!-- TImeline -->
            <b-row class="mb-3 mt-3">
                <b-col sm="12">
                    <TimetableCard v-bind:current-status="currentStatus"></TimetableCard>
                </b-col>
            </b-row>
            <!--  Configuration -->
            <b-row class="mb-3 mt-3">
                <b-col sm="12">
                    <ConfigurationCard v-bind:current-status="currentStatus"></ConfigurationCard>
                </b-col>
            </b-row>
            <!--  Update -->
            <b-row class="mb-3 mt-3">
                <b-col sm="12">
                    <MaintainanceCard></MaintainanceCard>
                </b-col>
            </b-row>
            <!--  File explorer -->
            <b-row class="mb-3 mt-3">
                <b-col sm="12">
                    <FileExplorerCard></FileExplorerCard>
                </b-col>
            </b-row>
        </b-container>

        <b-modal id="modal_id" ref="modal_url" title="Define the pool to monitor" hide-footer :no-close-on-esc="true" :visible="modal_visible" :no-close-on-backdrop="true">
            <p class="my-4">
                <b-form-group
                        label-cols-sm="2"
                        label="Pool URL:"
                        label-for="url-pool"
                >
                    <div>
                        <b-form-input type="text" id="url-pool" v-model="pool_url"></b-form-input>
                    </div>

                </b-form-group>
                <b-button variant="success" :href="'?url='+pool_url">Go !</b-button>
            </p>
        </b-modal>

    </div>

</template>

<script>

    import CurrentStatusCard from "@/components/CurrentStatusCard";
    import ManualControlCard from "@/components/ManuaControlCard";
    import TimetableCard from "@/components/TimetableCard";
    import ConfigurationCard from "@/components/ConfigurationCard";
    import MaintainanceCard from "@/components/MaintainanceCard";
    import FileExplorerCard from "@/components/FileExplorerCard";
    import {ApiFactory} from "@/classes/api/ApiFactory";
    import ApiBase from "@/classes/api/ApiBase";

    export default {
        name: 'App',
        components: {
            FileExplorerCard,
            MaintainanceCard, ConfigurationCard, TimetableCard, ManualControlCard, CurrentStatusCard
        },
        methods: {
            async collectStatus() {
                const {json} = await ApiFactory.status.get()
                this.currentStatus = json;
            }
        },
        mounted: function () {
            console.log(ApiBase.defaults.baseURL)
            if (ApiBase.defaults.baseURL === "http://example.com/") {
                this.modal_visible = true;
            }
        },
        created() {
            setInterval(this.collectStatus.bind(this), 30000)
            this.collectStatus();
        },
        data() {
            return {
                pool_url : "",
                modal_visible : false,
                currentStatus: {
                    "isManual": true,
                    "remainingManualTime": 4000,
                    "currentTimestamp": 1590066161,
                    "temperature": 23.125,
                    "isPumpActivated": true,
                    "phLevel": 0,
                    "OrpClBrLevel": 0,
                    "version": "May 21 2020",
                    "uptime": 948,
                    "currentTimetable": [
                        {
                            "on": "7:45",
                            "off": "11:45"
                        },
                        {
                            "on": "16:15",
                            "off": "20:15"
                        }
                    ],
                    "currentSeason": {
                        "name": "summer",
                        "months": [4, 5, 6, 7, 8, 9],
                        "table": [
                            {"on": "7:30", "off": "21:30"}
                        ]
                    }
                },


            }
        },
    }
</script>

<style>
    .container {
        margin-top: 5rem;
    }
</style>
