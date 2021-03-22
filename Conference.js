module.exports = function (eventData) {
    // Private variables
    const eventDetails = eventData;

    //string to array conversion
    const eventArray = eventDetails.split('\n');
    
    // Private method
    const EventStartTime = function() {
        //set event time to 9:00AM
        const date = new Date()
        date.setHours(9)
        date.setMinutes(0)
        date.setSeconds(0)
        return date;
    }

    // Private method
    const TalkDetails = function() {
        //creating event object with talkLength and talk details
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

    let result = "";

    // public method 
    this.sortEvent = function () {

        //total talks before lunch from the event start time, 9:00AM to 12:00PM = 180min
        function talkBeforeLunch(){
            const lunchBreakMin = 60;//60min lunch break
            if (totalMinRemaining === 0 && eventTime.getHours() === 12) {
                result = result.concat(eventTime.toLocaleTimeString(),' ', 'Lunch', '\n')
                eventTime.setMinutes(eventTime.getMinutes() + lunchBreakMin) 
                //set totalMin after lunch
                totalMinRemaining = totalMinAfterLunch 
            }
        }


        function talkAfterLunch(){
            const networkingEventMin = 60; //60min networking event
            if (totalMinRemaining === 0 && eventTime.getHours() === 17) {
                result = result.concat(eventTime.toLocaleTimeString(),' ', 'Networking Event', '\n')
                
                eventTime.setMinutes(eventTime.getMinutes() + networkingEventMin) 

                //after the event is over set new start time for next track 
                eventTime = new EventStartTime()
                totalMinRemaining = totalMinBeforeLunch;
                track = track + 1;
                result = result.concat(`Track ${track}:`, '\n')
            }
        }


        //handle talk based on the talk min
        function handleTalk(indexExists){
            if (indexExists > -1) {
                result = result.concat(eventTime.toLocaleTimeString(),' ', talk[indexExists].talkDetails, '\n')

                eventTime.setMinutes(eventTime.getMinutes() + talk[indexExists].talkLength)
                totalMinRemaining = totalMinRemaining - talk[indexExists].talkLength
                talk.splice(indexExists, 1)
            } else if (totalMinRemaining > 0) {
                result = result.concat(eventTime.toLocaleTimeString(),' ', talk[0].talkDetails, '\n')

                eventTime.setMinutes(eventTime.getMinutes() + talk[0].talkLength)
                totalMinRemaining = totalMinRemaining - talk[0].talkLength
                talk.splice(0, 1)
            }
        }

        result = result.concat(`Track ${track}:`, '\n')
        for (let index = 0; index < totalTalks; index++) {
            let indexExists = talk.findIndex((element) => element.talkLength === totalMinRemaining);
            talkAfterLunch();
            talkBeforeLunch();
            handleTalk(indexExists);
        }

        return result;
    }
}