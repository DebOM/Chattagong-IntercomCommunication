
import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import Client from './index2.jsx'
import moment from 'moment'



class SupportDesk extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      messages: [],
      user: '',
      onlineClients:[],
      offlineClients:[],
    }
    this.messageSubmit = this.messageSubmit.bind(this);
    this.joinRoom = this.joinRoom.bind(this);

  }
joinRoom = value => {
  console.log('get component was clicked!!!!')
  console.log('get component was clicked!!!! ' + value.id)
  this.socket.join(value.id);
  socket.to(value.id).emit('message', 'I just met you');
}
messageSubmit = event => {
  const body = event.target.value
  if (event.keyCode === 13 && body) {
    const message = {
      body,
      from: this.state.user,
      time: moment().format('LT'),
      img: null,
    }
    // this.setState({ messages: [...this.state.messages, message] })
    this.socket.emit('message', message)
    event.target.value = ''
  }
}

// componentWillMount(){
//   this.socket.emit('get clients');
// }

componentDidMount(){
  this.socket = io('/')
  this.socket.emit('get clients');
  this.socket.on('clients', data => {
    this.setState({ onlineClients: data.activeClients }, () => {
      console.log('NUMBER OF OPEN ROOMS: ', this.state.onlineClients)
    })
  })
  this.socket.emit('add helpDesk to rooms');
  // this.socket.emit('get clients');
console.log("here are all the room sockets ", this.state.onlineClients.length)
}

  render(){
    const messages = this.state.messages.map((message, index) => {
    // const temp =  'http://dummyimage.com/250x250/000/fff&text=' + message.from.charAt(0).toUpperCase()
    // const img = message.img ? <img src={message.img} width='200px' /> : <img src={temp} width='200px' />
    return <div className='msgFormat' key={index}>
              <b>{message.from}: </b>{message.body} {message.time} {message.img}
            </div>
  })

  const activeClints = this.state.onlineClients.map((client, index) => {
    return <div key={index}>
              <button className="roomButton" onClick={() => this.joinRoom(client)}><span><b>{client.clientName}:</b> </span>{client.id.slice(-4)} {client.room} </button>
            </div>
  })
    return (
      <div className="_window">
        <div className='_windowHeader'>
          <p>Conversations</p>
          <span>with Chattagong</span>
          <button className="_logButton">LogIn</button>
        </div>
          <div className='_windowBody'>
            <div className= "_windowLeft">
              <div className="_onlineClients">
                <h3>Currently Online Clients : Click A Client To Help</h3>
                {activeClints}
              </div>
              <div className="_offlineClients">
                <h3>Currently offline Clients</h3>
              <Client />
              </div>
            </div>
            <div className="_windowRight">
              <div className="_chatWindow">
                <h3>This is the Chat window</h3>
                <div className='chatArea'>
                  Messages display here!
                  {messages}
                </div>
                <textarea className='_textArea' placeholder="Send a message…" onKeyUp={this.messageSubmit}></textarea>
              </div>
            </div>
          </div>
        <div className="_windowFooter">
          I am the footer!
        </div>
      </div>
    )
  }

}

render(<SupportDesk />, document.getElementById('support'));
