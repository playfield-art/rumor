import { createTheme } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    record: true;
  }
}

const sidebarWidth = 180;

export default createTheme({
  palette: {
    primary: {
      main: "#242424",
      contrastText: "#ffffff",
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "var(--white)",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          textAlign: "right",
        },
        columnHeaders: {
          marginBottom: "15px",
        },
        cell: {
          borderBottom: "none",
        },
        row: {
          "&:hover": {
            backgroundColor: "var(--grey-1100)",
            cursor: "pointer",
          },
          "&.log-warn": {
            backgroundColor: "var(--warn)",
          },
          "&.log-success": {
            backgroundColor: "var(--success)",
          },
          "&.log-error": {
            backgroundColor: "var(--error)",
          },
        },
        footerContainer: {
          marginTop: "15px",
          color: "var(--white)",
        },
        root: {
          border: "none",
          color: "var(--white)",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "var(--white)",
        },
        selectIcon: {
          color: "var(--white)",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--primary-100)",
          "& .MuiTableCell-head": {
            color: "white",
            backgroundColor: "var(--primary-700)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "0",
          color: "var(--white)",
          borderBottom: "1px solid var(--primary-100)",
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "record" },
          style: {
            backgroundColor: "var(--red-900)",
            "&:hover": {
              backgroundColor: "var(--red-800)",
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          // padding: "0.6rem 1.2rem",
          boxShadow: "none",
          borderRadius: "var(--default-border-radius)",
          border: "1px solid transparent",
          "&.MuiButton-contained": {
            cursor: "pointer",
            backgroundColor: "var(--background-color-button)",
            color: "var(--white)",
          },
          "&.MuiButton-contained:hover": {
            backgroundColor: "var(--grey-1200)",
          },
          "&.MuiButton-text": {
            color: "var(--white)",
          },
          "&:focus": {
            outline: "0px",
          },
          "&[disabled]": {
            border: "none",
            opacity: 0.6,
            cursor: "not-allowed",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "var(--white)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--primary-color)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          width: `calc(100% - ${sidebarWidth}px)`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            backgroundColor: "var(--primary-color)",
            width: sidebarWidth,
            boxSizing: "border-box",
            borderRight: "1px solid var(--whiteExtraLight)",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color: "var(--white)",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "var(--whiteLight)",
          minWidth: 40,
        },
      },
    },
  },
});
