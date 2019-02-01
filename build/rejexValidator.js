function phone_validator(phone_number){
	//In accordance to North American Phone Numbers
	var phone_number_regex = /(\({1}[0-9]{3}\)\s[0-9]{3}-[0-9]{4})|([0-9]{3}\-[0-9]{3}\-[0-9]{4})|([0-9]{3}\s[0-9]{3}\s[0-9]{4})|([0-9]{10})|([0-9]{3}\s{1}[0-9]{7})|(^[\s]*$)/

	//(604) 123-1234
	//6041231234
	//604 123 1234
	//604 1231234

	if (phone_number_regex.test(phone_number)) {

		if (/^[\s]*$/.test(phone_number) !== true)  {
			sepnum = phone_number.replace(/\D/g, '').split("")
			trunum = "("+sepnum.splice(0,3).join("")+") " + sepnum.splice(0,3).join("") + "-" + sepnum.splice(0,4).join("")

				//(604) 123-1234

				return {status: true, repnum: trunum}
		} else {
			return {status: true, repnum: ""}
		}
		
	} else {
		return {status: false, repnum: null}
	}
}

function year_validator(year){
	year_regex = /([0-9]{4,4})|(^[\s]*$)/
	if (year_regex.test(year)) {
		return true
	} else {
		return false
	}
}

function postal_code_validator(postal_code){
	//In Accordance to Canadian Postal Codes(or BC Postal code)
	var postal_code_regex = /([a-zA-Z]{1}[0-9]{1}[a-zA-Z]{1}[0-9]{1}[a-zA-Z]{1}[0-9]{1})|([a-zA-Z]{1}[0-9]{1}[a-zA-Z]{1}\s[0-9]{1}[a-zA-Z]{1}[0-9]{1})|(^[\s]*$)/
// a1a1a1
//a1a 1a1
//A1A 1A1
	if (postal_code_regex.test(postal_code)) {
		if(/^[\s]*$/.test(postal_code) !== true){
			cappost = postal_code.replace(/[^A-Za-z0-9]/g, "").toUpperCase().split("");
			newpost = cappost.splice(0,3).join("") + " " + cappost.splice(0,3).join("")

			return {status: true, reppost: newpost}
		} else {
			return {status: true, reppost: ""}
		}
	} else {
		return {status: false, reppost: null}
	}

}



function vin_validator(vin){
	//In Accordance to Canadian Postal Codes(or BC Postal code)
	var vin_regex = /[a-zA-Z0-9]{17}/

	if (vin_regex.test(vin)) {
		newvin = vin.toUpperCase()
		return {status: true, repvin: newvin}
	} else {
		return {status: false, repvin: null}
	}

}

function license_validator(license){
	//In Accordance to Canadian License
	var license_regex = /([a-zA-Z0-9])|(^[\s]*$)/

	if (license_regex.test(license)) {
		if (/(^[\s]*$)/.test(license) !== true){
			newlice = license.toUpperCase()
			return {status: true, replice: newlice}
		} else {
			return {status: true, replice: ""}
		}	
	} else {
		return {status: false, replice: null}
	}

}

function odo_validator(odometer){
	odo_regex = /(^[0-9]*$)|(^[\s]*$)/
	if (odo_regex.test(odometer)) {
		return true
	} else {
		return false
	}
}
