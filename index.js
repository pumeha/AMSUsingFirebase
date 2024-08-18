
const firebaseConfig = {
    apiKey: "AIzaSyDRGJ4_fUs_D2XFz4VxAHYrjY2z3FVw3ug",
    authDomain: "vams-181c6.firebaseapp.com",
    projectId: "vams-181c6",
    storageBucket: "vams-181c6.appspot.com",
    messagingSenderId: "499943126450",
    appId: "1:499943126450:web:25103cdbd36c3939cfa0ab"
  };
  
const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword,signOut } = require('firebase/auth');
const {getFirestore,doc,setDoc,getDoc} = require('firebase/firestore');


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Initialize Express
const app = express();
const port = process.env.PORT || 8080;

// Permit JSON through Express
app.use(express.json());

// Testing signup route
app.post('/signup', (req, res) => {
  const { email, password,role } = req.body;

 createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        setUserRole(user.uid,role);
      res.status(201).send(user.uid);
      console.log(user.uid );
    })
    .catch((error) => {
      res.status(404).send({ error: error.message });
    });
});

app.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    try {
        const userCredential = 
        await  signInWithEmailAndPassword(auth,email,password).catch((error)=>{
                res.status(404).send({error: error.message});
        });
        const uid = userCredential.user.uid;
        console.log(uid);
        
    const role = await getUserRole(uid);
    console.log(role);
    
    const response = {uid : uid,role : role};
    res.status(201).send(response);
    } catch (error) {
       
        res.status(404).send({error: error.message});
   };
});

app.post('/signout',(req,res) =>{
    signOut(auth).then(() => res.status(201).send('Signed Out'))
    .catch((error) =>res.status(400).send({error: error.message}));
    
});

app.listen(port, () => console.log(`Listening on port ${port}`));

async function setUserRole(userId,role){
    console.log('setUserRole function is running');
    
try {
    const docRef = doc(db,'userInfo',userId);
    await setDoc(docRef,{role : role});
        console.log(`User role ${role} set successfully for user ${userId}`);
} catch (error) {
    console.error('error setting user role',error);
    
}

}


async function getUserRole(userId) {
    try {
        const docRef = doc(db,'userInfo',userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists) {
            const data = docSnap.data();
            return data.role;
        } else {
            console.error('No such document');
            return null;
        }

    } catch (error) {
        console.error('Error from getUserRole ',error);
        return null;
    }
}