import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from "@mui/material"
import { t } from "i18next"
import styled from "styled-components"
import { checkout, sellGoods, useThingsSold } from "../network"
import currentGoods, { clearGoods } from "../state/current-goods"
import { type Dispatch, type SetStateAction, useState, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { useAppSelector } from "../store"
import { useNavigate } from "react-router-dom"

const DialogParagraph = styled.div`
  margin-bottom: 0.375em;
`

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

export default function SellDialog({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(100)
  const queryClient = useQueryClient()
  const loginToken = useAppSelector(state => state.auth.value?.token)
  const navigate = useNavigate()
  const { data } = useThingsSold(loginToken!)
  console.log(data)
  useLayoutEffect(() => {
    navigate("/")
  }, [loginToken])
  return (
    <Dialog open={open}>
      <DialogTitle>Sell</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">
          <DialogParagraph>{t("Sell something to earn score. ")}</DialogParagraph>
        </DialogContentText>
        <Inputs>
          <TextField label="Name" value={name} onChange={ev => setName(ev.target.value)} />
          <TextField
            label="Description"
            multiline
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={ev => {
              const value = parseInt(ev.target.value)
              if (!Number.isNaN(value) && value > 0) {
                setPrice(parseInt(ev.target.value))
              }
            }}
          />
        </Inputs>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>close</Button>
        <Button
          onClick={() => {
            if (!(name && description && price)) return
            sellGoods(name, description, price, loginToken!)
            queryClient.invalidateQueries(["get-goods"])
          }}
        >
          sell
        </Button>
      </DialogActions>
    </Dialog>
  )
}
