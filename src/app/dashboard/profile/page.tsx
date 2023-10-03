"use client";
import React, { useState } from "react";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const Container = styled("div")`
  text-align: center;
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const Title = styled(Typography)`
  font-size: 24px;
`;

const AvatarImage = styled(Avatar)`
  width: ${({ theme }) => theme.spacing(10)};
  height: ${({ theme }) => theme.spacing(10)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

const PaperContainer = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(6)};
`;

const Form = styled("form")`
  max-width: 600px;
  margin: 0 auto;
`;

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
  };

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Container>
      <Title variant="h4">Olá, seja bem-vindo ao seu perfil.</Title>
      <PaperContainer>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <AvatarImage src="" />
            </Box>
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nome"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Sobrenome"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    label="Senha"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    label="Confirmar"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#0f4c81", color: "white" }}
                  >
                    Salvar Mudanças
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Grid>
        </Grid>
      </PaperContainer>
    </Container>
  );
};

export default Profile;
