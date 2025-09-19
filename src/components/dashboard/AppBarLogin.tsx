import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Button from "@mui/material/Button";
import Link from "next/link";

const appBarStyle = {
  backgroundColor: "#0f4c81",
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
  width: "100%",
};

const titleStyle = {
  flex: 1,
  marginRight: "85px",
};

const logoStyle = {
  marginLeft: "60px",
};

const headerContainerStyle = {
  marginBottom: "150px",
};

export default function AppBarLogin() {
  return (
    <div style={headerContainerStyle}>
      <AppBar position="absolute" sx={appBarStyle}>
        <Toolbar
          sx={{
            backgroundColor: "#0f4c81",
            pr: "24px",
          }}
        >
          <div style={containerStyle}>
            <Typography variant="h6" color="inherit" noWrap sx={titleStyle}>
              SED - Sistema de Eleição de Diretores
            </Typography>
            <div style={logoStyle}>
              <Image
                width={320}
                height={55}
                src={
                  "https://api.anapolis.go.gov.br/apiupload/sed/educacao.png"
                }
                alt="Logo"
              />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
