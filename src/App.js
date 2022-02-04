import React, {useState} from 'react'
import './App.css';

import 'bootstrap/dist/css/bootstrap.css'

//import emailJS
import emailJs from 'emailjs-com'

import * as EmailValidator from 'email-validator';

import { computedTypesResolver } from '@hookform/resolvers/computed-types'

import Schema, {string} from 'computed-types'


import {Container, Col, Row} from 'react-bootstrap'
import { useForm } from 'react-hook-form';

const templateID = process.env.REACT_APP_TEMPLATE_ID;
const serviceID = process.env.REACT_APP_SERVICE_ID
const userID = process.env.REACT_APP_USER_ID;

function App() {

  // define states to store values when user fills the form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  function Email(input: unknown): string {
    if (!EmailValidator.validate(String(input))) {
      throw new TypeError(`Invalid email address: "${input}"`);
    }
  
    return input;
  }

  // create a schema for input fields
  const schema = Schema({
    name: string.min(1).error('Name field is required'),
    email: Email,
    message: string.min(1).error('message field is required'),
    subject: string.min(1).error('subject field is required'),

  });


  const { register, handleSubmit, formState: {errors},} = useForm({
    resolver: computedTypesResolver(schema)

  })

  const templateParams = {
    name: name,
    email: email,
    message: message,
    subject: subject,
  }

  function sendEmail(e){
      emailJs.send(
        serviceID,
        templateID,
        templateParams,
        userID,

      ).then(
        function (response) {
          console.log('SUCCESS!', response.status, response.text);
          response.status(400).send({ message: 'message sent' });
        },
        function (error) {
          console.log('FAILED...', error);
        }

      ).catch((err)=> console.log(`cannot send${err}`))

      setEmail('')
      setName('')
      setSubject('')
      setMessage('')
  }
  console.log(templateID)

  return (
  
      <Container>
        <Row className="mb-5 mt-3">
          <Col lg="8">
            <h1 className='display-4 mb-4 text-white'>
              Contact me
            </h1>
          </Col>
        </Row> 
        <Row className="sec_sp">
          <Col lg='5' className="mb-5 text-white">
            <h3 className="color_sec py-4 ">
              Get in Touch
            </h3>
            <address>
              <strong>Email: karira.charles@gmail.com</strong>
              <br />
              <br />

              <strong> Phone: +254 718385412</strong>
            </address>
          </Col>

          <Col lg='7' className="d-flex align-items-center">
            <form className="contact__form w-100" onSubmit={handleSubmit(sendEmail)}>
              <Row>
                <Col lg='6' className='form-group'>
                  <label className="text-white mb-2">Your Name
                  
                  </label>
                  <input className='form-control' id='name' name="name"
                  placeholder='Name'
                  type="text"
                  // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('name', { required: true })} 
              value={name}
              onChange={(e)=> setName(e.target.value)}
              />

              <p class="text-danger mb-2">{errors.name?.message}</p>

                </Col>
                <Col lg='6' className='form-group'>
                <label className="text-white mb-2">Your Email
                  
                  </label>
                  <input className='form-control rounded-0' id='email' name="email"
                  placeholder='Email'
                  type="email" 
                  // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('email', { required: true })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />

            <p className="text-danger mb-2">{errors.email?.message}</p>

                </Col>
              </Row>

              <Row>
               
                <Col lg='9' className='form-group'>
                <label className="text-white mb-2">Subject
                  
                  </label>
                  <input className='form-control rounded-0' id='subject' name="subject"
                  placeholder='Enter Subject'
                  type="text" 
                  // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('subject', { required: true })}
              
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              />

              <p class="text-danger mb-2">{errors.subject?.message}</p>

                </Col>
              </Row>
              <label className="text-white mb-2">Message
                  
                  </label>

              <textarea className='form-control rounded-0' id="message" name='message'
              placeholder='Message' rows='5' type="text"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('message', { required: true })}
              
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              >

              </textarea>
              <p class="text-danger mb-2">{errors.message?.message}</p>
              <br />
              <Row>
                <Col  lg='12' className='form-group'>
                  <button className='btn ac_btn' type="submit">Send</button>
                </Col>
              </Row>

            </form>
          </Col>
        </Row>

      </Container>
    
  );
}

export default App;
