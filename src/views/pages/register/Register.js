import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate()
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  }

  const validatePassword = (password) => {
    return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
  }
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const cnfPassword = useRef()
  const addPosts = async () => {
    if (username.current.value === '') {
      displayAlertMessage('warning', 'Enter Username', true)
    } else if (email.current.value === '') {
      displayAlertMessage('warning', 'Enter Email', true)
    } else if (!validateEmail(email.current.value)) {
      displayAlertMessage('warning', 'Email not valid', true)
    } else if (password.current.value === '') {
      displayAlertMessage('warning', 'Enter Password', true)
    } else if (cnfPassword.current.value === '') {
      displayAlertMessage('warning', 'Enter Repeat Password', true)
    } else {
      displayAlertMessage('', '', false)
      try {
        const res = await fetch('https://localhost:7123/api/user/registeruser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
          }), // Replace with your data
        })

        if (!res.ok) {
          throw new Error('Network response was not ok')
        } else {
          navigate('/login')
        }

        const data = await res.json()
        setResponse(data)
      } catch (error) {
        setError(error)
      }
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (password.current.value === '') {
      displayAlertMessage('warning', 'Enter Password', true)
      return
    } else {
      displayAlertMessage('', '', false)
    }

    if (name === 'password' && !validatePassword(value)) {
      displayAlertMessage(
        'warning',
        'Password should be minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        true,
      )
      return
    } else {
      displayAlertMessage('', '', false)
    }

    if (cnfPassword.current.value === '') {
      displayAlertMessage('warning', 'Enter Repeat Password', true)
      return
    } else {
      displayAlertMessage('', '', false)
    }

    if (name === 'cnfPassword' && !validatePassword(value)) {
      displayAlertMessage(
        'warning',
        'Repeat Password should be minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        true,
      )
      return
    } else {
      displayAlertMessage('', '', false)
    }

    if (
      password.current.value !== '' &&
      cnfPassword.current.value != '' &&
      password.current.value !== cnfPassword.current.value
    ) {
      displayAlertMessage('warning', 'Password and Repeat Password not match', true)
      return
    } else {
      displayAlertMessage('', '', false)
    }
  }

  function displayAlertMessage(alertType, message, isShowAlert) {
    setShowAlert(isShowAlert)
    setAlertMessage(message)
    setAlertType(alertType)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" autoComplete="username" ref={username} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" ref={email} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      ref={password}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="cnfPassword"
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      ref={cnfPassword}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={() => addPosts()}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
                {showAlert ? <br /> : ''}
                <CAlert color={alertType} visible={showAlert}>
                  {alertMessage}
                </CAlert>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
