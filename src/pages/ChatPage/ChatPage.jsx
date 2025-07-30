import './ChatPage.css'
import { Button, TextField } from '@mui/material'
import { faPaperPlane, faInbox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useLocation } from 'react-router-dom'
import { useSocketSetup } from '../../hooks/useSocketSetup'
import axios from 'axios'
import { io } from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

const socket = io(URL, { withCredentials: true });

export default function ChatPage() {
  const { getToken } = useAuth()

  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const [messageHistory, setMessageHistory] = useState({})

  const location = useLocation();
  const userId = useSocketSetup(getToken, socket, BACKEND_URL);
  const partnerId = location.state?.userId; 

  async function handleContactClick(partner) {
    setSelectedContact(partner)
    try {
      const token = await getToken()
      const { data } = await axios.get(
        `${BACKEND_URL}/api/messages?userId2=${partner.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setMessageHistory(prev => ({
        ...prev,
        [partner.userId]: data
      }));
    } catch (error) {
      
    }
  }

  async function handleSend(formData) {
    const message = formData.get('message')
    if (!message || !selectedContact) return

    try {
      const token = await getToken()
      await axios.post(`${BACKEND_URL}/api/messages`, {
        content: message,
        senderId: userId,
        receiverId: selectedContact.userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const existingPartner = partners.find(p => p.partner.userId === selectedContact.userId);
    
        if (existingPartner) {
        setPartners(prev => {
            const otherPartners = prev.filter(p => p.partner.userId !== selectedContact.userId);
            const updatedPartner = {...existingPartner, lastMessage: {content: message}};
            return [updatedPartner, ...otherPartners]; 
        });
        } else {
        setPartners(prev => [{
            partner: selectedContact,
            lastMessage: { content: message }
        }, ...prev]);
    }
    } catch (error) {
      
    }
  }

  const currentMessages = selectedContact
    ? messageHistory[selectedContact.userId] || []
    : []

  useEffect(() => {
    const container = document.querySelector('.messagesContainer');
    if (container && currentMessages.length > 0) {
        container.scrollTop = container.scrollHeight;
    }
    }, [currentMessages, selectedContact]);

  useEffect(() => {
  if (!userId) return;

  socket.on('newMessage', (message) => {
    const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
    
    // Update message history
    setMessageHistory(prev => ({
      ...prev,
      [partnerId]: [...(prev[partnerId] || []), {
        id: message.id,
        text: message.content,
        type: message.senderId === userId ? 'sent' : 'received'
      }]
    }));

    // If it's a received message, update/add contact to sidebar
    if (message.senderId !== userId) {
      setPartners(prev => {
        const existingPartner = prev.find(p => p.partner.userId === partnerId);
        if (existingPartner) {
          // Update existing contact
          const otherPartners = prev.filter(p => p.partner.userId !== partnerId);
          const updatedPartner = {...existingPartner, lastMessage: {content: message.content}};
          return [updatedPartner, ...otherPartners];
        } else {
          // Add new contact to sidebar
          return [{
            partner: {
              userId: message.senderId,
              firstName: message.sender.firstName,
              lastName: message.sender.lastName || ''
            },
            lastMessage: { content: message.content }
          }, ...prev];
        }
      });
    }
  });

  return () => socket.off('newMessage');
}, [userId]);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const token = await getToken()
        const { data } = await axios.get(
          `${BACKEND_URL}/api/messages/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setPartners(data);
      } catch (err) {
        
      } finally {
        setLoading(false)
      }
    }
    fetchPartners()
  }, [])

  useEffect(() => {
  if (partnerId && !selectedContact && !loading) {
    const partnerFromUrl = partners.find(p => p.partner.userId === parseInt(partnerId));
    if (partnerFromUrl) {
      handleContactClick(partnerFromUrl.partner);
    } else {
      fetchNewContact(partnerId);
    }
  }
}, [partnerId, partners, selectedContact, loading]);

async function fetchNewContact(userId) {
  try {
    const token = await getToken();
    const { data } = await axios.get(`${BACKEND_URL}/api/profiles/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Set as selected contact (no message history yet)
    setSelectedContact(data);
    setMessageHistory(prev => ({
      ...prev,
      [data.userId]: [] 
    }));
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
}

  return (
    <div className='chatLayout'>
      <div className='sidebar'>
        <h2><FontAwesomeIcon icon={faInbox} color='#4166F5' /> Inbox</h2>
        <div className='contactsList'>
          {loading ? (
            <p>Loading contacts...</p>
          ) : partners.length > 0 ? (
            partners.map(contact => (
              <div
                key={contact.partner.userId}
                className={`contact ${
                  selectedContact?.userId === contact.partner.userId
                    ? 'active'
                    : ''
                }`}
                onClick={() => handleContactClick(contact.partner)}
              >
                <div className='contactPhoto'></div>
                <div className='contactDetails'>
                  <div className='contactName'>
                    {`${contact.partner.firstName} ${contact.partner.lastName}`|| 'Unnamed'}
                  </div>
                  <div className='lastMessagePreview'>
                    {contact.lastMessage?.content
                      ? contact.lastMessage.content.length > 30
                        ? contact.lastMessage.content.slice(0, 30) + '…'
                        : contact.lastMessage.content
                      : 'No messages yet'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No contacts found.</p>
          )}
        </div>
      </div>
      <div className='mainChat'>
        {selectedContact ? (
          <>
            <div className='chatHeader'>
              <h3>{`${selectedContact.firstName} ${selectedContact.lastName}` || 'Contact'}</h3>
            </div>
            <div className='messagesContainer'>
              {currentMessages.length > 0 ? (
                currentMessages.map(message => (
                  <div
                    key={message.id}
                    className={
                      message.type === 'sent'
                        ? 'sentMessage'
                        : 'receivedMessage'
                    }
                  >
                    {message.text}
                  </div>
                ))
              ) : (
                <div className='emptyChat'>
                  <p>No messages yet. Start a conversation!</p>
                </div>
              )}
            </div>
            <form
              className='sendControl'
              onSubmit={e => {
                e.preventDefault()
                handleSend(new FormData(e.target))
                e.target.reset()
              }}
            >
              <TextField
                autoComplete='off'
                name='message'
                size='small'
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '10px' }
                }}
              />
              <Button
                type='submit'
                sx={{ px: 2, minWidth: 'auto' }}
                variant='contained'
              >
                <FontAwesomeIcon icon={faPaperPlane} />
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
  )
}