import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FC'
import { login, loginGoogle } from '../actions/userActions'
import GoogleLogin from 'react-google-login'
import { gapi } from 'gapi-script'

const LoginScreen = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin
  const userLoginGoogle = useSelector((state) => state.userLoginGoogle)
  const {
    loading: userLGLoading,
    error: userLGError,
    userLGInfo,
  } = userLoginGoogle
  const location = useLocation()
  // const { search } = useLocation()
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  )

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          '336257746111-nc1cme4gda545cohoqgbmsbq3hsr048k.apps.googleusercontent.com',
        scope: 'email',
      })
    }

    gapi.load('client:auth2', start)
  }, [])

  const handleFailure = (result) => {
    // console.log(process.env.REACT_APP_GOOGLE_ID)
    // console.log(process.env.NODE_ENV)
    console.log(result)
    alert(result)
  }

  const handleLogin = async (googleData) => {
    const googleId = googleData.googleId
    const tokenId = googleData.tokenId
    dispatch(loginGoogle(googleData))
  }

  const handleLogout = () => {
    localStorage.removeItem('loginData')
    setLoginData(null)
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-3'>
          Sign In
        </Button>
        <Row>
          <h1>Google Log in</h1>
          <div>
            {loginData ? (
              <div>
                <h3>You logged in as {loginData.email}</h3>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <GoogleLogin
                clientId='336257746111-nc1cme4gda545cohoqgbmsbq3hsr048k.apps.googleusercontent.com'
                buttonText={'Log in with Google'}
                onSuccess={handleLogin}
                onFailure={handleFailure}
                cookiePolicy={'single_host_origin'}
                plugin_name='WebAppProShop'
              ></GoogleLogin>
            )}
          </div>
        </Row>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
