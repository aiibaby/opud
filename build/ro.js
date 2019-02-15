$(document).ready(function() {
    
    
    // user search input and parameters
    var roSearchInp = document.getElementById("roSearchInp");
    var SOptionsDropdown = document.getElementById("SOptionsDropdown");
    var ROOptionsDropdown = document.getElementById("ROOptionsDropdown");
    
    // buttons
    var searchROBut = document.getElementById("searchROBut");
    
    // repair order fields
    var roNum = document.getElementById("roNum");
    var roCustName = document.getElementById("roCustName");
    var roTel = document.getElementById("roTel");
    var roCell = document.getElementById("roCell");
    var roVIN = document.getElementById("roVIN");
    var roLicense = document.getElementById("roLicense");
    var roYear = document.getElementById("roYear");
    var roMake = document.getElementById("roMake");
    var roModel = document.getElementById("roModel");
    var roOdometerIn = document.getElementById("roOdometerIn");
    var roNotes = document.getElementById("roNotes");
    
    // repair order updatable fields
    var odometerOut= document.getElementById("odometerOut");
    var promiseDate = document.getElementById("promiseDate");
    var openclose = document.getElementById("openclose");
    
    // print repair order
    var openPDF = document.getElementById("openPDF");
    var openInvoice = document.getElementById("openInvoice");
    var vehicle_info = null;
    
    
    
    // this function populates the DataTable with the returned query result
    searchROBut.onclick = function() {
        $.ajax({
            url:"/rosearch/AroSearch",
            type:"post",
            data:{
                roSearchWord:roSearchInp.value,
                roSearchBy:SOptionsDropdown.value,
                roStatus:ROOptionsDropdown.value,  
            },
            success:function(data){
                if (data){
                    
                if ( $.fn.DataTable.isDataTable('#resultsTable') ) {
                    $('#resultsTable').DataTable().destroy();
                }
                
                // var is not defined for resultsTable as it will cause a bug where the datatable will not read the data correctly 
                resultsTable = $('#resultsTable').DataTable({
                    //destroy: true,
                    select: true,
                    data: data,
                    "autoWidth": false,
                    "columns": [
                        {"data":"ro_id"},
                        {"data":"last_name"},
                        {"data":"first_name"},
                        {"data":"license_plate"},
                        {"data":"make"},
                        {"data":"model"},
                        {data:"status",
                          render : function (data, type, row) {
                             return data == 'true' ? 'Closed' : 'Open'
                          }
                        }
                    ]
                    
                });
                 
                // this function display a popup screen that display relevant repair order information
                resultsTable.on('select', function ( e, dt, type, indexes ) {
                    
                    var rowData = resultsTable.rows( indexes ).data()[0];
                    vehicle_info = rowData;
                    //window.location.href=`/test?para1=${rowData}`;
                    populateRO(rowData);
                    //console.log(rowData)
                    searchTask(rowData.ro_id, rowData);   
                });

                  
                }
                else{
                    alert("Error! taskSearch");
                }
            }  
        });
    }
    
    // this function populates the popup repair order screen with the selected repair order information
    function populateRO(rowData){
        console.log(roNum.value)
        roNum.value = rowData.ro_id;
        console.log(roNum.value)
        roCustName.value = rowData.last_name + ", " + rowData.first_name;
        console.log(roCustName.value)
        roTel.value = rowData.home_phone;
        roCell.value = rowData.cell_phone;
        roVIN.value = rowData.vin;
        roLicense.value = rowData.license_plate;
        roMake.value = rowData.make;
        roModel.value = rowData.model;
        roYear.value = rowData.year;
        roOdometerIn.value = rowData.odometer_in;
        odometerOut.value = rowData.odometer_out;
        roNotes.value = rowData.vehicle_notes;
        openclose.value = rowData.status;

        var promiseData = new Date(rowData.promised_time);
        promiseDate.value = promiseData.getFullYear() + '-' + promiseData.getMonth() + '-' + promiseData.getDate() + ' ' + promiseData.getHours() + ':' + (promiseData.getMinutes()<10?'0':'') +  promiseData.getMinutes();
        document.getElementById("roInfo").submit();
    }
    
    
    // ajax that sends the (ro_id) to get all the service requested information (worktask_id, comments, task_name)
    function searchTask(roID, rowData){
        $.ajax({
            url:"/rosearch/taskSearch",
            type:"post",
            data:{
                roID:roID
            },
            success:function(data){
            }
        }); 
    }
   
        
    // This function prevents refreshes on enter on #roSearchInp
    $(window).keydown(function(event){
       if(event.keyCode == 13) {
         event.preventDefault();
         return false;
       }
   });
});