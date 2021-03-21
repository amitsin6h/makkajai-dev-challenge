module.exports = function (eventDetails) {
    this.eventDetails = eventDetails;
    this.sortEvent = function () {

        function EventStartTime(){
            //set event time to 9:00AM
            const date = new Date()
            date.setHours(9)
            date.setMinutes(0)
            date.setSeconds(0)
            return date;
        }

        //string to array conversion
        const eventArray = this.eventDetails.split('\n');

        //create event object with talkLength and talk value
        function TalkDetails(){
            let talk = [];
            eventArray.map((item, index) => {
                let talkLength = item.match(/\d+/);
                talk.push({
                    talkLength: parseInt(talkLength[0]),
                    talkDetails: item
                });
            })
            return talk;
        }

        const talk = new TalkDetails();
        const totalTalks = talk.length;

        let eventTime = new EventStartTime();

        const totalMinBeforeLunch = 180; //total event time in min before lunch 9:00AM - 12:00PM fixed 
        const totalMinAfterLunch = 240; //total event time in min after lunch 1:00PM - 5:00PM

        //total min remaing before lunch
        let totalMinRemaining = totalMinBeforeLunch; 

        let track = 1;

        //total talks before lunch from the event start time, 9:00AM to 12:00PM = 180min
        function talkBeforeLunch(){
            const lunchBreakMin = 60;//60min lunch break
            if (totalMinRemaining === 0 && eventTime.getHours() === 12) {
                console.log(eventTime.toLocaleTimeString(), 'Lunch')
                eventTime.setMinutes(eventTime.getMinutes() + lunchBreakMin) 
                
                //set totalMin after lunch
                totalMinRemaining = totalMinAfterLunch 
            }
        }

        function talkAfterLunch(){
            const networkingEventMin = 60; //60min networking event
            if (totalMinRemaining === 0 && eventTime.getHours() === 17) {
                console.log(eventTime.toLocaleTimeString(), 'Networking Event')
                
                eventTime.setMinutes(eventTime.getMinutes() + networkingEventMin) 

                //after the event is over set new start time for next track 
                eventTime = new EventStartTime()
                totalMinRemaining = totalMinBeforeLunch;
                track = track + 1;
                console.log(`Track ${track}:`)
            }
        }

        //handle talk based on the talk min
        function handleTalk(indexExists){
            if (indexExists > -1) {
                console.log(eventTime.toLocaleTimeString(), talk[indexExists].talkDetails)
                
                eventTime.setMinutes(eventTime.getMinutes() + talk[indexExists].talkLength)
                totalMinRemaining = totalMinRemaining - talk[indexExists].talkLength
                talk.splice(indexExists, 1)
            } else if (totalMinRemaining > 0) {
                console.log(eventTime.toLocaleTimeString(), talk[0].talkDetails)
                
                eventTime.setMinutes(eventTime.getMinutes() + talk[0].talkLength)
                totalMinRemaining = totalMinRemaining - talk[0].talkLength
                talk.splice(0, 1)
            }
        }

        console.log(`Track ${track}:`)
        for (let index = 0; index < totalTalks; index++) {
            let indexExists = talk.findIndex((element) => element.talkLength === totalMinRemaining);
            talkAfterLunch();
            talkBeforeLunch();
            handleTalk(indexExists);
        }

    }
}