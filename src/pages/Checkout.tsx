import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material"

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
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
  }
`

const PriceInfoContainer = styled.div`
  display: flex;
  margin-left: auto;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-right: 1em;
  }
`

const PriceInfo = styled(Typography)`
  margin-top: auto;
  margin-bottom: auto;
`

const RightButton = styled(Button)`
  margin-left: 1em;
  margin-right: 1em;
  display: flex;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: auto;
  }
`

const DialogParagraph = styled.div`
  margin-bottom: 0.375em;
`

function CheckoutItem({ good, index, count }: { good: Good; index: number; count: number }) {
  // TODO: auto focus after the component rerendered
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  return (
    <>
      {!!index && <Divider component="li" />}
      <ListItem>
        <ListItemText
          primary={good.title}
          secondary={`${t("unit price")}: $${good.price}, ${t("total price")}: $${good.price * count}`}
        ></ListItemText>
        <TextField
          label="Count"
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          value={count}
          onChange={ev => {
            if (ev.target.value) {
              const num = parseInt(ev.target.value, 10)
              if (!Number.isNaN(num))
                dispatch(
                  setGoods({
                    good,
                    count: num
                  })
                )
            } else {
              dispatch(
                setGoods({
                  good,
                  count: 0
                })
              )
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
  const { t } = useTranslation()
  useEffect(
    function () {
      ;(async function () {
        if (username == null || loginToken == null) {
          setScore(null)
          return
        }
        setScore(await getScore(username))
      })()
    },
    [username]
  )
  return (
    <>
      <Snackbar
        open={checkoutSuccess || checkoutError}
        autoHideDuration={6000}
        onClose={() => {
          setCheckoutSuccess(false)
          setCheckoutError(false)
        }}
      >
        <Alert
          onClose={() => {
            setCheckoutSuccess(false)
            setCheckoutError(false)
          }}
          severity={checkoutSuccess ? "success" : "error"}
        >
          {reason}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen}>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <DialogParagraph>{t("Are you really sure you want this? ")}</DialogParagraph>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>close</Button>
          <Button
            onClick={() => {
              ;(async function () {
                const { success, errCode } = await checkout(username!, loginToken, currentGoods)
                if (success) {
                  setCheckoutSuccess(true)
                  setCheckoutError(false)
                  setReason("Checkout successfully!")
                  dispatch(clearGoods())
                } else {
                  setCheckoutSuccess(false)
                  setCheckoutError(true)
                  setReason(
                    {
                      "1001": "Score is not enough",
                      "1002": "Auth failed",
                      "1003": "Good information loading failed",
                      "1004": "Points exceed daily limit",
                      "9999": "Unknown error"
                    }[errCode]!
                  )
                }
                setDialogOpen(false)
              })()
            }}
          >
            checkout
          </Button>
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
            {score == null
              ? `${t("total price")}: $${totalPrice}`
              : `${t("price")}: $${score} - $${totalPrice} = $${score - totalPrice}`}
          </PriceInfo>
        </PriceInfoContainer>
        <RightButton
          variant="contained"
          onClick={() => setDialogOpen(true)}
          disabled={score == null || totalPrice >= score! || totalPrice == 0}
        >
          {t("checkout now")}
          {score == null && t(" (you must login first)")}
        </RightButton>
      </DetailRoot>
    </>
  )
}
