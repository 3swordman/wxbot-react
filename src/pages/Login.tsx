import styled from "styled-components"
import { useState, useEffect } from "react"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"

import { setUsernameToken } from "../state/auth"
import { useAppDispatch, useAppSelector, saveData } from "../store"
import { getToken } from "../network"

const LoginRoot = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`

const LoginContainer = styled.div`
  margin: auto;
  padding: 2em;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    border: 1px solid #c4c4c4;
    border-radius: 0.25em;
    padding: 3em;
  }
  display: flex;
  flex-direction: column;
`

const CenterTitle = styled(Typography)`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0.25em;
`

const NoneTransformButton = styled(Button)`
  text-transform: none;
`

const ForgotPasswordButton = styled(NoneTransformButton)`
  margin-right: auto;
`

const LoginButton = styled(NoneTransformButton)`
  margin-left: 4em;
  ${({ theme }) => theme.breakpoints.up("md")} {
    margin-left: 8em;
  }
`

const ButtonGroup = styled.div`
  display: flex;
`

export default function () {
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState(false)
  const [usernameHelperText, setUsernameHelperText] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [passwordHelperText, setPasswordHelperText] = useState("")
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authData = useAppSelector(state => state.auth.value)
  const logined = !!(authData && authData.token)
  useEffect(() => {
    if (logined) {
      navigate(-1)
    }
  }, [logined])
  return (
    <LoginRoot>
      <LoginContainer>
        <CenterTitle variant="h5">Sign in</CenterTitle>
        <CenterTitle variant="subtitle1">Use your star account</CenterTitle>
        <TextField 
          autoComplete="username" 
          label="Username"
          autoFocus 
          value={username} 
          onChange={ev => setUsername(ev.target.value)} 
          margin="normal"
          fullWidth
          error={usernameError}
          helperText={usernameHelperText}
        />
        <TextField 
          autoComplete="password"
          label="Password"
          type="password"
          value={password} 
          onChange={ev => setPassword(ev.target.value)} 
          margin="dense"
          fullWidth
          error={passwordError}
          helperText={passwordHelperText}
        />
        <ForgotPasswordButton size="small">Forgot password?</ForgotPasswordButton>
        <ButtonGroup>
          <NoneTransformButton onClick={() => {
            navigate("/signup")
          }}>Create account</NoneTransformButton>
          <LoginButton variant="contained" onClick={() => {
            let allSuccess = true
            if (username == "") {
              setUsernameError(true)
              setUsernameHelperText("This can't be blank")
              allSuccess = false
            }
            if (password == "") {
              setPasswordError(true)
              setPasswordHelperText("This can't be blank")
              allSuccess = false
            }
            if (!allSuccess)
              return
            const token = getToken(username, password)
            dispatch(setUsernameToken({
              username, token
            }))
            ;(async () => {
              await saveData({
                username, token
              })
              navigate("/")
            })()
          }}>Next</LoginButton>
        </ButtonGroup>
      </LoginContainer>
    </LoginRoot>
  )
}