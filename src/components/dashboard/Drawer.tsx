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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { apiUrl } from "@/utils/api";

//import { mainListItems } from "./ListItems";
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

  // const isBeforeDeadline = useTimeCheck();

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
        {/* {isBeforeDeadline && (
          <ListItems
            label="Registrar Candidato"
            icon={<PersonAddAlt1 />}
            to="/dashboard/candidato/register"
            isActive={pathname === "/dashboard/candidato/register"}
          />
        )} */}

        <ListItems
          label="Registrar Candidatura"
          icon={<PersonAddAlt1 />}
          to="/dashboard/candidato/register"
          isActive={pathname === "/dashboard/candidato/register"}
        />

        {isCandidato && (
          <ListItems
            label="Minha Candidatura"
            icon={<DescriptionIcon />}
            to="/dashboard/minha-candidatura"
            isActive={pathname === "/dashboard/minha-candidatura"}
          />
        )}

        <ListItems
          label="Liberar voto"
          icon={<HowToVoteIcon />}
          to="/dashboard/liberavoto"
          isActive={
            pathname === "/dashboard/liberavoto" ||
            pathname.startsWith("/dashboard/votacao")
          }
        />

        <ListItems
          label="Lista de Candidatos"
          icon={<AccountBox />}
          to="/dashboard/data"
          isActive={
            pathname === "/dashboard/data" ||
            pathname.startsWith("/dashboard/candidato/checklist/")
          }
        />

        {/* <ListItems
          label="Alunos"
          icon={<Face6Icon />}
          to="/dashboard/alunos"
          isActive={pathname === "/dashboard/alunos"}
        />
        <ListItems
          label="Funcionários"
          icon={<BadgeIcon />}
          to="/dashboard/funcionarios"
          isActive={pathname === "/dashboard/funcionarios"}
        /> */}

        {user.role?.includes("super-adm") ? (
          <ListItems
            label="Listas e Atas"
            icon={<DescriptionIcon />}
            to="/dashboard/buscaResultado"
            isActive={
              pathname === "/dashboard/buscaResultado" ||
              pathname.startsWith("/dashboard/atas/atasResultado")
            }
          />
        ) : (
          <ListItems
            label="Listas e Atas"
            icon={<DescriptionIcon />}
            to="/dashboard/atas"
            isActive={pathname === "/dashboard/atas"}
          />
        )}

        {user.role?.includes("super-adm") ? (
          <ListItems
            label="Apuração dos votos"
            icon={<PollIcon />}
            to="/dashboard/buscaApuracao"
            isActive={
              pathname === "/dashboard/buscaApuracao" ||
              pathname.startsWith("/dashboard/apuracao/")
            }
          />
        ) : (
          <ListItems
            label="Apuração dos votos"
            icon={<PollIcon />}
            to={`/dashboard/apuracao/${user._id}`}
            isActive={
              pathname === "/dashboard/buscaApuracao" ||
              pathname.startsWith("/dashboard/apuracao/")
            }
          />
        )}

        {user.role?.includes("super-adm") && (
          <ListItems
            label="Lista Completa - ADM"
            icon={<GroupIcon />}
            to="/dashboard/dataAdm"
            isActive={pathname === "/dashboard/dataAdm"}
          />
        )}

        {user.role?.includes("super-adm") && (
          <ListItemButton onClick={handleOpenResetDialog}>
            <ListItemIcon>
              <Icon>
                <RotateLeftIcon />
              </Icon>
            </ListItemIcon>
            <ListItemText primary="Redefinição de senha" />
          </ListItemButton>
        )}

        {user.role?.includes("super-adm") && (
          <ListItems
            label="Povoar Zonas"
            icon={<UploadFileIcon />}
            to="/dashboard/seed-zonas"
            isActive={pathname === "/dashboard/seed-zonas"}
          />
        )}
      </List>
      <ResetPasswordDialog
        open={resetDialogOpen}
        handleClose={handleCloseResetDialog}
      />
    </Drawer>
  );
}