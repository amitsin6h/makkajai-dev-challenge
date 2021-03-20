
module.exports = function (eventDetails) {
    this.eventDetails = eventDetails;
    this.sortEvent = function () {
        var date = new Date(2021, 2, 20, 9, 00, 00)

        let eventArr = this.eventDetails.split('\n');

        const eventObj = [];

        eventArr.map((item, index) => {
            let talkLength = item.match(/\d+/);
            eventObj.push({
                talkLength: parseInt(talkLength[0]),
                talk: item
            });
        })

        let totalEventTime = (12 - date.getHours()) * 60; //total event time before lunch

        const eventObjSize = eventArr.length;

        let count = 1;

        console.log(`Track ${count}:`)

        for (let index = 0; index < eventObjSize; index++) {
            let indexExists = eventObj.findIndex((element) => element.talkLength === totalEventTime);

            if (totalEventTime === 0 && date.getHours() === 12) {
                console.log(date.toLocaleTimeString(), 'Lunch')
                date.setMinutes(date.getMinutes() + 60) //60min lunch break
                totalEventTime = 240 /// re assign time after lunch event
            }


            if (totalEventTime === 0 && date.getHours() === 17) {
                console.log(date.toLocaleTimeString(), 'Networking Event')
                
                date.setMinutes(date.getMinutes() + 60) //60min networking event

                date = new Date(2021, 2, 22, 9, 00, 00)
                totalEventTime = 180 /// re assign time after network event for next track
                count = count + 1;
                console.log(`Track ${count}:`)
            }

            if (indexExists > -1) {
                console.log(date.toLocaleTimeString(), eventObj[indexExists].talk)
                
                date.setMinutes(date.getMinutes() + eventObj[indexExists].talkLength)
                totalEventTime = totalEventTime - eventObj[indexExists].talkLength
                eventObj.splice(indexExists, 1)
            } else if (totalEventTime > 0) {
                console.log(date.toLocaleTimeString(), eventObj[0].talk)
                
                date.setMinutes(date.getMinutes() + eventObj[0].talkLength)
                totalEventTime = totalEventTime - eventObj[0].talkLength
                eventObj.splice(0, 1)
            }
        }

    }
}