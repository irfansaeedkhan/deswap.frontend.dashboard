import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, addDoc} from "firebase/firestore"; 


const readDocument = async (collectionName, documentID, data)=>{
    try{
        const documentFetched = await getDoc(doc(collectionName,documentID))
        return documentFetched
        //
    }catch(e){
        console.log("Failed to read document : ",e,e.message);
        return null;
    }
}

const insertDocument = async (collectionName, documentID, data)=>{
    try{
        //
        const documentInserted = await setDoc(doc(collectionName,documentID) ,data, { merge: true })
        return documentInserted
    }catch(e){
        console.log("Failed to insert document : ",e,e.message);
        return null;
    }
}

const deleteDocument = async (collectionName, documentID, data)=>{
    try{
        //
        const documentFetched = await deleteDoc(doc(collectionName), documentID,data)
        return documentFetched
    }catch(e){
        console.log("Failed to delete document : ",e,e.message);
        return null;
    }
}

const updatedDocument = async (collectionName, documentID, data)=>{
    try{
        //
        const documentFetched = await updateDoc(doc(collectionName,documentID) ,data)
        return documentFetched
        
    }catch(e){
        console.log("Failed to update document : ",e,e.message);
        return null;
    }
}
module.exports.readDocument = readDocument;
module.exports.insertDocument = insertDocument;
module.exports.deleteDocument = deleteDocument;
module.exports.updatedDocument = updatedDocument;