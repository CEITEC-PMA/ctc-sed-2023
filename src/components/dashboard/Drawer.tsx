import {
  Divider,
  IconButton,
  List,
  Toolbar,
  styled,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
  Tooltip, // Adicionado
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { PersonAddAlt1, AccountBox } from "@mui/icons-material/";
import PersonIcon from "@mui/icons-material/Person";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ListItems from "./listItems";
import Face6Icon from "@mui/icons-material/Face6";
import { useUserContext } from "@/userContext";
import GroupIcon from "@mui/icons-material/Group";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import PollIcon from "@mui/icons-material/Poll";
import ReplyIcon from "@mui/icons-material/Reply";
import DescriptionIcon from "@mui/icons-material/Description";
import BadgeIcon from "@mui/icons-material/Badge";
import { usePathname } from "next/navigation";
import Unauthorized from "../unauthorized";
import React, { useState, useEffect } from "react";
import ResetPasswordDialog from "./ResetPasswordDialog";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { apiUrl } from "@/utils/api";

interface DrawerProps {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
}

export default function DrawerComponent({
  open,
  toggleDrawer,
  drawerWidth,
}: DrawerProps) {
  const { user } = useUserContext();
  const pathname = usePathname();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isCandidato, setIsCandidato] = useState(false);

  const handleOpenResetDialog = () => {
    setResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
  };

  useEffect(() => {
    const checkCandidatura = async () => {
      const token = localStorage.getItem("token");
      if (user?._id && token) {
        try {
          const response = await fetch(
            `${apiUrl}/api/v1/candidato/by-usuario/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.candidato) {
              setIsCandidato(true);
            } else {
              setIsCandidato(false);
            }
          } else {
            setIsCandidato(false);
          }
        } catch (error) {
          console.error("Error checking candidate status:", error);
          setIsCandidato(false);
        }
      }
    };

    checkCandidatura();
  }, [user?._id]);

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      <List component="nav">
        {user.role?.includes("super-adm") && (
          <Tooltip title={open ? "" : "Zonas"} placement="right">
            <ListItems
              label="Zonas"
              icon={<UploadFileIcon />}
              to="/dashboard/zonas"
              isActive={pathname === "/dashboard/zonas"}
            />
          </Tooltip>
        )}

        <Tooltip title={open ? "" : "Registrar Candidatura"} placement="right">
          <ListItems
            label="Registrar Candidatura"
            icon={<PersonAddAlt1 />}
            to="/dashboard/candidato/register"
            isActive={pathname === "/dashboard/candidato/register"}
          />
        </Tooltip>

        {isCandidato && (
          <Tooltip title={open ? "" : "Minha Candidatura"} placement="right">
            <ListItems
              label="Minha Candidatura"
              icon={<DescriptionIcon />}
              to="/dashboard/minha-candidatura"
              isActive={pathname === "/dashboard/minha-candidatura"}
            />
          </Tooltip>
        )}

        <Tooltip title={open ? "" : "Liberar voto"} placement="right">
          <ListItems
            label="Liberar voto"
            icon={<HowToVoteIcon />}
            to="/dashboard/liberavoto"
            isActive={
              pathname === "/dashboard/liberavoto" ||
              pathname.startsWith("/dashboard/votacao")
            }
          />
        </Tooltip>

        <Tooltip title={open ? "" : "Lista de Candidatos"} placement="right">
          <ListItems
            label="Lista de Candidatos"
            icon={<AccountBox />}
            to="/dashboard/data"
            isActive={
              pathname === "/dashboard/data" ||
              pathname.startsWith("/dashboard/candidato/checklist/")
            }
          />
        </Tooltip>

        {user.role?.includes("super-adm") ? (
          <Tooltip title={open ? "" : "Listas e Atas"} placement="right">
            <ListItems
              label="Listas e Atas"
              icon={<DescriptionIcon />}
              to="/dashboard/buscaResultado"
              isActive={
                pathname === "/dashboard/buscaResultado" ||
                pathname.startsWith("/dashboard/atas/atasResultado")
              }
            />
          </Tooltip>
        ) : (
          <Tooltip title={open ? "" : "Listas e Atas"} placement="right">
            <ListItems
              label="Listas e Atas"
              icon={<DescriptionIcon />}
              to="/dashboard/atas"
              isActive={pathname === "/dashboard/atas"}
            />
          </Tooltip>
        )}

        {user.role?.includes("super-adm") ? (
          <Tooltip title={open ? "" : "Apuração dos votos"} placement="right">
            <ListItems
              label="Apuração dos votos"
              icon={<PollIcon />}
              to="/dashboard/buscaApuracao"
              isActive={
                pathname === "/dashboard/buscaApuracao" ||
                pathname.startsWith("/dashboard/apuracao/")
              }
            />
          </Tooltip>
        ) : (
          <Tooltip title={open ? "" : "Apuração dos votos"} placement="right">
            <ListItems
              label="Apuração dos votos"
              icon={<PollIcon />}
              to={`/dashboard/apuracao/${user._id}`}
              isActive={
                pathname === "/dashboard/buscaApuracao" ||
                pathname.startsWith("/dashboard/apuracao/")
              }
            />
          </Tooltip>
        )}

        {user.role?.includes("super-adm") && (
          <Tooltip title={open ? "" : "Lista Completa - ADM"} placement="right">
            <ListItems
              label="Lista Completa - ADM"
              icon={<GroupIcon />}
              to="/dashboard/dataAdm"
              isActive={pathname === "/dashboard/dataAdm"}
            />
          </Tooltip>
        )}

        {user.role?.includes("super-adm") && (
          <Tooltip title={open ? "" : "Redefinição de senha"} placement="right">
            <ListItemButton onClick={handleOpenResetDialog}>
              <ListItemIcon>
                <Icon>
                  <RotateLeftIcon />
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Redefinição de senha" />
            </ListItemButton>
          </Tooltip>
        )}
      </List>
      <ResetPasswordDialog
        open={resetDialogOpen}
        handleClose={handleCloseResetDialog}
      />
    </Drawer>
  );
}
