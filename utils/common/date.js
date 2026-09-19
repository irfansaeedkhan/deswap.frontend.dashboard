import moment from "moment";

module.exports.myRewardsDate = (date)=>{
    try{
        let currentDate =  moment(date).format("Do, MMM YYYY (hh:mm:ss A)");
        return currentDate;
        //
    }catch(e){
        return "";
    }
}

module.exports.myRewardsFormated = (date,format="YYYY-MM-DD hh:mm:ss")=>{
    try{
        let currentDate = moment(date,format).format("Do, MMM YYYY (hh:mm:ss A)");
        return currentDate;
    }catch(e){
        return "";
    }
}

module.exports.convertDateToLocal = (date)=>{
    try{
        let currentDate = moment(date);
        return currentDate;
    }catch(e){
        return "";
    }
}

module.exports.convertDateToFormatedLocal = (date)=>{
    try{
        let currentDate = moment(date).format("Do MMM YYYY (hh:mm:ss A)");
        return currentDate;
    }catch(e){
        return "";
    }
}

module.exports.firebaseDate = ()=>{
    try{
        let currentDate = moment().format("Do_MM_YYYY_hh:mm:sss");
        return currentDate;
    }catch(e){
        return "";
    }
}

module.exports.firebaseDate = ()=>{
    try{
        let currentDate = moment().format("Do_MM_YYYY_hh:mm:sss");
        return currentDate;
    }catch(e){
        return "";
    }
}

module.exports.firebaseIDDate = ()=>{
    try{
        let currentDate = moment().format("Do_MM_YYYY_hh:mm:ss");
        return currentDate;
    }catch(e){
        return "";
    }
}

module.exports.claimmedDate = (date, noOfmonth, interval)=>{
    try{
        let currentDate =  moment(date).add(noOfmonth, interval).format("Do, MMM YYYY (hh:mm:ss A)");
        return currentDate;
        //
    }catch(e){
        return "";
    }
}

module.exports.claimmedDateFormated = (date,format="Do, MMM YYYY (hh:mm:ss A)")=>{
    try{
        let currentDate = moment(date,format);
        return currentDate;
    }catch(e){
        return "";
    }
}

module.exports.relaseDateFormat = (diffDuration)=>{
    try{
        let formatedDate = "";
        if(diffDuration.years() > 0){
            formatedDate = formatedDate+diffDuration.years()+" year, "
        }
        if(diffDuration.months()>0){
            if(diffDuration.months()==1){
                formatedDate = formatedDate+diffDuration.months()+" month, "
            }else{
                formatedDate = formatedDate+diffDuration.months()+" months, "
            }
        }
        if(diffDuration.days()>0){
            //
            if(diffDuration.days()==1){
                formatedDate = formatedDate+diffDuration.days()+" day "
            }else{
                formatedDate = formatedDate+diffDuration.days()+" days "
            }
        }

        if(diffDuration.hours()>0){
            //
            if(diffDuration.hours()==1){
                formatedDate = formatedDate+diffDuration.hours()+":"
            }else{
                if(Number(diffDuration.hours())<10){
                    formatedDate = formatedDate+("0"+diffDuration.hours())+":"
                }else{
                    formatedDate = formatedDate+diffDuration.hours()+":"
                }
            }
        }

        if(diffDuration.minutes()>0){
            //
            if(diffDuration.minutes()==1){
                formatedDate = formatedDate+("0"+diffDuration.minutes())
            }else{
                if(Number(diffDuration.minutes())<10){
                    formatedDate = formatedDate+("0"+diffDuration.minutes())
                }else{
                    formatedDate = formatedDate+diffDuration.minutes()
                }
                
            }
        }

        return formatedDate;
    }catch(e){
        return "";
    }
}
