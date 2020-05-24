<template>
    <b-card title="File Explorer" border-variant="warning">
        <b-card-text>
            <b-row>
                <b-col sm="12">
                    Here you will be able to edit and upload custom files to the ESP
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <iframe width="100%" height="700px" src="/edit"></iframe>
                </b-col>

            </b-row>
        </b-card-text>
    </b-card>
</template>

<script>
    export default {
        name: 'FileExplorerCard',
        props: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
