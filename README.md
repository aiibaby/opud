# OPUD
BCIT School of Transportation Project F18-013

## Introduction to Opud
Opud is a web application commissioned by Naveen Jit from the BCIT School of Transportation. It designed to be used by the customer support representative working for the School of Transportation. 

Its main function is to allow the support representative to enter customer and vehicle information into a database and create a printable repair order which will be sent to the school’s automotive shop. A technician will then fill out the repair order and give it back to the customer support representative so that the information on the tasks done to the vehicle can be entered into the database.

This application is currently a work-in-progress, and the main function still left to be implemented is the ability to add information on parts used for each repair order and to generate a printable invoice from the data on each repair order. This application is also intended to be hosted on BCIT’s own servers.

## Database Structure
The database used for this application is PostgreSQL 9.6.

Please click here for the: [Database Entity Relationship Diagram](Database_ERD.png)

### Tables:

#### Customer

Stores only customer data.

#### Vehicle

Stores vehicle data with cust_id linking back to Customer table.
Unused columns: 
```
•	 Body
•	 Style
•	 Color
```

#### Repair_Order

Stores information on each repair order. Tied to `Vehicle` table at `Vehicle_ID`. Column `Status` refers to the repair order being either open (`false`) or closed (`true`). Default for `Status` is `false`.

#### Repair Tasks

Stores the data for individual tasks within each repair order. A repair order could have a number of different tasks. Each row represents an instance of a particular task in the `Task` table.

#### Unused Columns:
```
•	 Labor_hrs
•	 Labor_rate
```

#### Task

Represents the categories of different tasks that can be done. For common tasks listed in the Common Requests dropdown on the Vehicle Check-In page, data needs to be inserted into this table using the database initialization script when the database is first set up. The same `Task_ID` for a common task may be found multiple times in the `Repair_Tasks` table.

Uncommon (user inputted) tasks will be added to this table when inputted in the Uncommon Tasks input field in the Vehicle Check-In page. Each uncommon task `Task_ID` will only appear once in the `Repair_Tasks` table.

#### Parts

This table is currently unused. It will store the data for the parts used for each task in `Repair_Tasks`. This will be used in addition to `Labor_hrs` and `Labor_rate` to calculate the cost of each task when generating an invoice (currently not implemented).


## Application Dependencies

### Applications:
- PostgreSQL v9.6
- Node.js

### Node Modules:
- Express
- Body-Parser
- Express-Session
- Handlebars
- HBS
- JQuery
- PG
- PhantomJs-Prebuilt
- Socket.io
- SweetAlert
- WebPack

### Scripts loaded into HTML files:
- Bootstrap
- DataTables
- JQuery
- SweetAlert

## Server Documentation (index.js)

### index.js

This is the server file that Node will run to start the webserver. 

### Constants for dependencies:
- exp
- path
- bodyParser
- expressSession

### Constants for server:
- port
- server

### Constants for routed server-side function files:
- seaFunctions
- vinFunctions
- dbFunctions
- roFunctions
- printableFunctions

### Functions:

`/search`

Parameters: request.body.searchQuery, request.body.searchType

Returns: JSON object

Purpose: 
- Runs the getSearchData function from searchFunctions.js when called upon by an AJAX call from the client

`/cVIN`

Parameters: request.body.vin

Returns: JSON object

Purpose: 
- Runs the checkVIN function from checkVIN.js
- Used to check if a VIN already exists in the database

`/setVariables`

Parameters: None

Returns: JSON object

Purpose: 
- Sets the session variables for status, cust_id, and vehicle_id to determine the different scenarios (new customer and new vehicle, old customer and new vehicle, or old customer and old vehicle)

`/getVariables`

Parameters: None

Returns: JSON object

Purpose: 
- Gets the session variables for status, cust_id, and vehicle_id


## Search Page Documentation

The Search Page is what the user will see first when they try to access Vehicle Check-In. It allows them to search for existing customers and select the vehicle data in order to fill out the Vehicle Check-In page with pre-existing data. This is also the only way to create a new order for an existing customer.

### Assumptions:

This is the page that the user sees when they try to access Vehicle Check-In. It allows them to quickly search for information on a returning customer or click the New Customer Check-In button.

