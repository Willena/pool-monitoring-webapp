<template>
    <b-card title="Maintainance" border-variant="danger">
        <b-card-text>
            <p>Use this card to send update over the air.</p>


            <b-form inline>
                <b-form-group
                        label-cols-sm="2"
                        label="Firmware :"
                        label-for="file-firmware">
                    <b-input-group>
                        <b-form-file v-model="fileFirmware" style="width: 40rem" id="file-firmware"
                                     ref="file-input-firmware"
                                     class="mb-2 mt-2"></b-form-file>

                    </b-input-group>

                </b-form-group>

                <b-button variant="warning" ref="btn-firm" class="ml-2" @click="firmwareUpdate">
                    <b-icon-box-arrow-in-right></b-icon-box-arrow-in-right>
                    Update Firmware !
                </b-button>
            </b-form>

            <b-form inline>

                <b-form-group
                        label-cols-sm="2"
                        label="File system :"
                        label-for="file-s">
                    <b-input-group>
                        <b-form-file v-model="fileFilesystem" style="width: 40rem" id="file-firmware"
                                     ref="file-input-fs"
                                     class="mb-2 mt-2"></b-form-file>

                    </b-input-group>

                </b-form-group>

                <b-button variant="warning" ref="btn-fs" @click="fsUpdate" class="ml-2">
                    <b-icon-box-arrow-in-right></b-icon-box-arrow-in-right>
                    Update filsystem!
                </b-button>
            </b-form>

            <b-button variant="danger" @click="reboot" class="mt-3 ml-2">
                <b-icon-bootstrap-reboot></b-icon-bootstrap-reboot>
                Reboot ESP
            </b-button>

        </b-card-text>
    </b-card>


</template>

<script>
    import updateAPI from "@/classes/api/updateAPI";
    import rebootAPI from "@/classes/api/rebootAPI";

    export default {
        name: 'MaintainanceCard',
        props: {},
        methods: {
            fsUpdate: function () {
                console.log(this)
                this.$refs['btn-fs'].disabled = true;
                this.$refs['btn-firm'].disabled = true
                updateAPI.postUpdate(this.$ref['file-input-firmware'].files, 'firmware')
            },
            firmwareUpdate() {
                console.log(this)

                this.$refs['btn-fs'].disabled = true
                this.$refs['btn-firm'].disabled = true
                updateAPI.postUpdate(this.$ref['file-input-fs'].files, 'filesystem')
            },
            reboot(){
                rebootAPI.reboot();
            }
        },
        data() {
            return {
                fileFirmware: null,
                fileFilesystem: null
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
