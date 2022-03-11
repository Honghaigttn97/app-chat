import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'

const Channel = ({ user = null, db = null }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const { uid, displayName, photoURL } = user;

    useEffect(() => {
        if (db) {
            const unsubcribe = db
                .collection('message')
                .orderBy('createdAt')
                .limit(100)
                .onSnapshot(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    console.log(data);
                    setMessages(data)
                })
            return unsubcribe
        }

    }, [db]);

    const handleOnChange = e => {
        setNewMessage(e.target.value)
    }
    const handleOnSubmit = e => {
        e.preventDefault();
        if (db) {
            db.collection('message').add({
                text: newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName
            })
        }
        setNewMessage('')
    }

    return (
        <>
            <ul>
                {
                    messages.map(x => {
                        return <li key={x?.id}>{x?.text}</li>
                    })
                }
            </ul>
            <form onSubmit={handleOnSubmit}>
                <input type="text" value={newMessage} onChange={handleOnChange} />
                <button type='submit' disabled={!newMessage} >Send</button>
            </form>
        </>
    )
}

export default Channel