This page is injected into the Vehicle Check-In Page through AJAX. Users should only be able to access this through the normal link to the Vehicle Check-In page.

### Prerequisites:

DataTables API script and CSS (Linked in search.html)
Bootstrap API script and CSS (Linked in search.html)
JQuery (Linked in checkin.html)

### Related Files:
•	search.html

•	search_page.css

•	searchFunctions.js

•	search_overlay.js

•	search_page.js

•	index.js

•	checkin.html

#### search.html

This is the html file for the search page. The head element contains links to the dependencies Bootstrap and DataTables API along with `search_page.css` and `search_page.js`.

Note that while JQuery is also a dependency, it is linked in checkin.html instead of this file. This is because this file (`search.html`) is placed into `checkin.html` when the Vehicle Check-In page is loaded. Loading JQuery scripts twice in one page is known to cause issues with the DataTables API, so it is only loaded in the `checkin.html` file.

The layout of elements in this file (and all others in this project) is determined by Bootstrap classes.

#### search_page.css

This is the stylesheet for `search.html`.

#### searchFunctions.js

This is the server-side script for running the database query that will populate the table in the search page.

##### Functions:
`getSearchData()`

Parameters: searchQuery, searchType

Returns: JSON object {status, data}

Purpose:
- This function takes in the values from the search input box, searchQuery, and the type of search, searchType, from the dropdown to run a database query that returns a JSON object with a status and data containing all customer and vehicle information from the Customer and Vehicle tables in the database which match searchQuery.
  
- Before the database query is run, searchQuery is checked against a regex to ensure that it only contains letters and numbers.
- This function is exported by this file to be used in index.js when an AJAX call is made using the search button.


#### search_overlay.js

This is the client-side script containing the function which executes the AJAX call to inject search.html into checkin.html. The reason this is done is to pass data quickly between the Search Page and Vehicle Check-In Page, as they will essentially act as one page.

#### Functions:

`getSearchPage()`

Parameters: None.

Returns: search.html, placed into the <div> element with id = “searchPosition”
  
  Purpose:
- Injects search.html into checkin.html to allow for search data to be passed effectively to the input forms in checkin.html so that the inputs can auto-fill.
- This function is run automatically when the script is loaded by checkin.html.
  
#### search_page.js

This page contains the main scripts for the functionality of the elements in search.html.

#### Functions:

`search_button function (Event Listener for click)`

Parameters: searchQuery, searchType

Returns: Row data to populate the DataTable, or alert saying search should not contain special characters.

Purpose:
- Runs when the search button is clicked.
- Has an AJAX call to send the values in the search input field and the search type from the dropdown to the server so that getSearchData() in searchFunctions.js can be run.
- Initializes the DataTable and displays the search results in the DataTable.
- The Table only displays Last Name, First Name, Cell Phone, Model, License Plate, and VIN, but all other columns are still received by the client.
- Adds an on-select function to the rows in the DataTable for the row’s data to be passed to the Vehicle Check-In Page when either the Select Customer Only button or the Select Customer + Vehicle button is clicked.

`ajaxSetVariables()`

Parameters: status, vehicle_id, cust_id

Returns: None

Purpose:
- Sets the session variables for status
  - § Status variable determines which scenario is taking place:
    - 0: New Customer, New Vehicle
    - 1: Existing Customer, New Vehicle
    - 2: Existing Customer, Existing Vehicle
  - §  Status variable is then used by functions in the Vehicle Check-In Page to determine what kind of data entry occurs when Submit button is clicked.
- Sets the session variables for vehicle_id and cust_id so that it can be used in the Vehicle Check-In Page if status is 1 or 2.
- This function is run automatically when page loads to set status to 0 and vehicle_id and cust_id to null. This defaults the scenario to New Customer, New Vehicle until the user makes a search and selects and existing customer/vehicle.


`makeCheckInVisible()`

Parameters: None

Returns: None

Purpose:
- Sets the entirety of search.html invisible and makes the elements of checkin.html visible.
- Used when any of the three buttons that leads the user to the Vehicle Check-In Page is clicked.

`makeSearchVisible()`

Parameters: None

Returns: None

Purpose:
- Sets the entirety of checkin.html invisible and makes the elements of search.html visible.
- Used when user clicks the Existing Customer button in the Vehicle Check-In Page.

