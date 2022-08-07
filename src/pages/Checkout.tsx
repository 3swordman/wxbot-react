import { useEffect, useState } from "react"
import styled from "styled-components"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

import { clearGoods, setGoods } from "../state/current-goods"
import { useAppSelector, useAppDispatch } from "../store"
import { Good } from "../constants"
import { getScore, checkout } from "../network"

const CheckoutListRoot = styled(List)`
  display: flex;
  flex-direction: column;
`

const DetailRoot = styled.div`
  display: flex;
`

const PriceInfoContainer = styled.div`
  display: flex;
  margin-left: auto;
`

const PriceInfo = styled(Typography)`
  margin-top: auto;
  margin-bottom: auto;
`

const RightButton = styled(Button)`
  margin-left: 1em;
  margin-right: 1em;
  display: flex;
`

const DialogParagraph = styled.div`
  margin-bottom: 0.375em;
`

function CheckoutItem({ good, index, count }: { good: Good, index: number, count: number }) {
  // TODO: auto focus after the component rerendered
  const dispatch = useAppDispatch()
  return (
    <>
      {!!index && (
        <Divider component="li" />
      )}
      <ListItem>
        <ListItemText primary={good.title} secondary={"unit price: $" + good.price + ", total price: $" + good.price * count}></ListItemText>
        <TextField
          label="Count"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={count}
          onChange={ev => {
            if (ev.target.value) {
              const num = parseInt(ev.target.value, 10)
              if (!Number.isNaN(num))
                dispatch(setGoods({
                  good, 
                  count: num
                }))
            } else {
              dispatch(setGoods({
                good, 
                count: 0
              }))
            }
          }}
        />
      </ListItem>
    </>
  )
}

// function A({ good, count }: { good: Good, count: number }) {
//   const dispatch = useAppDispatch()
//   function setCount(count: number) {
//     dispatch(setGoods({
//       good, count
//     }))
//   }
//   return (
//     <TextField value={count} onChange={ev => {
//       setCount(parseInt(ev.target.value))
//     }} />
//   )
// }

export default function CheckoutList() {
  const currentGoods = useAppSelector(state => state.currentGoods.value)
  const totalPrice = currentGoods.reduce((totalPrice, [good, count]) => totalPrice + good.price * count, 0)
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const username = useAppSelector(state => state.auth.value?.username)
  const loginToken = useAppSelector(state => state.auth.value?.token!)
  const [score, setScore] = useState<number | null>(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [checkoutError, setCheckoutError] = useState(false)
  const [reason, setReason] = useState("")
  useEffect(function () {
    (async function () {
      if (username == null || loginToken == null) {
        setScore(null)
        return
      }
      setScore(await getScore(username))
    })()
  }, [username])
  return (
    <>
      <Snackbar open={checkoutSuccess || checkoutError} autoHideDuration={6000} onClose={() => {
        setCheckoutSuccess(false)
        setCheckoutError(false)
      }}>
        <Alert onClose={() => {
          setCheckoutSuccess(false)
          setCheckoutError(false)
        }} severity={checkoutSuccess ? "success" : "error"}>{reason}</Alert>
      </Snackbar>
      <Dialog open={dialogOpen}>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <DialogParagraph>Are you really sure you want this? </DialogParagraph>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>close</Button>
          <Button onClick={() => {
            (async function () {
              const { success, errCode } = await checkout(username!, loginToken, currentGoods)
              if (success) {
                setCheckoutSuccess(true)
                setCheckoutError(false)
                setReason("Checkout successfully!")
                dispatch(clearGoods())
              } else {
                setCheckoutSuccess(false)
                setCheckoutError(true)
                setReason({
                  "1001": "No enough score",
                  "1002": "Auth failed",
                  "1003": "Good imformation loading failed",
                  "1004": "Points exceed daily limit", 
                  "9999": "Unknown error"
                }[errCode]!)
              }
              setDialogOpen(false)
            })()
          }}>checkout</Button>
        </DialogActions>
      </Dialog>
      <CheckoutListRoot>
        {currentGoods.map(([good, count], index) => (
          <CheckoutItem key={good.title + good.id + count + index} good={good} index={index} count={count} />
        ))}
      </CheckoutListRoot>
      <DetailRoot>
        <PriceInfoContainer>
          <PriceInfo variant="h6">
            {score == null ? (
              `total price: $${totalPrice}`
            ) : (
              `price: $${score} - $${totalPrice} = $${score - totalPrice}`
            )}
          </PriceInfo>
        </PriceInfoContainer>
        <RightButton 
          variant="contained" 
          onClick={() => setDialogOpen(true)} 
          disabled={score == null || totalPrice >= score! || totalPrice == 0}
        >
          checkout now{score == null && " (you must login first)"}
        </RightButton>
      </DetailRoot>
    </>
  )
}