
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from "../../config/firebase.json";

var firebasedb=null;

try{
    const firebaseApp = initializeApp(firebaseConfig);
    firebasedb = getFirestore(firebaseApp);
}catch(e){
    console.log("Failed to connect to firebase",e);
}

export default firebasedb;