`autofillCustomer()`

Parameters: data

Returns: None

Purpose:
- Takes in the row data from the DataTable and fills Customer Information on the Vehicle Check-In Page with this data.
- Used when user clicks Select Customer or Select Customer + Vehicle

`autofillVehicle()`

Parameters: data

Returns: None

Purpose:
- Takes in the row data from the DataTable and fills Vehicle Information on the Vehicle Check-In Page with this data.
- Used when user clicks Select Customer + Vehicle
 
`clearCustomer()`

Parameters: None

Returns: None

Purpose:
- Clears the data that was filled with autofillCustomer()

`clearVehicle()`

Parameters: None

Returns: None

Purpose:
- Clears the data that was filled with autofillVehicle()


## Vehicle Check-In Documentation

### Assumption: 
- User has already chosen one of the following three options:
  - New Customer New Vehicle
  - Old Customer Old Vehicle
  - Old Customer New Vehicle

For simplicity we will call the page to the right the vehicle check in page(VCP). The VCP is the main source of data for the application. 

### Pre-Requisites:
- As previously mentioned, when you are on this page a status variable has been set
- The status has been set in search_page.js file
- When the VCP loads it checks this status and pre fills, if any, the input fields if appropriate
- The HTML for this page can be found in the public folder
  - checkin.html
  - requestDropDown.html
  
### javaScript for VCP:

The majority of all functionality is provided by the checkInSubmit.js file. This page takes information present on the form and inserts it into the database. At the top of the JS file all input fields have a variable assigned to them. 

In the preceding section we will discuss each function:

`loadBasics()`

Parameters: None

Return: None

Purpose: 
- Load requests dropdown select. 
- The values for the select are located in requestsDropDown.html
  - They are grabbed with a ajax call and append to select
  - Requests are kept in separate file to make changes quicker and easier
  - Note: 
    - If any changes are made to this file corresponding changes need to be made to database creation script
    - Note: How its value is one and it is the first insertion into table
- Remainder of function assigns values to button clicks

`vinCheck:`

Parameters: None

Return: 1 or 0

Purpose:
- checkVIN.js queries the DB to see if the VIN is already present
- every car has a unique VIN so in the DB it has a unique constraint
- If VIN is present a sweetAlert is used to tell user that they entered a VIN that is already in DB. 
  - Returns a 1
- If VIN is not present.
  - Returns a 0
  
`addCommonServiceRequests()`:

Parameters: None

Return: None

Purpose:
- Before function does anything it double checks that user is not trying to add “Common Requests” to the table
  - If it is adding “Common Requests” to the table it does not allow this and returns null
  - “Common Requests” is not a valid option for a service request
- Common service requests are added dynamically to a table.
- When the add button closest to the dropdown is clicked three elements are created: 
  - Th, Td, Tr
- It gets the value of the dropdown selected and appends that to the Td
  - The td.title is set to the value of the drop down
  - The value is used by the DB to assign tasks to a repair_order
- The Th,Td, and Tr are eventually appends to the table
- Two variables are updated in this function: 
  - numberOfCommonRequests
    - Used to keep track of how many requests have been added to table 
    - Used in packageRequests()  function 
  - tableRows
    - Shows how many common requests are added to table

`addUnCommonServiceRequests()`:

Parameters: None

Return: None

Purpose: 
- Similar to addCommonServiceRequests
- Does not have IF statement like addCommonServiceRequests()
  - Updates different variables 
    - Variables are serving same purpose


`getCalendarDate()`:

Parameters: None

Return: Current Date formatted


`dateCheck()`:

Parameters: None

Return: None

Purpose:
- Function check if date has been set by user
- Due to DB requirements if date is less than 10 a zero is added to the front of it
- If promise date has not been changed by user the promise date is set to today’s date plus one day and the promised time is set to 12 pm

`getVariables()`:

Parameters: None

Return: session variable

Purpose:
- Function grabs from a session variable from index.js 
  - Session variable can be 0, 1, 2
  - The variable denotes what type of insert is going to happen
- Result from this function is used in submit button click


`clearRequests()`:

Parameters: None

Return: session variable

Purpose:
- Clear both service requests tables of all entries
- Resets the variables after completion of deletion


