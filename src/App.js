import React, { useRef, useState } from 'react';
import './App.css';
import app from "firebase"
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import Button from 'react-bootstrap/Button';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import 'bootstrap/dist/css/bootstrap.min.css'
firebase.initializeApp({
    apiKey: "AIzaSyB-A0AS6PmNEuY7xjzXO7oheV1rVE6NDNY",
    authDomain: "webtech-23f42.firebaseapp.com",
    projectId: "webtech-23f42",
    storageBucket: "webtech-23f42.appspot.com",
    messagingSenderId: "975371776690",
    appId: "1:975371776690:web:75ad7d9eb25f9a66c2cfab",
    measurementId: "G-PXQ3BKM6D5",
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function FileInput() {


    // customBtn.addEventListener("click", function() {
    //   realFileBtn.click();
    // });


    const handleChanges = async(files) => {
        const realFileBtn = document.getElementById("real-file");
        const customBtn = document.getElementById("custom-button");
        const customTxt = document.getElementById("custom-text");



        if (realFileBtn.value) {
            customTxt.innerHTML = realFileBtn.value.match(
                /[\/\\]([\w\d\s\.\-\(\)]+)$/
            )[1];
            const file = files[0];
            const storageRef = app.storage().ref();
            const fileRef = storageRef.child(file.name);
            await fileRef.put(file);
        } else {
            customTxt.innerHTML = "No file chosen, yet.";
        }
    }
    return ( <
        div className = "file-input-container" >
        <
        input type = "file"
        id = "real-file"
        hidden = "hidden"
        onChange = {
            (e) => handleChanges(e.target.files)
        }
        /> <
        button type = "button"
        id = "custom-button"
        onClick = {
            () => document.querySelector("#real-file").click()
        } > CHOOSE A FILE < /button> <
        span id = "custom-text" > No file chosen, yet. < /span> < /
        div >
    )
}



function App() {

    const [user] = useAuthState(auth);

    return ( <
            div className = "App" >
            <
            header >
            <
            h1 > 🔥💬 < /h1> { user ? < FileInput / >: null
        } <
        SignOut / >
        <
        /header>

    <
    section > { user ? < ChatRoom / > : < SignIn / > } <
        /section>

    <
    /div>
);
}

function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return ( <
        >
        <
        Button className = "sign-in"
        onClick = { signInWithGoogle } > Sign in with Google < /Button>

        <
        p className = "center" > Do not violate the community guidelines or you will be banned
        for life! < /p> < / >
    )

}

function SignOut() {
    return auth.currentUser && ( <
        Button className = "sign-out"
        onClick = {
            () => auth.signOut()
        } > Sign Out < /Button>
    )
}


function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');


    const sendMessage = async(e) => {
        e.preventDefault();


        const { uid, displayName } = auth.currentUser;
        console.log(auth.currentUser)
        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            displayName
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return ( < >
            <
            main >


            {
                messages && messages.map((msg, index) => < ChatMessage key = { msg.id }
                    photoURL = { `./assets/user-${index}.png` }
                    message = { msg }
                    />)}

                    <
                    span ref = { dummy } > < /span>

                    <
                    /main>

                    <
                    form onSubmit = { sendMessage } >

                    <
                    input value = { formValue }
                    onChange = {
                        (e) => setFormValue(e.target.value)
                    }
                    placeholder = "Send a message" / >

                    <
                    button type = "submit"
                    disabled = {!formValue } > 🕊️ < /button>

                    <
                    /form> < / >
                )
            }


            function ChatMessage(props) {
                const { text, uid, displayName } = props.message;
                const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

                return ( < >
                    <
                    div className = { `message ${messageClass}` } >
                    <
                    img src = { `https://ui-avatars.com/api?name=${displayName}` }
                    /> <
                    p > { text } < /p> < /
                    div > <
                    />)
                }


                export default App;