let displayDate = $("#currentDay");
let displayTimeslots = $("#time-slots");

//get stored calendar or instantiate an empty array
let storedCalendar = JSON.parse(localStorage.getItem("storedCalendar"));
if(storedCalendar===null){
    storedCalendar=[];
}
//get stored preferences
let calendarPreferences = JSON.parse(localStorage.getItem("calendarPreferences"));
if(calendarPreferences===null){
    calendarPreferences = {
        "startTime":7,
        "endTime":17,
        "militaryTime":false
    }
    localStorage.setItem("calendarPreferences",JSON.stringify(calendarPreferences));
}

let buisnessHours = [calendarPreferences.startTime, calendarPreferences.endTime];

$(document).ready(()=>{
    setCurrentDateTime(displayDate);
    createTimeSlots(displayTimeslots,buisnessHours);
    setTimeSlotColoring();
    loadStoredCalendar(storedCalendar);
})


function setCurrentDateTime(container){
    //create elements to hold day / date / time
    let dayNameEL = $("<div>")
    dayNameEL.attr("id","day-name");
    let dayMonthYearEl = $("<div>");
    dayMonthYearEl.attr("id","day-month-year");
    let clockEl = $("<div>");
    clockEl.attr("id","clock");

    //add day to element
    dayNameEL.text(moment().format("dddd"));
    //add date to element
    dayMonthYearEl.text(moment().month() + "-" + moment().date() + "-" + moment().year());
    //get current time for clock
    let hour = moment().hour();
    let minute = moment().minute();
    let second = moment().second();
    let formatedClock = getFormatedTime(hour,minute,second);
    clockEl.text(formatedClock);
    //create clock
    let myClock = setInterval(function(){
        second++;
        if(second>=60){
            second=0;
            minute++
            if(minute>=60){
                hour++;
                if(hour>=24){
                    clearInterval(myClock);
                    setCurrentDateTime(container);
                }
                setTimeSlotColoring();
            }
        }
        formatedClock = getFormatedTime(hour,minute,second);
        clockEl.text(formatedClock);
    },1000)

    container.append(dayNameEL);
    container.append(dayMonthYearEl);
    container.append(clockEl);
}

function createTimeSlots(container,range){
    let timeslotsNeeded = range[1]-range[0];
    for (let x = 0; x < timeslotsNeeded; x++){
        //create timeslot container
        let timeSlotEL = $("<div>");
        let hour = parseInt(x) + parseInt(range[0]);
        timeSlotEL.attr("id", "hour-" + hour);
        timeSlotEL.attr("value",hour);
        timeSlotEL.addClass("time-block row");
        container.append(timeSlotEL);

        //create hour element
        let hourEl = $("<div class=\"col-3\">");
        hourEl.text(getFormatedHour(hour));
        hourEl.addClass("hour");
        timeSlotEL.append(hourEl);

        //create event element
        let eventEL = $("<textarea class=\"col-7\">");
        timeSlotEL.append(eventEL);

        //create save button element
        let saveBtn = $("<div class=\"col-2 pt-4\">");
        saveBtn.addClass("saveBtn");
        saveBtn.text("SAVE");
        saveBtn.on("click",function(){
            let parent = $(this).parent();
            let textarea = $(this).siblings("textarea");
            let calendarEvent = {
                "date":moment().month() + "-" + moment().date() + "-" + moment().year(),
                "hour":parent.attr("value"),
                "description":textarea.val()
            }
            storedCalendar.push(calendarEvent);
            localStorage.setItem("storedCalendar",JSON.stringify(storedCalendar));
        })
        timeSlotEL.append(saveBtn);
    }
}

function setTimeSlotColoring(){
    let currentHour = moment().hour();
    let timeSlotsEL = $(".time-block");
    //set past styling
    let pastSlots = timeSlotsEL.filter(function(index){
        let value = $(this).attr("value");
        return value < currentHour;
    })
    pastSlots.children("textarea").removeClass("present");
    pastSlots.children("textarea").removeClass("future");
    pastSlots.children("textarea").addClass("past");

    //set future styling
    let futureSlots = timeSlotsEL.filter(function(index){
        let value = $(this).attr("value");
        return value > currentHour;
    })
    futureSlots.children("textarea").removeClass("present");
    futureSlots.children("textarea").removeClass("past");
    futureSlots.children("textarea").addClass("future");

    //set present styling
    let presentSlot = $("[value=" + currentHour + "]");
    presentSlot.children("textarea").addClass("present");
}

function loadStoredCalendar(storedCalendar){
    if(storedCalendar!=[]){
        let currentDate = moment().month() + "-" + moment().date() + "-" + moment().year();
        for(let x=0; x < storedCalendar.length; x++){
            if(currentDate===storedCalendar[x].date){
                let timeSlot = $("#hour-" + storedCalendar[x].hour);
                let textarea = timeSlot.children("textarea");
                //check incase office hours were changed and the store timeslot is no longer displayed
                if(timeSlot){
                    textarea.val(storedCalendar[x].description);
                }
            }
        }
    }
}

function getFormatedTime(hour,minute,second){
    let fHour;
    let fMinute;
    let fSecond;
    let fTime;
    if (calendarPreferences.militaryTime){
        hour<10 ? fHour = "0" + String(hour) : fHour = String(hour);
        minute<10 ? fMinute = "0" + String(minute) : fMinute = String(minute);
        second<10 ? fSecond = "0" + String(second) : fSecond = String(second);
        fTime = fHour + ":" + fMinute + ":" + fSecond;
    } else {
        hour < 13 ? fHour = String(hour) : fHour = String(parseInt(hour)-12);
        minute<10 ? fMinute = "0" + String(minute) : fMinute = String(minute);
        second<10 ? fSecond = "0" + String(second) : fSecond = String(second);
        fTime = fHour + ":" + fMinute + ":" + fSecond + (hour < 13 ? " AM" : " PM");
    }
    return fTime;
}

function getFormatedHour(hour){
    let fHour;
    if(calendarPreferences.militaryTime){
        fHour = hour < 13 ? "0" + String(hour) + ":00" : String(hour) + ":00"
    } else {
        hour > 12 ? fHour = (parseInt(hour)-12) + " PM" : fHour = hour + " AM";
    }
    return fHour;
}