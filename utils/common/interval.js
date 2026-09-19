module.exports.clearAllInterval = async ()=>{
	try {
		let intervalValue = await setInterval(()=>{ }, 1000);
        let countInterval = intervalValue != undefined ? intervalValue : 0;
        for (let a = 0; a <= countInterval; a++) {
        clearInterval(a);
        }
	} catch (e) {
		throw e;
	}
}

