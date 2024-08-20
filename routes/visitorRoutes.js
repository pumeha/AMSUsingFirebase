const express = require('express');
const firebaseConfig = require('../index');


const {initializeApp} = require('firebase/app');
const {getFirestore,doc,getDoc, addDoc,updateDoc, collection, getDocs} = require('firebase/firestore');
const { time } = require('console');


const router = express.Router();
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

router.post('/add',async (req,res)=>{
    const {name,address,phonenumber,
        purpose,whoToSee,floor,time,
        tagNo,uid} = req.body;

        //check if uid is a receptionist
        const role = await checkUserExists(uid);
        console.log(role);
        //const timeValue = getTime();
        
        if(role === 'receptionist'){
            try {
                const collectionRef = collection(db,'visitors');
                await addDoc(collectionRef,
                  {name:name,address: address,phonenumber: phonenumber,purpose: purpose,
                      whoToSee: whoToSee,floor: floor,tagNo : tagNo,time:time
                });  
                res.status(201).send('Successfully');
              } catch (error) {
                  if (error.code === 'auth/invalid-credential') {
                      res.status(404).send({ error: 'auth/invalid-credential' });
                  }else {
                      res.status(500).send({ error: error.message,code: error.code });
                  }
              }
        }else{
            res.status(404).send('Invalid User');
        }
    
    

});

router.post('/view',async (req,res) =>{
    const {uid} = req.body;
    const user = await checkUserExists(uid);
    if (user != null) {
        try {
            const colRef = collection(db,'visitors');
            const docSnap =   await getDocs(colRef);
            if (!docSnap.empty) {
              const data = await docSnap.docs.map(
                doc =>({
                    id: doc.id,
                    ...doc.data()

                    

                })
              )
              console.log('document exist');
              
              res.status(201).json(data);
            }else{
              res.status(404).send('No data found');
            }
          } catch (error) {
              console.log(error.message);
              res.status(500).send({ error: error.message,code: error.code });
          }
    } else {
        res.status(404).send('Invalid User');
    }
    
});

router.post('/update',async (req,res)=>{
    const action = req.body.action;
    if (action == "status") {
        const {uid,status} = req.body;
    try {
        docRef = doc(db,'visitors',uid);
      await updateDoc(docRef, {status: status});
      res.status(201).send('Successfully updated');
    } catch (error) {
        res.status(500).send({error: error.message,code: error.code});
    }
    }
});

async function checkUserExists(uid) {
    docRef = doc(db,'userInfo',uid);
    const docSnap = await getDoc(docRef);
        if (docSnap.exists) {
            const data = docSnap.data();
            return data.role;
        } else {
            return null;
        }
}

function getTime() {
    const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
const ampm = hours >= 12 ? 'PM' : 'AM';

// Convert 24-hour format to 12-hour format
hours = hours % 12;
hours = hours ? hours : 12; // Convert 0 (midnight) to 12

const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
return time;

}

module.exports = router;