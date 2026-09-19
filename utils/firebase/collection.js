import { collection, getDocs } from 'firebase/firestore';

const checkCollection = async (firebase,collectionName)=>{
    try{
        
        //
    }catch(e){
        console.log("Failed to upload file : ",e);
    }
}

const createCollection = async (firebase,collectionName)=>{
    try{
        //
        
    }catch(e){
        console.log("Failed to upload file : ",e);
    }
}

const deleteCollection = async (firebase,collectionName)=>{
    try{
        //
        
    }catch(e){
        console.log("Failed to upload file : ",e);
    }
}

const readCollection = async (firebase,collectionName)=>{
    try{
        //
        const firebaseCollection = await collection(firebase,collectionName)
        return firebaseCollection;
    }catch(e){
        console.log("Failed to read collection : ",collectionName,"Error : ",e.message);
        return null;
    }
}
module.exports.checkCollection = checkCollection;
module.exports.createCollection = createCollection;
module.exports.deleteCollection = deleteCollection;
module.exports.readCollection = readCollection;