import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

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
  const logged = authData != undefined && authData.token != undefined
  const { t } = useTranslation()
  return (
    <AppBar component="nav" position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
        >
          {t("Score store")}
        </Typography>
        <WhiteButton onClick={() => {
          navigate("/")
        }}>
          {t("home")}
        </WhiteButton>
        <WhiteButton onClick={() => {
          navigate("/checkout")
        }}>
          {t("checkout")}
        </WhiteButton>
        {logged ? (
          <WhiteButton onClick={() => {
            dispatch(logout())
            clearData()
          }}>
            {t("logout")}
          </WhiteButton>
        ) : (
          <WhiteButton onClick={() => {
            navigate("/login")
          }}>
          {t("login")}
          </WhiteButton>
        )}
      </Toolbar>
    </AppBar>
  )
}