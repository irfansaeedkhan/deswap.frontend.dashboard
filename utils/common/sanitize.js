import xss from "xss";

const SanitizeRequestObject = async (inputRequest)=>{
    try{
        if(typeof inputRequest!="object"){
            return inputRequest
        }
        for(let index in inputRequest){
            if((typeof inputRequest[index] == "object")&& (inputRequest[index]!=null)&&(inputRequest[index]!=undefined)){
                inputRequest[index] = await SanitizeRequestObject(inputRequest[index])
            }else if((typeof inputRequest[index] == "string")&&(inputRequest[index]!=null)&&(inputRequest[index]!=undefined)&&(inputRequest[index].trim()!="")){
                inputRequest[index] = await xss(inputRequest[index],{
                    whiteList: {},
                    stripIgnoreTag: true,
                    stripIgnoreTagBody: [],
                  })
            }else if((typeof inputRequest[index] == "number")&&(inputRequest[index]!=null)&&(inputRequest[index]!=undefined)){
                inputRequest[index] = inputRequest[index]
            }else if((typeof inputRequest[index] == "boolean")&&(inputRequest[index]!=null)&&(inputRequest[index]!=undefined)){
                inputRequest[index] = inputRequest[index]
            }else{
                inputRequest[index] = {}
            }
        }
        return inputRequest
    }catch(e){
        console.log("Failed to santize ",e)
        return {}
    }
}
module.exports.SanitizeRequestObject = SanitizeRequestObject
module.exports.SanitizeRequestString = async (inputString)=>{
    try{
        if(typeof inputString == "string"){
            let santizeInput = await xss(inputString, {
                whiteList: {},
                stripIgnoreTag: true,
                stripIgnoreTagBody: [],
            })
            return santizeInput
        }else if(typeof inputString == "number"){
            return inputString
        }else if(typeof inputString == "boolean"){
            return inputString
        }else {
            return ''
        }
    }catch(e){
        console.log("Failed to santize ",e)
        return ''
    }
}

module.exports.SanitizeRequestStringSync = (inputString)=>{
    try{
        
        if(typeof inputString == "string"){
            let santizeInput = xss(inputString, {
                whiteList: {},
                stripIgnoreTag: true,
                stripIgnoreTagBody: [],
            })
            return santizeInput
        }else if(typeof inputString == "number"){
            return inputString
        }else if(typeof inputString == "boolean"){
            return inputString
        }else {
            return ''
        }
    }catch(e){
        console.log("Failed to santize ",e)
        return ''
    }
}