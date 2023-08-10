import { Outlet, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import styled from "styled-components"
import { AppBar, Toolbar, Button, Typography } from "@mui/material"

import { logout } from "./state/auth"
import { useAppSelector, useAppDispatch, clearData } from "./store"
import { useState } from "react"
import SellDialog from "./pages/Sell"

const WhiteButton = styled(Button)`
  color: white;
  margin-left: auto;
  & + & {
    margin-left: 0;
  }
`

export default function NavbarContainer() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authData = useAppSelector(state => state.auth.value)
  const logged = authData != undefined && authData.token != undefined
  const [sellDialogOpen, setSellDialogOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <>
      <AppBar component="nav" position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            {t("Score store")}
          </Typography>
          <WhiteButton
            onClick={() => {
              navigate("/")
            }}
          >
            {t("home")}
          </WhiteButton>
          <WhiteButton
            onClick={() => {
              navigate("/checkout")
            }}
          >
            {t("checkout")}
          </WhiteButton>
          <WhiteButton
            onClick={() => {
              setSellDialogOpen(true)
            }}
          >
            {t("Sell")}
          </WhiteButton>
          {logged ? (
            <WhiteButton
              onClick={() => {
                dispatch(logout())
                clearData()
              }}
            >
              {t("logout")}
            </WhiteButton>
          ) : (
            <WhiteButton
              onClick={() => {
                navigate("/login")
              }}
            >
              {t("login")}
            </WhiteButton>
          )}
        </Toolbar>
      </AppBar>
      <SellDialog open={sellDialogOpen} setOpen={setSellDialogOpen} />
      <Outlet />
    </>
  )
}
