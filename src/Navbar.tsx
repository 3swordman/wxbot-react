import { useNavigate } from "react-router-dom"

import styled from "styled-components"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { logout } from "./state/auth"
import { useAppSelector, useAppDispatch, clearData } from "./store"

const WhiteButton = styled(Button)`
  color: white;
  margin-left: auto;
  & + & {
    margin-left: 0;
  }
`

export default function () {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authData = useAppSelector(state => state.auth.value)
  const logined = authData != undefined && authData.token != undefined
  return (
    <AppBar component="nav" position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
        >
          Score store
        </Typography>
        <WhiteButton onClick={() => {
          navigate("/")
        }}>
          home
        </WhiteButton>
        <WhiteButton onClick={() => {
          navigate("/checkout")
        }}>
          checkout
        </WhiteButton>
        {logined ? (
          <WhiteButton onClick={() => {
            dispatch(logout())
            clearData()
          }}>
            logout
          </WhiteButton>
        ) : (
          <WhiteButton onClick={() => {
            navigate("/login")
          }}>
            login
          </WhiteButton>
        )}
      </Toolbar>
    </AppBar>
  )
}