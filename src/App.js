import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useEffect, useState } from 'react';
// import Button from './components/Button';
import Channel from './components/Channel';
import './App.css';

firebase.initializeApp({
  apiKey: "AIzaSyDDrglGtjZySVbwBuan1iky5bqLOD-8Pxc",
  authDomain: "chat-df0c4.firebaseapp.com",
  databaseURL: "https://chat-df0c4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-df0c4",
  storageBucket: "chat-df0c4.appspot.com",
  messagingSenderId: "604459581701",
  appId: "1:604459581701:web:99154fda0a051d4a83776c"
})

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
      if (initializing) {
        setInitializing(false)
      }
    })
    return unsubscribe
  }, [initializing]);



  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  }
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  }

  if (initializing) return "Loading..."

  return (
    <div className='container'>
      <div className='div-left'></div>
      <div className='div-center'>
        {user ? <><button className='btn-login' onClick={signOut}>Sign out</button>
          <Channel user={user} db={db} /> </> : <button className='btn-login' onClick={signInWithGoogle} >Sign in with Google</button>}
      </div>
      <div className='div-right'></div>

    </div>
  );
}

export default App;
