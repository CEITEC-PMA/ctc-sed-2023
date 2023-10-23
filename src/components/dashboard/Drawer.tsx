import { Divider, IconButton, List, Toolbar, styled } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { PersonAddAlt1, AccountBox } from "@mui/icons-material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ListItems from "./listItems";
import { useUserContext } from "@/userContext";
import useTimeCheck from "@/hooks/useTimeCheck";
import GroupIcon from "@mui/icons-material/Group";

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

  const isBeforeDeadline = useTimeCheck();

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
        {isBeforeDeadline && (
          <ListItems
            label="Registrar Candidato"
            icon={<PersonAddAlt1 />}
            to="/dashboard/candidato"
          />
        )}

        <ListItems
          label="Lista de Candidatos"
          icon={<AccountBox />}
          to="/dashboard/data"
        />
        {user.role?.includes("super-adm") && (
          <ListItems
            label="Lista Completa - ADM"
            icon={<GroupIcon />}
            to="/dashboard/dataAdm"
          />
        )}
        {user.role?.includes("adm") && (
          <ListItems
            label="Lista de Candidatos"
            icon={<RotateLeftIcon />}
            to="/dashboard/settings"
          />
        )}
      </List>
    </Drawer>
  );
}
