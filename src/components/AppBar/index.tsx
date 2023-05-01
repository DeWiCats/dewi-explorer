import React, { useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material";
import Image from "next/image";
import Favorite from "@mui/icons-material/FavoriteBorderOutlined";
import DonateDialog from "@/components/DonateDialog";
import { useRouter } from "next/router";

const pages = ["Calculator", "About Us"];

function ResponsiveAppBar() {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const toggleDialog = useCallback(() => {
    setDialogOpen((s) => !s);
  }, []);

  const handleNavMenuClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const { innerText } = event.target as HTMLElement;
      if (innerText.toUpperCase() === "CALCULATOR") {
        router.push("/calculator");
        return;
      }

      if (innerText.toUpperCase() === "STATS") {
        router.push("/");
        return;
      }
      // Open www.dewicats.com url with new tab
      window.open("https://www.dewicats.xyz/", "_blank");
      handleCloseNavMenu();
    },
    []
  );

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleGithibLink = React.useCallback(() => {
    window.open("https://github.com/DeWiCats/dewi-explorer", "_blank");
    handleCloseNavMenu();
  }, []);

  return (
    <>
      <DonateDialog open={dialogOpen} onClose={toggleDialog} />
      <AppBar
        position="static"
        sx={{
          borderRadius: theme.spacing(4),
          // Gaus blur background
          backdropFilter: "blur(10px)",
          backgroundColor: "linear-gradient(180deg, #000000 0%, #000000 100%)",
          position: "sticky",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src="/images/dewiLogo.png"
                alt="Dewi Logo"
                width={60}
                height={38}
              />

              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  marginInlineStart: theme.spacing(1),
                }}
              >
                EXPLORER
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem key={"stats"} onClick={handleNavMenuClick}>
                  <Typography textAlign="center">{"Stats"}</Typography>
                </MenuItem>
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleNavMenuClick}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem key={"github"} onClick={handleGithibLink}>
                  <Typography textAlign="center">{"Github"}</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Button
              onClick={toggleDialog}
              sx={{
                my: 2,
                color: "white",
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
                alignItems: "center",
                gap: theme.spacing(1),
              }}
            >
              <Favorite />
              Donate
            </Button>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Image
                src="/images/dewiLogo.png"
                alt="Dewi Logo"
                width={60}
                height={38}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                onClick={toggleDialog}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: theme.spacing(1),
                }}
              >
                <Favorite />
                Donate
              </Button>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleNavMenuClick}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
              <IconButton
                onClick={handleGithibLink}
                sx={{
                  height: theme.spacing(6),
                  width: theme.spacing(6),
                }}
              >
                <svg
                  height={theme.spacing(6)}
                  width={theme.spacing(6)}
                  style={{
                    borderRadius: "500px",
                  }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default ResponsiveAppBar;
