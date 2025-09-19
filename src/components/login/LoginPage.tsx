"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { PatternFormat } from "react-number-format";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/utils/api";
import { useState } from "react";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Stack,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { signIn } from "next-auth/react";
import { useUserContext } from "@/userContext";
import Link from "next/link";

export default function LoginPage() {
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorInep, setErrorInep] = React.useState("");
  const router = useRouter();
  const [openSnack, setOpenSnack] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user?._id) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnack = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
    router.push("/dashboard");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === rePassword);
  };

  const handleRePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRePassword = event.target.value;
    setRePassword(newRePassword);
    setPasswordsMatch(password === newRePassword);
  };

  const handleResetPassword = async () => {
    if (password.length >= 6 && password === rePassword) {
      await fetch(`${apiUrl}/api/v1/usuarios/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      }).then(async (response) => {
        if (response.ok) {
          const resJson = await response.json();
          const newToken = resJson.usuario.token;
          localStorage.setItem("token", newToken);
          setUser(resJson.usuario);
          router.push("/dashboard");
        } else {
          // Handle error
        }
      });
    } else {
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const dataToSend = {
      credential: data.get("credential"),
      password: data.get("senha"),
    };
    const { password, credential } = dataToSend;
    if (!credential) {
      setErrorMessage("Por favor digite o número do CPF ou INEP");
      setOpen(true);
      setLoading(false);
    }
    if (!password) {
      setErrorMessage("Por favor digite uma senha");
      setOpen(true);
      setLoading(false);
    } else {
      if (password.length < 6) {
        setErrorMessage("a senha deve ter pelo menos 6 caracteres");
        setOpen(true);
        setLoading(false);
      } else {
        const response = await fetch(`${apiUrl}/api/v1/usuarios/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        })
          .then(async (response) => {
            if (response.status === 200) {
              const resJson = await response.json();
              if (resJson.usuario.acesso === 0) {
                const tokenBackEnd = resJson.usuario.token;
                setToken(tokenBackEnd);
                handleOpenDialog();
              } else {
                const token = resJson.usuario.token;
                localStorage.setItem("token", token);
                setUser(resJson.usuario);
              }
            } else if (response.status === 401) {
              throw new Error("CPF/Iep ou Senha Inválidos");
            }
          })
          .catch((error) => {
            setErrorMessage(error.message);
            setOpen(true);
          })
          .finally(() => setLoading(false));
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          open={open}
          autoHideDuration={8000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Entrar
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="credential"
            label="CPF ou INEP"
            type="tel"
            id="credential"
            autoComplete="credential"
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            autoComplete="senha-atual"
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Enviar"}
          </Button>

          <Typography variant="body2" textAlign="center">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
              }}
            >
              Cadastre-se
            </Link>
          </Typography>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Redefina a sua senha</DialogTitle>
            <DialogContent>
              <DialogContentText marginBottom="8px">
                Seja bem-vindo ao Sistema de Eleição de Diretores! Neste
                primeiro acesso, redefina sua senha.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Digite a sua senha"
                type="password"
                inputProps={{
                  minLength: 6,
                }}
                fullWidth
                onChange={handlePasswordChange}
              />
              <TextField
                error={!passwordsMatch}
                margin="dense"
                id="confirmpassword"
                label="Confirme a sua senha"
                type="password"
                inputProps={{
                  minLength: 6,
                }}
                fullWidth
                onChange={handleRePasswordChange}
                helperText={!passwordsMatch && "As senhas não coincidem."}
              />
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={handleCloseDialog}>Cancelar</Button> */}
              <Button variant="contained" onClick={handleResetPassword}>
                Enviar
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleCloseSnack}
          >
            <Alert
              onClose={(e) => handleCloseSnack(e)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Senha redefinida com sucesso!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Container>
  );
}
