import styled from "styled-components"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from '@mui/material/FormControlLabel'

const SignupRoot = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`

const SignupContainer = styled.div`
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

const NoneTransformButton = styled(Button)`
  text-transform: none;
`

const PasswordList = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    flex-direction: row;
    & > * + * {
      margin-left: 1em;
    }
  }
`

const RightButton = styled(NoneTransformButton)`
  margin-left: auto;
`

const ButtonGroup = styled.div`
  margin-top: 1em;
  display: flex;
`

export default function Signup() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const navigate = useNavigate()
  return (
    <SignupRoot>
      <SignupContainer>
        <Typography variant="h5">Create your star account</Typography>
        <TextField 
          label="Username" 
          margin="normal" 
          size="small" 
          helperText="You can use letters, numbers & periods" 
          autoComplete="username" 
          value={username} 
          autoFocus 
          onChange={ev => {
            setUsername(ev.target.value)
          }} 
        />
        <PasswordList>
          <TextField 
            label="Password" 
            margin="normal" 
            size="small" 
            type={showPassword ? "text" : "password"} 
            autoComplete="new-password"
            value={password} 
            onChange={ev => {
              setPassword(ev.target.value)
            }} 
            onBlur={ev => {
              if (password != confirmPassword && confirmPassword != "" || password == "") {
                setPasswordError(true)
              } else {
                setPasswordError(false)
              }
            }}
            error={passwordError}
          />
          <TextField 
            label="Confirm" 
            margin="normal" 
            size="small" 
            type={showPassword ? "text" : "password"} 
            autoComplete="new-password"
            value={confirmPassword} 
            onChange={ev => {
              setConfirmPassword(ev.target.value)
            }} 
            onBlur={ev => {
              if (password != confirmPassword || confirmPassword == "") {
                setPasswordError(true)
              } else {
                setPasswordError(false)
              }
            }}
            error={passwordError}
          />
        </PasswordList>
        <FormControlLabel 
          control={<Checkbox value={showPassword} 
          onChange={ev => setShowPassword(ev.target.checked)} />} 
          label="Show password" 
        />
        <ButtonGroup>
          <NoneTransformButton onClick={() => {
            navigate("/login")
          }}>Sign in instead</NoneTransformButton>
          <RightButton variant="contained" onClick={() => {
            if (password != confirmPassword || confirmPassword == "" || password == "") {
              setPasswordError(true)
            } else {
              setPasswordError(false)
              navigate("/verify")
            }

          }}>Next</RightButton>
        </ButtonGroup>
      </SignupContainer>
    </SignupRoot>
  )
}