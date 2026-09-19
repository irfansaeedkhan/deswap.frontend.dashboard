module.exports.convertToUSD = (pricevalue)=>{
    try {

        while(pricevalue.includes("$")){
            pricevalue = pricevalue.replace('$','');
        }

		while(pricevalue.includes("€")){
            pricevalue = pricevalue.replace('€','');
        }
        while(pricevalue.includes(".")){
             pricevalue = pricevalue.replace('.','@');
        }
        while(pricevalue.includes(",")){
         pricevalue = pricevalue.replace(',','.');
        }
        
        while(pricevalue.includes("@")){
         pricevalue = pricevalue.replace('@',',');
        }
        
        return pricevalue.trim();
	} catch (e) {
		return "0,00";
	}   
}

module.exports.convertToEuro = (pricevalue) => {
    try {
        
        let integerNumber = Math.floor(pricevalue)
        let decimalValue = pricevalue-integerNumber;
        
        pricevalue = Number(pricevalue).toLocaleString('en-US');
        if(decimalValue==0){
            pricevalue = pricevalue+".0"
        }
        while(pricevalue.includes("$")){
            pricevalue = pricevalue.replace('$','');
        }

		while(pricevalue.includes("€")){
            pricevalue = pricevalue.replace('€','');
        }
        while(pricevalue.includes(",")){
            pricevalue = pricevalue.replace(',','@');
        }
        while(pricevalue.includes(".")){
        pricevalue = pricevalue.replace('.',',');
        }
           
        while(pricevalue.includes("@")){
        pricevalue = pricevalue.replace('@','.');
        }
           
        return pricevalue.trim();
	} catch (e) {
		return "0,00";
	}   
}

module.exports.convertToEuroWithoutPrecision = (pricevalue) => {
    try {
        
        while(pricevalue.includes("$")){
            pricevalue = pricevalue.replace('$','');
        }

		while(pricevalue.includes("€")){
            pricevalue = pricevalue.replace('€','');
        }
        while(pricevalue.includes(",")){
            pricevalue = pricevalue.replace(',','@');
        }
        while(pricevalue.includes(".")){
        pricevalue = pricevalue.replace('.',',');
        }
           
        while(pricevalue.includes("@")){
        pricevalue = pricevalue.replace('@','.');
        }
           
        return pricevalue.trim();
	} catch (e) {
        console.log("Error : ",e);
		return "0,00";
	}   
}

module.exports.convertToNumber = (pricevalue) => {
    try {
        
        while(pricevalue.includes("$")){
            pricevalue = pricevalue.replace('$','');
        }

		while(pricevalue.includes("€")){
            pricevalue = pricevalue.replace('€','');
        }
        
        while(pricevalue.includes(",")){
            pricevalue = pricevalue.replace(',','');
        }

        return pricevalue.trim();
	} catch (e) {
        console.log("Error : ",e);
		return "0,00";
	}   
}