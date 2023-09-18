import React from "react";

import { useState, useRef } from "react"; // menu içerisindeki verileri kullanmak için
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  styled,
} from "@mui/material";
import { Menu as MenuIcon, BookmarkAdd, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { logoURL } from "../../constants/constant";
import { routePath } from "../../constants/route";
import axios from "axios";
// components
import HeaderMenu from "./HeaderMenu";
import SearchResults from "./SearchResults";

const StyledToolBar = styled(Toolbar)`
  background: #121212;
  min-height: 56px !important;
  padding: 0 115px !important;
  justify-content: space-between;
  & > * {
    padding: 0 16px;
  }
  & > div {
    display: flex;
    align-items: center;
    cursor: pointer;
    & > p {
      font-weight: 600;
      font-size: 14px;
    }
  }
  & > p {
    font-weight: 600;
    font-size: 14px;
  }
`;

const InputSearchField = styled(InputBase)`
  background: #ffffff;
  height: 30px;
  width: 55%;
  border-radius: 5px;
`;

const Logo = styled("img")({
  width: 64,
});

function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = "986fd9a832dc29e418d6705c077923df";
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: apiKey,
              query: searchQuery,
            },
          }
        );

        setSearchResults(response.data.results);
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };
  return (
    <AppBar style={{ minHeight: 56 }} position="static">
      <StyledToolBar>
        <Logo src={logoURL} alt="logo" onClick={() => navigate(routePath.home)} />
        <Box onClick={handleToggle}>
          <MenuIcon />
          <Typography>Menu</Typography>
        </Box>
        
        {/* Form ekleyin ve onSubmit ile handleSubmit fonksiyonunu çağırın */}
        <form onSubmit={handleSubmit}>
          <InputSearchField
            variant="outlined"
            placeholder="Film ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Ara</button>
        </form>
        <Typography>
          IMDb
          <Typography component="span" style={{ fontSize: 14 }}>
            Pro
          </Typography>
        </Typography>
        <Box>
          <BookmarkAdd />
          <Typography>Watchlist</Typography>
        </Box>
        <Box>
          <Typography>EN</Typography>
          <ExpandMore />
        </Box>
      </StyledToolBar>
      <SearchResults searchResults={searchResults} />
    </AppBar>

  );
}

export default Header;