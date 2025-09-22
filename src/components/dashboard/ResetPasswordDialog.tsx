import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { apiUrl } from "@/utils/api";

interface User {
  nome: string;
  cpf: string;
}

interface ResetPasswordDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function ResetPasswordDialog({
  open,
  handleClose,
}: ResetPasswordDialogProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/api/v1/usuarios/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOptions(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/v1/usuarios/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cpf: selectedUser.cpf }),
      });

      if (response.ok) {
        setSuccess("Senha resetada com sucesso!");
        setSelectedUser(null);
        setConfirmOpen(false);
      } else {
        const errData = await response.json();
        setError(errData.errors || "Erro ao resetar a senha.");
      }
    } catch (err: any) {
      setError("Erro ao resetar a senha.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Resetar Senha de Usuário</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Busque pelo nome ou CPF do usuário para resetar a senha.
          </DialogContentText>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.nome} - ${option.cpf}`}
            loading={loading}
            onInputChange={(event, newInputValue) => {
              handleSearch(newInputValue);
            }}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar usuário"
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => setConfirmOpen(true)}
            variant="contained"
            disabled={!selectedUser}
          >
            Resetar Senha
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Reset de Senha</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja resetar a senha do usuário abaixo?
          </DialogContentText>
          <p>
            <b>Nome:</b> {selectedUser?.nome}
          </p>
          <p>
            <b>CPF:</b> {selectedUser?.cpf}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleResetPassword} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
