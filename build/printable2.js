$(document).ready(function () {
    console.log("ready");

    var printable = document.getElementById("printable");
    var header = document.getElementById("header");
    var topRight = document.getElementById("topRight");
    var customerInfo = document.getElementById("customerInfo");
    var vehicleInfo1 = document.getElementById("vehicleInfo1");
    var vehicleInfo2 = document.getElementById("vehicleInfo2");
    var tasksRequested = document.getElementById("tasksRequested");
    var footer = document.getElementById("footer");
    var mileageOut = document.getElementById("mileageOut");
    var wheelTorque = document.getElementById("wheelTorque");
    var wrap = document.getElementById("wrap");

    var topPadding = "70px";

    //Run when page is loaded. Ajax call to grab RO data from session
    function getROData() {
        var id = document.getElementById("ID").innerHTML
        $.ajax({
            url: "/rosearch/AroSearch",
            type: "post",
            data: {
                roSearchWord: id,
                roSearchBy: "ro_id",
                roStatus: "all"
            },
            success: function (data) {
                fillPageData(data[0]);
                $.ajax({
                    url: "/rosearch/taskSearch",
                    type: "post",
                    data: {
                        roID: id
                    },
                    success: function (data) {

                        fillTasksRequestedHTML(data);
                        for (e in data) {
                            $.ajax({
                                url: "/rosearch/PartSearch",
                                type: "post",
                                data: {
                                    id: data[e].worktask_id
                                },
                                success: function (data) {
                                    console.log(data)
                                    addPart(data)

                                }
                            })
                            $.ajax({
                                url: "/rosearch/LabourSearch",
                                type: "post",
                                data: {
                                    id: data[e].worktask_id
                                },
                                success: function (data) {
                                    addLab(data)

                                }
                            })
                        }
                        window.print();
                    }
                });
            }
        });

    }

    //Uses the session data and categorizes it into different variables so that they can be used as parameters in other functions
    function fillPageData(data) {
        //console.log(data);
        if (data.first_name == "") {
            var customerName = data.last_name
        } else {
            var customerName = data.last_name + ", " + data.first_name;
        }

        //Displayed in the customerInfo div
        var customerData = {
            "Customer Name": customerName,
            "Cell Phone": data.cell_phone,
            "Home Phone": data.home_phone
        };

        //Displayed in vehicleInfo1 div
        var vehicleData1 = {
            "VIN": data.vin,
            "License Plate": data.license_plate,
            "Year": data.year,
            "Make": data.make,
        };

        //Displayed in vehicleInfo2 div
        var vehicleData2 = {
            "Model": data.model,
            "Odometer (In)": data.odometer_in,
            "Odometer (Out)": data.odometer_out,
        };

        //Displayed in vehicleInfo3 div
        // var vehicleData3 = {
        //     "Vehicle Notes": data.vehicle_notes
        // };

        //Format displayed date and time
        //console.log(data.promised_time)
        var promised_date = data.promised_time.substring(0, 10);
        var promised_time = data.promised_time.substring(11, 16);

        //Display the RO # and Promised date and time on the top right
        topRight.innerHTML = formatLabel("Repair Order #", false) + data.ro_id + formatLabel("Promised Time") + promised_date + " " + promised_time;

        //Set the HTML for these divs to display the correct information
        customerInfo.innerHTML = fillInfoDiv(customerData);
        vehicleInfo1.innerHTML = fillInfoDiv(vehicleData1);
        vehicleInfo2.innerHTML = fillInfoDiv(vehicleData2);
        // vehicleInfo3.innerHTML = fillInfoDiv(vehicleData3);

        //Loop through the task array and generate divs

    };

    //Function used to set whether a label has a line break before it or not
    function formatLabel(label, breakInBeginning) {
        if (breakInBeginning === false) {
            return ("<b>" + label + ":</b> ");
        } else {
            return ("<br><b>" + label + ":</b> ");
        };
    };

    //Returns a string with the innerHTML needed for the data it takes in
    function fillInfoDiv(divData) {
        var returnString = "";
        for (item in divData) {
            returnString += formatLabel(item) + divData[item];
        }
        return returnString;
    }

    //Loops through the task array and create divs to append to the document
    function fillTasksRequestedHTML(array) {
        console.log(array)
        for (data in array) {
            console.log(data)
            var job = document.createElement('div');
            var cust = document.createElement('div');
            cust.id = 'custreq';
            cust.className = 'row';
            var title = document.createElement('h2');
            title.id = 'title'
            title.innerHTML = `Job: ${parseInt(data)+1}`
            var reqname = document.createElement('div');
            reqname.id = 'repcoms_title'
            reqname.innerHTML = `Customer Request: ${array[data].task_name}`
            var reqcom = document.createElement('div');
            reqcom.id = 'repcoms_title'
            reqcom.innerHTML = `Repair Comments:${array[data].comments}`
            var lHead = document.createElement('div');
            lHead.id = 'custreq'
            lHead.className = "row"
            lHead.innerHTML = `<h4>Labour: </h4>`;
            var lspot = document.createElement('div');
            lspot.id = `l${array[data].worktask_id}`
            var pHead = document.createElement('div');
            pHead.id = 'custreq'
            pHead.className = "row"
            pHead.innerHTML = `<h4>Parts: </h4>`;
            var pspot = document.createElement('div');
            var calc = document.createElement('div');
            calc.id = 'calc';
            var total = document.createElement('h2');
            total.id = 'total'
            total.innerHTML = `Job Total: `
            var pl = document.createElement('text');
            pl.id = 'pl'
            pl.innerHTML = `Parts and Labour: </br>`
            var discount = document.createElement('text');
            discount.id = 'discount'
            discount.innerHTML = `Discounted: </br>`
            var extra = document.createElement('text');
            extra.id = 'extra'
            extra.innerHTML = `Extra: </br>`
            var sub = document.createElement('text');
            sub.id = 'subtotal'
            sub.innerHTML = `Subtotal: </br>`

            calc.appendChild(pl)
            calc.appendChild(discount)
            calc.appendChild(extra)
            calc.appendChild(sub)

            cust.appendChild(title)
            cust.appendChild(reqname)
            cust.appendChild(reqcom)

            job.appendChild(cust)
            job.appendChild(lHead)
            job.appendChild(lspot)
            job.appendChild(pHead)
            job.appendChild(pspot)
            job.appendChild(calc)

            document.getElementById('footer').appendChild(job)
        }
    }

    getROData();

});