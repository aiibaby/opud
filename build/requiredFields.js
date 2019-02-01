function requireValidation(last_name, vin, commonRequestNum, uncommonRequestNum, cust_id, vehicle_id){
	status = true
	error = []
	if (last_name === "" && cust_id === null){
		status = false 
		error.push("Last Name Error")

	}

	if (vin === "" && vehicle_id === null){
		status = false
		error.push("VIN Error")
	}

	if (commonRequestNum === 0 && uncommonRequestNum === 0){
		status = false 
		error.push("No Request")
	}
	return {status: status, error: error}
}