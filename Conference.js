module.exports = function (eventData) {
    // private variables
    const eventDetails = eventData;

    //private method for string to array conversion
    const getEventArray = function () {
        return eventDetails.split('\n');
    }

    const eventArray = new getEventArray();

    // Private method
    const initialEventStartTime = function () {
        //set event time to 9:00AM
        const date = new Date()
        date.setHours(9)
        date.setMinutes(0)
        date.setSeconds(0)
        return date;
    }

    //private method to find out talkLength from the event details string
    const findTalkLengthInt = function (item) {
        let talkLength = item.match(/\d+/);
        return parseInt(talkLength[0])
    }

    // private method to get talkDetails in object
    const getTalkDetails = function () {
        //creating event object with talkLength and talk details
        let talk = new Array();
        eventArray.map((item, index) => {
            let talkLength = findTalkLengthInt(item)
            talk.push({ talkLength: talkLength, talkDetails: item });
        })
        return talk;
    }

    const talk = new getTalkDetails();
    const totalTalks = talk.length;

    let eventTime = new initialEventStartTime();

    const totalMinBeforeLunch = 180; //total event time in min before lunch 9:00AM - 12:00PM fixed 
    const totalMinAfterLunch = 240; //total event time in min after lunch 1:00PM - 5:00PM

    //total min remaing before lunch
    let totalMinRemaining = totalMinBeforeLunch;

    const lunchBreakMin = 60;//60min lunch break
    const networkingEventMin = 60; //60min networking event


    let track = 1;

    let result = "";

    const allocateTalkTime = function (indexExists) {
        if (indexExists > -1) {
            eventTime.setMinutes(eventTime.getMinutes() + talk[indexExists].talkLength)
        } else if (totalMinRemaining > 0) {
            eventTime.setMinutes(eventTime.getMinutes() + talk[0].talkLength)
        }
    }


    const calculateTotalTimeRemaining = function (indexExists) {
        if (indexExists > -1) {
            totalMinRemaining = totalMinRemaining - talk[indexExists].talkLength;
            return totalMinRemaining;
        } else if (totalMinRemaining > 0) {
            totalMinRemaining = totalMinRemaining - talk[0].talkLength;
            return totalMinRemaining;
        }
    }

    const emptyTalkArray = function (indexExists) {
        if (indexExists > -1) {
            return talk.splice(indexExists, 1)
        } else if (totalMinRemaining > 0) {
            return talk.splice(0, 1)
        }
    }

    const getSortedTalk = function (indexExists) {
        if (indexExists > -1) {
            return result = result.concat(eventTime.toLocaleTimeString(), ' ', talk[indexExists].talkDetails, '\n')
        } else if (totalMinRemaining > 0) {
            return result = result.concat(eventTime.toLocaleTimeString(), ' ', talk[0].talkDetails, '\n')
        }
    }


    //total talks before lunch from the event start time, 9:00AM to 12:00PM = 180min
    const getTalkBeforeLunch = function () {
        if (totalMinRemaining === 0 && eventTime.getHours() === 12) {
            result = result.concat(eventTime.toLocaleTimeString(), ' ', 'Lunch', '\n')
            eventTime.setMinutes(eventTime.getMinutes() + lunchBreakMin)
            //set totalMin after lunch
            totalMinRemaining = totalMinAfterLunch
        }
    }

    //total talks before lunch from the event start time, 1:00PM to 5:00PM = 240min
    const getTalkAfterLunch = function () {
        if (totalMinRemaining === 0 && eventTime.getHours() === 17) {
            result = result.concat(eventTime.toLocaleTimeString(), ' ', 'Networking Event', '\n')
            eventTime.setMinutes(eventTime.getMinutes() + networkingEventMin)
            //after the event is over set new start time for next track 
            eventTime = new initialEventStartTime()
            totalMinRemaining = totalMinBeforeLunch;
            track = track + 1;
            result = result.concat(`Track ${track}:`, '\n')
        }
    }

    // public method 
    this.sortEvent = function () {

        result = result.concat(`Track ${track}:`, '\n')
        for (let index = 0; index < totalTalks; index++) {
            let indexExists = talk.findIndex((element) => element.talkLength === totalMinRemaining);
            getTalkAfterLunch();
            getTalkBeforeLunch();
            getSortedTalk(indexExists)
            allocateTalkTime(indexExists)
            calculateTotalTimeRemaining(indexExists)
            emptyTalkArray(indexExists)
        }

        return result;
    }
}