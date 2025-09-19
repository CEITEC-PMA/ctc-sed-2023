"use client";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiUrl } from "./utils/api";
import { Box, CircularProgress, Container, Stack } from "@mui/material";

type User = {
  _id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  matricula?: string;
  cargo?: string;
  funcao?: string;
  curso_gestor?: string;
  data_entrada_modulacao?: string;
  data_inicio_docencia?: string;
  zona_pleito?: string;
  role?: string[];
  acesso?: number;
  token?: string;
};

type UserContextType = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};

const UserContext = React.createContext<UserContextType>({
  user: { nome: "", _id: "" },
  setUser: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState({} as User);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${apiUrl}/api/v1/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.usuario) {
            setUser(data.usuario);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xs">
        <Stack>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        </Stack>
      </Container>
    ); // Or a spinner component
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