`clearForm()`:

Parameters: None

Return: session variable

Purpose:
- Reset all inputs to blanks
- INTERNAL USE IF ADDING STATUS UPDATE CHANG ME (setting values to false etc)
 
`newCustomerNewVehicle()`:

Parameters: None

Return: 1 or Null

Purpose:
- This function is used when the  getVariables() returns a zero
- We are entering a customer who has not been to the shop before
- We will also be then entering a vehicle for that customer
- We package up all car and person information into a JSON object
- The function passes data to the insertCustomer function in the dbFunctions file
  - Note: oldCustomerOldVehicle & oldCustomerNewVehicle are similar to this function
- They are invoked when the getVariables() returns a 1 or 2
- Depending on what function is used the amount of data that is packaged varies
-	On success all of these functions move the user to the Repairs Orders page

`packageRequests()`:

Parameters: None

Return: None

Purpose:
- This function takes all of the common and uncommon service requests that the user has made and packages them into a array
- We package the requests into seperate arrays
  - CommonRequests are packaged into one array
  - unCommonRequests are packaged into another array
  - The length of each array is also recorded
  - Each array and array length is packaged into one array and that is assigned to the variable requestsPackaged variable

`submitButtonClick`

Parameters: None

Return: None

Purpose:
- Note: This function is asynchronous 
- This function is invoked each time the submit button is clicked
- At the start of the function there is validation done on 
  - Last Name
  - Vin
  - common Requests
  - unCommonRequests
  - A user must enter a last name, vin, and either a commonRequest or unCommonRequest
  - Depending on what field value does not match the regex that input box is highlighted red
- After passing the regex checks on required fields we do check on non required fields to make sure, IF, data is entered into those fields that conforms to our regexs
- Next, we wait for the vinCheck function
  - Depending on the result of that function we either move on or we alert the user that the vin they entered is already in the db 
- If the vin is not entered we call the packageRequests() 
- After we awaitCheck function
- Then we wait for the getVariables() function
- Then an if statement comes up where if either:
  - The VIN isnt in the DB 
  - Or if the status is 2
  - Meaning we are creating a second repair order for a car and vehicle that is already in the DB
  
## Db Functions Documentation

The checkInSubmit.js page links directly to the dbFunctions.js page. 

The dbFunctions file does not actually do inserts rather it calls createRepairOrderSec1.js to do inserts. 

The createRepairOrderSec1.js contains many functions each of these functions is isolated. They only do one insert into one table. 

The dbFunctions.js calls functions in createRepairOrderSec1.js. Depending on the status of the user. Either 0,1, or 2. Different inserts are done

### Pre-Requisites:
Understand the different types of status from the checkInSubmit page. 

### JS for dbFunctions.js:

`async doInsertNewCustomerNewVehicle()`:

