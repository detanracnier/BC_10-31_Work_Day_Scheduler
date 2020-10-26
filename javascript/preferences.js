$(document).ready(()=>{

let startTimeInput = $("#startTime");
let endTimeInput = $("#endTime");
let militaryCb = $("#militaryCb");
let saveBtn = $("#saveButton");

//setting saved preferences
let calendarPreferences = JSON.parse(localStorage.getItem("calendarPreferences"));
startTimeInput.val(calendarPreferences.startTime);
endTimeInput.val(calendarPreferences.endTime);
if(calendarPreferences.militaryTime){
    militaryCb.prop('checked',true);
} else {
    militaryCb.prop('checked',false);
}

let startTimeVal = parseInt(startTimeInput.val());
let endTimeVal = parseInt(endTimeInput.val());

startTimeInput.change(function(){
    if(this.value > 23){
        this.value = 23;
    }
    if(this.value < 1){
        this.value = 1;
    }
    if( startTimeVal >= endTimeVal){
        startTimeInput.val(endTimeInput.val()-1);
        alert("Start time cannot come before end time");
    }
})

endTimeInput.change(function(){
    if(this.value > 24){
        this.value = 24;
    }
    if(this.value < 2){
        this.value = 2;
    }
    if( startTimeVal >= endTimeVal){
        startTimeInput.val(endTimeInput.val()-1);
        alert("Start time cannot come before end time");
    }
})

militaryCb.on("click",function(){
    console.log($(this).prop('checked'));
})

saveBtn.on("click",function(){
    let calendarPreferences = {
        "startTime":parseInt(startTimeInput.val()),
        "endTime":parseInt(endTimeInput.val()),
        "militaryTime":militaryCb.prop('checked')
    }
    localStorage.setItem("calendarPreferences",JSON.stringify(calendarPreferences));
})

})