/**
 * Created by japjohal on 2018-10-05.
 * would like to take addning to table functions and make them one function
 */
$(document).ready(function(){
    
    // input of user Info
    var lastNameInput       = document.getElementById("lnInp");
    var firstNameInput      = document.getElementById("fnInp");
    var homePhoneInput      = document.getElementById("hpInp");
    var cellPhoneInput      = document.getElementById("cpInp");
    var streetInput         = document.getElementById("stInp");
    var cityInput           = document.getElementById("ctInp");
    var postalCodeInput     = document.getElementById("pcInp");

    // Input for vehicle info
    var vinInput            = document.getElementById("vinInp");
    var yearInput           = document.getElementById("yrInp");
    var makeInput           = document.getElementById("makeInp");
    var modelInput          = document.getElementById("modelInp");
    var licenseInput        = document.getElementById("lpInp");
    var odoInput            = document.getElementById("oiInp");
    var vehicleNotesInput   = document.getElementById("vnInp");
    var datePromised        = document.getElementById("dtInp");
    var dateHourPromised    = document.getElementById("timeHour");
    var dateMinPromised     = document.getElementById("timeMin");
    var dateAmPmPromised    = document.getElementById("timeAmPm");
    var divToAppendCommonRequests = document.getElementById("dropDownAppended");

    // Buttons
    var submitButton        = document.getElementById("submitBut");
    var serviceReqBtn       = document.getElementById("addBut");
    var otherSerRequest     = document.getElementById("OtherServiceReqBut");

    //Misc
    var tBody               = document.getElementById("requestTableBody");
    var otherTBody          = document.getElementById("otherRequestTableBody");
    var otherSerTextArea    = document.getElementById("otherRequestsInp");
    var clearFormBut       = document.getElementById("clearForm");

    // these two are the variables in table row
    var tableRows = 1;
    var tableRowsOther = 1;
    // these two are to keep track of num of requests made
    var numOfUnCommonRequests = 0;
    var numOfCommonRequests = 0;
    var requestsPackaged;
    
    /*------Used for existing customer ID // Vehicle ID ----------------------------------*/
    var cust_id = null;
    var vehicle_id = null;
    /*-----------------------------------------------------------------------------------*/

    /*------Used for existing customer ID // Vehicle ID ----------------------------------*/
    var homephoneverif = true;
    var cellphoneverif = true;
    var postalcodeverif = true;
    var licenseverif = true;
    var yearverif = true;
    var odoverif = true;
    var vinverif =  false;
    /*-----------------------------------------------------------------------------------*/

    loadBasics();

    async function submitButtonClick() {

        var commonTasksSelect = document.getElementById("requestsDropdown");
        var validate = requireValidation(lastNameInput.value, vinInput.value, numOfUnCommonRequests, numOfCommonRequests, cust_id, vehicle_id);

        if (validate.status == "true") {
            if (homephoneverif && cellphoneverif && postalcodeverif && licenseverif && yearverif && odoverif && vinverif){

                let vinResult = await vinCheck();

                    packageRequests();
                    await dateCheck();
                    let result = await getVariables();
                    if (vinResult.result == 1 || result.status == '2') {
                        switch (result.status) {
                            case '0':
                                newCustomerNewVehicle();
                                break;
                            case '1':
                                oldCustomerNewVehicle(result);
                                break;
                            case '2':
                                oldCustomerOldVehicle(result);
                                break;
                        }
                    }

                else{
                    swal("Duplicate VIN entered!","Please double check the VIN","error")
                    return null;
                }

            } else {
                    alert("Please correctly fill in the yellow boxes")
                }

            } else {
                if (validate.error.includes("Last Name Error")) {
                    lastNameInput.style.borderColor = 'red'
                }
                if (validate.error.includes("VIN Error")) {
                    vinInput.style.borderColor = 'red'
                }
                if (validate.error.includes("No Request")) {
                    commonTasksSelect.style.borderColor = 'red'
                    otherSerTextArea.style.borderColor = 'red'
                }
            }
    }

    let vinCheck = () =>{
        return new Promise((resolve) => {
            $.ajax({
                url:"/data/vinCheck",
                type:"post",
                data:{
                    vinNum:vinInput.value
                },
                success(response){
                    if(response.errorCode==1){
                        swal("Error",response.errorMessage,"warning");
                    }
                    else {
                        resolve(response)
                    }
                }
            })
        })
    }

    serviceReqBtn.onclick = function () {
        var commonTasksSelect   = document.getElementById("requestsDropdown");

        if(commonTasksSelect[commonTasksSelect.selectedIndex].value.toString() == "Common Requests"){
            return null;
        }
        // adding service requests to the table dynamically
        // using tableRows to dynamically change the number of elements in the table


        var th = document.createElement("th");
        var td = document.createElement("td");
        var tr = document.createElement("tr");
        var serviceRequestText = commonTasksSelect[commonTasksSelect.selectedIndex].innerHTML.toString();

        th.scope = "row";
        tr.id="commonTasks";
        th.innerHTML= tableRows++;  //Table rows is the number that is added to the table hence it starts at 1
        td.innerHTML = serviceRequestText;
        numOfCommonRequests++; // service requests are at 0.
        td.title= commonTasksSelect[commonTasksSelect.selectedIndex].value.toString();
        tr.appendChild(th);
        tr.appendChild(td);

        tBody.appendChild(tr);
    };

    function getCalendarDate() {
        var currentDate = new Date();

        var date = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        return year + "-" + (month+1) + "-" + date;
    }

    otherSerRequest.onclick = function () {
        // would like to make this same as serviceReqBtn function
        var th = document.createElement("th");
        var td = document.createElement("td");
        var tr = document.createElement("tr");
        var otherServiceRequestText = otherSerTextArea.value;

        th.scope = "row";
        tr.id="unCommonTasks";
        th.innerHTML= tableRowsOther++;  //Table rows is the number that is added to the table hence it starts at 1
        td.innerHTML = otherServiceRequestText;
        numOfUnCommonRequests++; // service requests are at 0.

        tr.appendChild(th);
        tr.appendChild(td);
        otherTBody.appendChild(tr);
    };

    let packageRequests = () => {
        return new Promise((resolve) =>{
            // this is where when submit is hit all data in table is packaged up
            var i, z;
            var obj = {
                commonRequestsTotal: numOfCommonRequests,
                commonRequests: [],
                otherReqTotal: numOfUnCommonRequests,
                otherRequests: []
            }; // not sure if there is dbFunc better way to do this?

            for (i = 0; i < numOfCommonRequests; i++) {
                obj.commonRequests.push(tBody.rows[i].childNodes[1].title); // cant get value have to use innerHTML
            }

            for (z = 0; z < numOfUnCommonRequests; z++) {
                obj.otherRequests.push(otherTBody.rows[z].childNodes[1].innerHTML);
            }

            requestsPackaged = obj;
            resolve();
        })
    }

    function getCommonRequests() {
        $.ajax({
            url:"/pages/requestDropdown.html",
            dataType: "html",
            success:function (resp) {
                divToAppendCommonRequests.innerHTML = resp;
            }
        });
    }

    function dateCheck() {
        return new Promise((resolve) =>{
            if(datePromised.value ==''){

                var currentDate = new Date();
                currentDate.setDate(currentDate.getDate()+1);

                var date = currentDate.getDate();
                var month = currentDate.getMonth();
                var year = currentDate.getFullYear();

                if(date < 10){
                    date = "0"+date;
                }
                var monthDateYear = year + "-" + (month+1) + "-" + date;

                dateHourPromised.value = 12;
                dateAmPmPromised.value = "PM";
                datePromised.value =  monthDateYear;
                resolve();
            }
            else{
                resolve()
            }
        })
    }

    function getVariables() {
        return new Promise((resolve,reject) =>
        {
            $.ajax({
                url: "/getVariables",
                type: "post",
                success: function (data) {
                    resolve (data);
                }
            })
        })
    }

    function loadBasics() {
        getCommonRequests();
        submitButton.addEventListener("click", submitButtonClick);
        clearFormBut.addEventListener("click",clearRequests);
        clearFormBut.addEventListener("click",clearForm);
        document.getElementById("searchBut").addEventListener("click",clearRequests);
    }

    function newCustomerNewVehicle() {
        let monthDateYear = getCalendarDate();

        var Promisedate = datePromised.value+" "+dateHourPromised[dateHourPromised.selectedIndex].value.toString()
            +":"+dateMinPromised[dateMinPromised.selectedIndex].value.toString()+":"+dateAmPmPromised[dateAmPmPromised.selectedIndex].value.toString()

        $.ajax({
            url: "/data/insertCustomer",
            type: "post",
            data: {
                lastName: lastNameInput.value,
                firstName: firstNameInput.value,
                homePhone: homePhoneInput.value,
                cellPhone: cellPhoneInput.value,
                street: streetInput.value,
                city: cityInput.value,
                postalCode: postalCodeInput.value,
                date: monthDateYear,
                dataGram: {
                    vin: vinInput.value,
                    year: yearInput.value,
                    make: makeInput.value,
                    model: modelInput.value,
                    license: licenseInput.value,
                    odometer: odoInput.value,
                    vehicleNotes: vehicleNotesInput.value,
                    datePromised:Promisedate
                },
                requests: requestsPackaged,
            },
            success: function (data) {
                if(data.status==1){
                    alert("Error")
                }
                else {
                    swal({title:"Repair Order Successfully Created"}, function () {
                            location.href = "/orders";
                        })

                }
            }
        })
    }

    function oldCustomerNewVehicle(request) {
        let monthDateYear = getCalendarDate();

        var promiseDate = datePromised.value+" "+dateHourPromised[dateHourPromised.selectedIndex].value.toString()
            +":"+dateMinPromised[dateMinPromised.selectedIndex].value.toString()+":"+dateAmPmPromised[dateAmPmPromised.selectedIndex].value.toString();



        $.ajax({
            url: "/data/insertOldCustNewVehicle",
            type: "post",
            data: {
                customerId: request.cust_id,
                date:monthDateYear,
                dataGram: {
                    vin: vinInput.value,
                    year: yearInput.value,
                    make: makeInput.value,
                    model: modelInput.value,
                    license: licenseInput.value,
                    odometer: odoInput.value,
                    vehicleNotes: vehicleNotesInput.value,
                    datePromised:promiseDate
                },
                requests: requestsPackaged,
            },
            success: function (data) {
                if(data.status==1){
                    alert("Error")
                }
                else {
                    swal({title:"Repair Order Successfully Created"}, function () {
                        location.href = "/orders";
                    })
                }
            }
        })

    }

    function oldCustomerOldVehicle(result) {
        let monthDateYear = getCalendarDate();

        var promiseDate = datePromised.value+" "+dateHourPromised[dateHourPromised.selectedIndex].value.toString()
            +":"+dateMinPromised[dateMinPromised.selectedIndex].value.toString()+":"+dateAmPmPromised[dateAmPmPromised.selectedIndex].value.toString();

        $.ajax({
            url: "/data/insertOldCustomerOldVehicle",
            type: "post",
            data: {
                customerId: result.cust_id,
                vehicleId: result.vehicle_id,
                date:monthDateYear,
                dataGram: {
                    vin: vinInput.value,
                    year: yearInput.value,
                    make: makeInput.value,
                    model: modelInput.value,
                    license: licenseInput.value,
                    odometer: odoInput.value,
                    vehicleNotes: vehicleNotesInput.value,
                    datePromised:promiseDate
                },
                requests: requestsPackaged,
            },
            success: function (data) {
                if(data.status==1){
                    swal("Error","Problems adding data")
                }
                else {
                    swal({title:"Repair Order Successfully Created"}, function () {
                        location.href = "/orders";
                    })
                }
            }
        })

    }

    function clearRequests() {
        for(let i =1; i<=numOfCommonRequests; i++){
            tBody.removeChild(document.getElementById("commonTasks"));
        }
        for(let z = 1; z <= numOfUnCommonRequests; z++){
            otherTBody.removeChild(document.getElementById("unCommonTasks"));
        }
        numOfCommonRequests     = 0;
        numOfUnCommonRequests   = 0;
        tableRows               = 1;
        tableRowsOther          = 1;
    }
    
    function clearForm() {
            
            lastNameInput.value     = "";
            firstNameInput.value    = "";
            homePhoneInput.value    = "";
            cellPhoneInput.value    = "";
            streetInput.value       = "";
            cityInput.value         = "";
            postalCodeInput.value   = "";
            vinInput.value          = "";
            yearInput.value         = "";
            makeInput.value         = "";
            modelInput.value        = "";
            licenseInput.value      = "";
            odoInput.value          = "";
            datePromised.value      = "yyyy-MM-dd"
            vehicleNotesInput.value = "";
            dateHourPromised.value  = "00";
            dateMinPromised.value   = "00";
            dateAmPmPromised.value  = "AM";
        
            //Nov 16 - Homy - I made some changes to this function. Added dependent functions at the end of this file
        
            ajaxSetVariables('0', null, null);
            enableCustomerInputs();
            enableVehicleInputs();
        }
    /*------Some styling Changes for Data Validation-------------------------------------------------------------------------------------------------------*/

    vinInput.onclick = () => {
        vinInput.style.borderColor = '#ccc';
    }

    lastNameInput.onclick = () => {
        lastNameInput.style.borderColor = '#ccc';
    }

    otherSerTextArea.onclick = () => {
        otherSerTextArea.style.borderColor = 'darkgrey';
    }

    setTimeout(() => {
        document.getElementById("requestsDropdown").onclick = () => {
            document.getElementById("requestsDropdown").style.borderColor = 'darkgrey';
        }
    }, 1000)

    homePhoneInput.addEventListener('focusout', function(event){
        var validate = phone_validator(homePhoneInput.value)
        if(validate.status){
            homePhoneInput.style.borderColor = 'darkgrey'
            homePhoneInput.value = validate.repnum
            homephoneverif = true
        } else {
            homePhoneInput.style.borderColor = 'yellow'
            homephoneverif = false
        }
    })

    cellPhoneInput.addEventListener('focusout', function(event){
        var validate = phone_validator(cellPhoneInput.value)
        if(validate.status){
            cellPhoneInput.style.borderColor = 'darkgrey'
            cellPhoneInput.value = validate.repnum
            cellphoneverif = true
        } else {
            cellPhoneInput.style.borderColor = 'yellow'
            cellphoneverif = false
        }
    })

    postalCodeInput.addEventListener('focusout', function(event){
        var validate = postal_code_validator(postalCodeInput.value)
        if(validate.status){
            postalCodeInput.style.borderColor = 'darkgrey'
            postalCodeInput.value = validate.reppost
            postalcodeverif = true
        } else {
            postalCodeInput.style.borderColor = 'yellow'
            postalcodeverif = false
        }
    })

    licenseInput.addEventListener('focusout', function(event){
        var validate = license_validator(licenseInput.value)
        if(validate.status){
            licenseInput.style.borderColor = 'darkgrey'
            licenseInput.value = validate.replice
            licenseverif = true
        } else {
            licenseInput.style.borderColor = 'yellow'
            licenseverif = false
        }
    })

    vinInput.addEventListener('focusout', function(event){
        var validate = vin_validator(vinInput.value)
        if(validate.status){
            vinInput.style.borderColor = 'darkgrey'
            vinInput.value = validate.repvin
            vinverif = true
        } else {
            vinInput.style.borderColor = 'yellow'
            vinverif = false
        }
    })

    yearInput.addEventListener('focusout', function(event){
        var validate = year_validator(yearInput.value)
        if(validate){
            yearInput.style.borderColor = 'darkgrey'
            yearverif = true
        } else {
            yearInput.style.borderColor = 'yellow'
            yearverif = false
        }
    })

    odoInput.addEventListener('focusout', function(event){
        var validate = odo_validator(odoInput.value)
        if(validate){
            odoInput.style.borderColor = 'darkgrey'
            odoverif = true
        } else {
            odoInput.style.borderColor = 'yellow'
            odoverif = false
        }
    })
    /*-------------------------These are functions from search_page.js---------------------------------------------------*/
    //Maybe there is some way to import them from that file? Client side though.
    
    function ajaxSetVariables(status, vehicle_id, cust_id){
        $.ajax({
            url:"./setVariables",
            type:"post",
            data:{
                status: status,
                vehicle_id: vehicle_id,
                cust_id: cust_id
            },
            success:function (resp) {
                console.log('Status set to '+resp.status);
            }
        });
    }
    
    function enableCustomerInputs(){
        lastNameInput.disabled = false;
        firstNameInput.disabled = false;
        homePhoneInput.disabled = false;
        cellPhoneInput.disabled = false;
        streetInput.disabled = false;
        cityInput.disabled = false;
        postalCodeInput.disabled = false;
    }
        
    function enableVehicleInputs(){
        vinInput.disabled = false;
        yearInput.disabled = false;
        makeInput.disabled = false;
        modelInput.disabled = false;
        licenseInput.disabled = false;
    }
    
});