Parmas: req (the data from the checkInSubmit page

Return:

Purpose:
- Note: function is asynchronous, its wrapped in a try catch
- This function is called when the user is inserting a new customer and a new vehicle
- This function receives information on the customer, vehicle, and service requests
- Logic insert:
  - Customer get back customerID
  - Vehicle using customerID get back vehicleID
  - createRepairOrder using vehicleID get back reapirOrderNumber
  - IF there is no unCommonTasks 
    - we insert all the commonTaks into the DB using reapir order
  - ELSE
    - IF there are commonTasks
      - We insert both common and unCommon tasks using repair order
  - ELSE
    - We insert only unCommonTasks are no other tasks are present

`async doInsertOldCustomerNewVehicle()`:

Parmas: req
- Includes no customer information except customerID
- Has all vehicle information

Purpose:
- This function is used when we have a customer who is already in the database
- The customer has multiple cars and is bringing in a car they have not previously not brought in
- Logic:
  - Insert Vehicle using customerID returning vehicleID
  - Create repairOrder using vehilceID returning repairOrder
  - IF there is no unCommonTasks 
    - we insert all the commonTaks into the DB using repair order
  - ELSE
    - IF there are commonTasks
      - We insert both common and unCommon tasks using repair order
  - ELSE
    - We insert only unCommonTasks are no other tasks are present
    
`async doInsertOldVehicleOldCustomer()`:

Parmas: req
- Includes no customer information except customerID
- Includes no vehicle information except vehilceID

Purpose:
- This function is used when we have an existing customer, and vehicle
- We are creating a new repair order for this vehicle
- Logic:
  - Create repairOrder using vehilceID returning repairOrder
  - IF there is no unCommonTasks 
    - we insert all the commonTaks into the DB using repair order
  - ELSE
    - IF there are commonTasks
      - We insert both common and unCommon tasks using repair order
  - ELSE
    - We insert only unCommonTasks are no other tasks are present

`async insertWithOnlyCommonTasks()`:

Parmas: commonTasks, createReapirOrder

Purpose:
- This function is called within the above three functions
  - It only gets called when there are only commonTasks and no unCommonTasks
- It calls one of the functions in the createRepairOrderSec1.js page
- It lastly calls a test method which is used for confirmation only
  - This method queries the db returning all information on the recently created repair order
  
`async insertCommonUnCommonWorkTasks()`:

Parmas: req, createReapirOrderID

Purpose:
- This function is called when their are common and unCommonTasks that need to be added to a repair order
- Common tasks are never entered into the db rather we add common tasks via the task_id which is provided via checkInSubmit
- Adding unCommonTasks is different
  - Each unCommonTask is added to the task table
  - We keep track of the taskId
-	This function adds both commonTasks and unCommonTasks and commonTasks
-	Then we call the testMethod twice using both common and unCommon task IDs

`async insertOnlyUnCommonTasks()`:

Params:  req, createReapirOrderID

Purpose:
- To insert the unCommonTasks
- We insert the unCommonTasks to the task table
-	We then take the unCommonTaskIDs and add them to the reapir_tasks table
- We then call test method to get the information we just entered

## createRepairOrderSec1.js

### Assumption: 
- Learning about this file please read about dbFunctions.js

At the start of the file there is a connection to the postgres database

`insertCustomer()`:

Parmas: 
- Takes req
- Only uses customer information

Returns:
- A promise
- Either resolve, reject
- On resolve returns customerID

Purpose:
- This function takes customer information and using prepared statement (found at bottom of page) it adds customer information to DB and returns only customerID

`insertVehicles()`:

Parmas:
- Takes Vehicle information, and customerID

Returns:
- A promise
- Either resolve, reject
- On resolve returns vehicleID

Purpose:
- This function takes vehicle information and using prepared statement (found at bottom of page) it adds vehicle information to DB and returns only vehicleID

 
`createRepairOrder`()

Params:
- Vehicle notes, odometer, vehicleID, date promised, and dataGram

Returns: 
- A promise either resolve or reject
- Returns repairOrderID

Purpose:
- This function takes all information provided and creates a repair order and returns repairOrderID

`insertUnCommonTasks()`:

Params:
- All unCommonRequests

Return:
- The ID of the unCommonTasks

Purpose:
- So each unCommon task that a user asks for is always added to the tasks table. 
- We use a for loop to create an array that is the size of the number of unCommonTasks
- We enter the unCommonTasks and we return their task_ids

`createWorkTasksUnCommon()`:

Parmas:
- reapirOrderID, unCommonTaskID

Return:
- An array of all workTask_IDs

Purpose:
- This function takes each unCommonTaskID and adds its to the reapir_tasks table and also adds a reference to the reapir_order table

`createWorkTaskCommon()`:

Params:
- commonTaskID, and reapirOrderID

Return:
- An array of all workTask_IDs

Purpose:
- This function takes each CommonTaskID and adds its to the reapir_tasks table and also adds a reference to the reapir_order table

`getInfo()`:

Parmas:
- taskID

Return:
- An array of information from DB from multiple tables

Purpose:
- This function is used to test if the information that was entered to the DB went to the right tables. 
- It takes a taskID and queries multiple tables to get you all the information for that entry and returns that information to the user 


## Repair Order Documentation

The Repair Order page allows users to search for an existing repair order(s) and view the relevant information regarding the repair order. This information is based on the data that was inputted in the Vehicle Check In page. 

On this page, users can also edit and update certain fields in the report order. There is also a functionality for users to print out the repair order. 

### URL: 
- /orders

### Prerequisites:
- DataTables API script and CSS*
- Bootstrap API script and CSS*
- JQuery*
- (* linked in the <head></head> of ro.html)

### Related Files:
- ro.html
- ro.css
- ro.js
- roFunctions.js

### ro.html
The HTML for repair order popup window shown in Figure 1 is wrapped inside the <div class=”container-fluid”> div. The HTML for the repair order search and result follows after this div
 
### ro.css

This is the stylesheet for the repair order page. 

### ro.js

`addPartButFunc(worktask_id)`:

Parameters: worktask_id

Returns: None

Purpose: 

- Creates the input fields for part no., part description, part quantity, part unit price, part sell price and part supplier name. 

Note: The part input fields functionality to save into the database is not implemented and therefore is commented out in the file.

`closePopup()`:

Parameters: None

Returns: None

Purpose: 
- Close the report order popup screen

`disableInput()`:

Parameters: None

Returns: None

Purpose: 
- Set the following input fields to disabled=true:
  - odometerOut
  - Openclose
- Change the class for saveRO to btn btn-default pull-right invisible
- Change the class for editRO to btn btn-default pull-right visible
- Set the background color for the openclose input field to “#eee”

`enableInputs()`

Parameters: None

Returns: None

Purpose: 

- Set the following input fields to disabled=false:
  - odometerOut
  - Openclose
  - comments
    - Change the class for saveRO to btn btn-default pull-right visible
    - Change the class for editRO to btn btn-default pull-right invisible
    - Set the background color for the openclose input field to “#fff”

`populateRO(rowData)`:

Parameters: rowData

Returns: None

Purpose: 
- Takes the data associated with the selected repair order and populate it in the repair order popup screen

`populateTasksComments(data)`:

Parameters: data

Returns: None

Purpose: 
- Takes the repair order ID (ro_id) and populate the tasks and comments of the repair order 

`resultsTable (on select)`:

Parameters: data

Returns: None

Purpose: 
- Select the data of the selected row (data in the form of an array)

`saveComments(data)`:

Parameters: data

Returns: array

Purpose: 
- Takes the input values of the comments textarea and save it in an array

`searchROBut (event onclick)`:

Parameters: None

Returns: None

Purpose: 
- Search the database based on the search word, repair order status, and the search parameter values. 
- Populates the datatable based on the search result with the repair order ID, last name, first name, license plate, make, model and repair order status. 

`searchTask(roID, rowData)`:

Parameters: roID, rowData

Returns: None

Purpose: 
- Takes the repair order ID (ro_id) and search for tasks and comments associated with that repair order ID. 

`updateRO(worktaskIDcomments, odometerOut, roID, openClose)`:

Parameters: worktaskIDcomments, odometerOut, roID, openClose

Returns: None

Purpose: 
- Save the comment(s), odometer out, repair order status input values into the database.

`window (event onclick)`:

Parameters:  None

Returns: None

Purpose: 
- Changes the display of the repair order popup screen to none. 

`window (event keydown)`:

Parameters:  None

Returns: None

Purpose: 
- Disable browser refresh on enter 

### roFunctions.js

This is the server-side script for running the database query that will populate the datatable in the repair order page and the repair order popup screen. 

`AroSearch (router.post)`:

Purpose:
- Returns a JSON object containing all the columns and values in the customer, vehicle, and repair_order table in the database.

`pool.connect`:

Purpose:
- Login to the database and query the database.

`/tasksSearch (router.post)`:

Purpose:
- Search for the task_name, comments, and worktask_id based on the ro_id 

`updateTaskCommentsLoop(arraytaskIDComments)`

Parameters:  arraytaskIDComments

Returns: None

Purpose: 
- Asynchronous function that is necessary to update the task comments correctly. 
- Ensure the for loops is run step by step before running other steps

`connectDBTasksComments(worktask_id, comments)`

Parameters:  worktask_id, comments

Returns: None

Purpose: 
- Connects to the database and update the comments in the repair_tasks table

`/updateRO (router.post)`:

Purpose: 
- Updates the odometer_out and status column in the repair_order table.


## Repair Order (PDF / Print) Documentation

This is the page generated by the Open PDF button in the Repair Order Information pop-up. It is a static HTML page containing the repair order information formatted into a printable document. 

The purpose of this page is to provide a printable version of the Repair Order that the customer representative can give to the repair shop for the technician to fill out and bring back. For this reason, the comments on each task which may be edited in the Repair Order Information pop-up is not shown.

### Prerequisites:

This page must be accessed through the Open PDF button in the Repair Order Page and requires session variables for the specified repair order to be set in order to generate the relevant information.

### Related Files:
- roprint.html
- printable.js
- printableFunctions.js
- print.css

### roprint.html

This file provides the div elements for the printable Repair Order.

### print.css

This is the stylesheet for the printable Repair Order. Every element is scaled in pixels and formatted for a standard 8.5 x 11 paper.

Page and body margins are set to 0 to avoid the browser inserting page, title, and url information onto the document when it is printed. To emulate the margin, the div elements in roprint.html have been given individual margins.

### printable.js
#### Functions:

`getROData()`

Parameters: None

Returns: None

Purpose:
- This function is run when the page is loaded
- Sends an AJAX call /print/getROInfo
  - This call pulls the repair order information that was saved as session variables so that it can be displayed in the HTML page.
  - Calls function fillPageData() with the session data returned by the AJAX call

`fillPageData()`

Parameters: data

Returns: None

Purpose:
- Takes in the repair order data that was stored as session variables and divides them up into variables:
  - customerName
  - customerData
  - vehicleData1
  - vehicleData2
  - vehicleData3
  - promised_date
  - promised_time
- These variables will be used as parameters in separate functions that will display them in the correct format on the HTML document
- Calls on fillInfoDiv() and fillTasksRequested() to format the document

`formatLabel()`

Parameters: label, breakInBeginning

Returns: A string with the label in bold HTML element and either a line break in the beginning or no break in the beginning

Purpose:
- Used in formatting the labels for fields to have a line break in the beginning or not.

`fillInfoDiv()`

Parameters: divData

Returns: String composed of HTML elements formatted correctly to be placed in the innerHTML for info div elements

Purpose:
- Takes in a customer or vehicle information variable set in fillPageData(), loops through each element inside and calls formatLabel() to create a string that contains the innerHTML for the info div 
- Used to create the innerHTML for the customer and vehicle information divs

`fillTasksRequestedHTML()`

Parameters: array

Returns: None

Purpose:
- Takes in the array of tasks tied to the repair order and loops through each one to create a taskDiv element and append it with the task name and some lines. 
- Depending on the index of the task in the array, some top padding will be added to the div to match the top margins of the document. This is due to the body and page margins being set to 0.

## Menu
The menu is a navigation bar that is ajax into the top of the screen of every HTML page. It contains 3 links: Vehicle Check-In, Repair Order, and About. The menu scales with mobile devices and the menu links will stack on top of each other on a small screen

### Prerequisites:
The menu is ajax into each HTML page in the menuPosition div. 

Related files:
- menu.html
- menu.css
- menu.js
- getmenu.js

#### menu.html
This is the HTML file for the menu. The menu is based on the Bootstrap framework. It is located on the top of the screen with the navigation item align to the right of the navigation bar. The following Bootstrap classes are used:
- navbar navbar-inverse
- container-fluid
- navbar-header
- navbar-brand
- nav navbar-nav navbar-right align-items-end
- align-bottom

For more information please refer to the Bootstrap Navbar documentation:
(https://getbootstrap.com/docs/4.0/components/navbar/)


#### menu.css
This is the stylesheet for the menu. ID are assigned to Bootstrap classes to override the styling inherit from the Bootstrap framework.

#### menu.js
This is the JavaScript file for the menu. All the JavaScript of the menu is inherited from Bootstrap and therefore this file is empty. Future enhancement for the menu could include a change of styling of the navigation link when it is the active page.

#### getmenu.js

`getmenu()`

Parameters: None

Returns: None

Purpose:
- Call the /menu.html file into the menuPosition div

## Known Issues

1. If a user opens the printable HTML and does not close the tab, the Repair Order page will not work correctly:
- User may be able to close the Repair Order Information pop-up, but opening another one will not display the tasks tied to that repair order
- User may not be able to close the Repair Order Information pop-up

2. An UnhandledPromiseRejectionWarning warning shows up when repair order are edited, saved, and repair order are searched again. Currently it does not affect the functionality of the web application, however unhandled promise rejections are deprecated and in the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

