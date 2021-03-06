$(document).ready(function(){
    console.log("ready");

    var url_string = window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get("x");
    document.getElementById("ID").innerHTML = c

    var topRight = document.getElementById("topRight");
    var customerInfo = document.getElementById("customerInfo");
    var vehicleInfo1 = document.getElementById("vehicleInfo1");
    var vehicleInfo2 = document.getElementById("vehicleInfo2");
    var tasksRequested = document.getElementById("tasksRequested");
    var footer = document.getElementById("footer");
    
    var topPadding = "70px";
    
    //Run when page is loaded. Ajax call to grab RO data from session
    function getROData(){
        var id = document.getElementById("ID").innerHTML
        $.ajax({
            url:"/rosearch/AroSearch",
            type:"post",
            data:{
                roSearchWord : id,
                roSearchBy : "ro_id",
                roStatus :"all"
            },success: function(data){
                fillPageData(data[0]);
                $.ajax({
                    url:"/rosearch/taskSearch",
                    type:"post",
                    data:{
                        roID:id
                    },
                    success: function(data){
                        
                        fillTasksRequestedHTML(data);
                        window.print();
                    }
                });
            }
        });
        
    }
    
    //Uses the session data and categorizes it into different variables so that they can be used as parameters in other functions
    function fillPageData(data){
        console.log(data);
        if(data.first_name == ""){
            var customerName = data.last_name
        }else{
            var customerName = data.last_name+", "+data.first_name;
        }
        
        //Displayed in the customerInfo div
        var customerData = {
            "Customer Name" : customerName,
            "Cell Phone" : data.cell_phone,
            "Home Phone" : data.home_phone
        };
        
        //Displayed in vehicleInfo1 div
        var vehicleData1 = {
            "VIN" : data.vin,
            "License Plate" : data.license_plate,
            "Year" : data.year,
            "Make" : data.make,
        };
        
        //Displayed in vehicleInfo2 div
        var vehicleData2 = {
            "Model" : data.model,
            "Odometer (In)" : data.odometer_in,
            "Odometer (Out)" : data.odometer_out,
        };
        
        //Displayed in vehicleInfo3 div
        var vehicleData3 = {
            "Vehicle Notes" : data.vehicle_notes
        };
        
        //Format displayed date and time
        console.log(data.promised_time)
        var promised_date = data.promised_time.substring(0, 10);
        var promised_time = data.promised_time.substring(11, 16);
        
        //Display the RO # and Promised date and time on the top right
        topRight.innerHTML = formatLabel("Repair Order #", false)+data.ro_id+formatLabel("Promised Time")+promised_date+" "+promised_time;
        
        //Set the HTML for these divs to display the correct information
        customerInfo.innerHTML = fillInfoDiv(customerData);
        vehicleInfo1.innerHTML = fillInfoDiv(vehicleData1);
        vehicleInfo2.innerHTML = fillInfoDiv(vehicleData2);
        vehicleInfo3.innerHTML = fillInfoDiv(vehicleData3);
        
        //Loop through the task array and generate divs
        
    };
    
    //Function used to set whether a label has a line break before it or not
    function formatLabel(label, breakInBeginning){
        if(breakInBeginning === false){
            return ("<b>"+label+":</b> ");
        }else{
            return ("<br><b>"+label+":</b> ");
        };
    };
    
    //Returns a string with the innerHTML needed for the data it takes in
    function fillInfoDiv(divData){
        var returnString = "";
        for(item in divData){
            returnString += formatLabel(item)+divData[item];
        }
        return returnString;
    }
    
    //Loops through the task array and create divs to append to the document
    function fillTasksRequestedHTML(array){
        var lastindex = 0;
        for(let i = 0; i < array.length; i++){
            var taskName = array[i].task_name;
            var taskDiv = document.createElement("div");
            for(var j = 0; j < 10; j++){
                taskName += '<hr>';
            }
            taskDiv.id = "printTasks";
            
            //If index is 3 or divisible by 5 afterwards, add a top padding equal to the top margin of the document
            if(i === 3 || ((i - 3) % 5) === 0 ){
                taskDiv.style.paddingTop = topPadding;
            }
            
            taskDiv.innerHTML = "&#10063; "+taskName;
            tasksRequested.appendChild(taskDiv);   
            lastindex++;
        }
        if(lastindex === 3 || ((lastindex - 3) % 5) === 0 ){
            footer.style.paddingTop = topPadding;
        }
        
    }
    
    getROData();
    
});