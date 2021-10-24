import {Server} from 'miragejs'

export function makeServer({environment = "development"} = {}) {

    let files = [
        {
            "type": "file",
            "size": "594", "name": "config.json"
        },
        {
            "type": "file",
            "size": "19",
            "name": "default.txt"
        }];

    let server = new Server({
        environment,

        routes() {
            this.get("/api/status", () => {
                return {
                    "isManual": false,
                    "remainingManualTime": 0,
                    "currentTimestamp": 1590326945,
                    "lastTableUpdate": 1590326939,
                    "temperature": 25.6875,
                    "rtlTemperature": 25.6875,
                    "isPumpActivated": true,
                    "filterPressure": 18,
                    "filterPressureVlt": 0.3,
                    "phLevel": 7.54,
                    "phRaw": 515,
                    "OrpClBrLevel": 120,
                    "orpRaw": 610,
                    "ambiantTemperature":12.6,
                    "waterLevel": 12.3,
                    "version": "May 24 2020",
                    "uptime": 19,
                    "currentTimetable": [{"on": "6:20", "off": "10:20"}, {
                        "on": "12: 0",
                        "off": "16: 0"
                    }, {"on": "17:40", "off": "21:40"}],
                    "currentSeason": {
                        "table": [{"on": "5:30", "off": "22:30"}],
                        "months": [4, 5, 6, 7, 8, 9],
                        "name": "summer"
                    },

                }
            })
            this.get("/config/default.txt", () => "/config/config.json")
            this.get("/config/config.json", () => {
                return {
                    "timetable": [{"minT": -10, "maxT": 7, "table": [{"on": "5:30", "off": "7:30"}]}, {
                        "minT": 7,
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
                    "whitehours": [{
                        "name": "summer",
                        "months": [4, 5, 6, 7, 8, 9],
                        "table": [{"on": "5:30", "off": "22:30"}]
                    }, {"name": "winter", "months": [10, 11, 12, 1, 2, 3], "table": [{"on": "7:30", "off": "16:30"}]}]
                }
            })
            this.get("/list", () => {
                return files
            })
            this.post("/edit", () => {
                files.push({
                    "type": "file",
                    "size": "2453",
                    "name": "test" + Math.random() + ".json"
                })
                return {}
            })

            this.post("/api/reboot", () => {
                return {}
            })

            this.post("/api/update", () => {
                return {}
            })

            this.delete("/api/manual", () => {
                return {}
            })

            this.put("/api/manual", () => {
                return {}
            })
        },
    })

    return server
}

