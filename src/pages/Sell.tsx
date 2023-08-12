import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridValueGetterParams
} from "@mui/x-data-grid"
import { Add as AddIcon, Create as CreateIcon } from "@mui/icons-material"

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

function SellDialog({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(100)
  const queryClient = useQueryClient()
  const loginToken = useAppSelector(state => state.auth.value?.token)
  const navigate = useNavigate()
  useLayoutEffect(() => {
    if (!loginToken) navigate("/")
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

const Root = styled.div`
  display: flex;
  padding: 1em;
`
const Container = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1em;
`

const Title = styled.div`
  font-size: 1.75em;
`

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70, type: "number" },
  { field: "name", headerName: "Name", width: 130 },
  { field: "description", headerName: "Description", width: 200, sortable: false }
]

function OpenDialogButton({ setDialogOpen }: { setDialogOpen: Dispatch<SetStateAction<boolean>> }) {
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        type="button"
        onClick={() => {
          setDialogOpen(true)
        }}
        startIcon={<CreateIcon />}
      >
        <div>Create</div>
      </Button>
    </GridToolbarContainer>
  )
}

export default function Sell() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const loginToken = useAppSelector(state => state.auth.value?.token)
  const { data } = useThingsSold(loginToken!)

  return (
    <Root>
      <SellDialog open={dialogOpen} setOpen={setDialogOpen} />
      <Container>
        {!!loginToken && !!data && !!data.data && (
          <>
            <Title>Goods</Title>
            <DataGrid
              rows={data.data.goods}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 }
                }
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              autoHeight
              sx={{
                overflowX: "auto"
              }}
              slots={{
                toolbar: OpenDialogButton
              }}
              slotProps={{
                toolbar: {
                  setDialogOpen
                }
              }}
            />
          </>
        )}
      </Container>
    </Root>
  )
}
