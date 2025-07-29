import './ChatPage.css'
import { Button, TextField, Divider } from '@mui/material'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export default function ChatPage() {

    const contacts = [
        { id: 1, name: "John" },
        { id: 2, name: "Sarah" },
        { id: 3, name: "Mike" },
        { id: 4, name: "Emma" },
        { id: 5, name: "Alex" },
        { id: 6, name: "Olivia" },
        { id: 7, name: "David" },
        { id: 8, name: "Sophia" },
        { id: 9, name: "James" },
        { id: 10, name: "Mia" }
    ];

    const messageHistory = {
        1: [
            { id: 1, text: "Hey John, how's it going?", type: "sent" },
            { id: 2, text: "Hey! I'm doing great, thanks for asking!", type: "received" },
            { id: 3, text: "That's awesome to hear!", type: "sent" }
        ],
        2: [
            { id: 1, text: "Hi Sarah!", type: "sent" },
            { id: 2, text: "Hello! How was your weekend?", type: "received" }
        ],
        3: [
            { id: 1, text: "Mike, are we still on for tomorrow?", type: "sent" },
            { id: 2, text: "Yes! See you at 3pm", type: "received" }
        ]
    };

    const [selectedContact, setSelectedContact] = useState(null);

    function handleContactClick(contact) {
        setSelectedContact(contact);
    }

    function handleSend(formData) {
        const message = formData.get("message");
        // Send Message
    }

    const currentMessages = selectedContact ? messageHistory[selectedContact.id] || [] : [];

    return (
        <>
        <div className='chatLayout'>
            <div className='sidebar'>
                <h2>Messages</h2>
                <div className='contactsList'>
                    {contacts.map(contact => {
                        return (
                        <div 
                            key={contact.id} 
                            className={`contact ${selectedContact?.id === contact.id ? 'active' : ''}`}
                            onClick={() => handleContactClick(contact)}
                        >
                            <div className='contactPhoto'></div>
                            <div className='contactName'>{contact.name}</div>
                        </div>
                            )
                    })}
                </div>
            </div>
            <div className='mainChat'>
                {selectedContact ? (
                    <>
                        <div className='chatHeader'>
                            <h3>{selectedContact.name}</h3>
                        </div>
                        <div className='messagesContainer'>
                            {currentMessages.length > 0 ? (
                                currentMessages.map(message => (
                                    <div key={message.id} className={message.type === 'sent' ? 'sentMessage' : 'receivedMessage'}>
                                        {message.text}
                                    </div>
                                ))
                            ) : (
                                <div className='emptyChat'>
                                    <p>No messages yet. Start a conversation!</p>
                                </div>
                            )}
                        </div>
                        <form className='sendControl' action={handleSend}>
                            <TextField 
                                autoComplete="off" 
                                name="message" 
                                size='small' 
                                sx={{'& .MuiOutlinedInput-root': { borderRadius: '10px'  }}}
                            />
                            <Button type="submit" sx={{ px: 2, minWidth: 'auto' }} variant='contained'>
                                <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className='emptyState'>
                        <h3>Select a conversation</h3>
                        <p>Choose a contact from the sidebar to start messaging</p>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}