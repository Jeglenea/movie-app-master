import React from "react";

import { useState, useRef } from "react";
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
  width: 500px;
  border-radius: 5px;
`;

const Logo = styled("img")({
  width: 64,
});

function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [genreFilter, setGenreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const apiKey = "986fd9a832dc29e418d6705c077923df";
  const navigate = useNavigate();
  const anchorRef = useRef(null);

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
        setShowResults(true); // Arama sonuçlarını göster
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };
  const toggleSearchResults = () => {
    setShowResults((prev) => !prev);
  };

  const filteredResults = searchResults.filter((movie) => {
    // Kullanıcının seçtiği kriterlere göre filtreleme yapın
    const genreMatch = genreFilter === "" || movie.genres.includes(genreFilter);
    const platformMatch =
      platformFilter === "" ||
      (movie.moviePlatform &&
        movie.moviePlatform.flatrate &&
        movie.moviePlatform.flatrate.some(
          (platform) => platform.provider_name === platformFilter
        ));
    const yearMatch = yearFilter === "" || movie.releaseYear === yearFilter;

    // Tüm kriterlere uyan filmleri göster
    return genreMatch && platformMatch && yearMatch;
  });

  const sortedResults = filteredResults.sort((a, b) => {
    // IMDb puanına göre sıralamak için aşağıdaki sıralama işlemi kullanılabilir
    return b.vote_average - a.vote_average;
  });

  return (
    <AppBar style={{ minHeight: 56 }} position="static">
      <StyledToolBar>
        <Logo
          src={logoURL}
          alt="logo"
          onClick={() => navigate(routePath.home)}
        />
        <Box ref={anchorRef} onClick={handleToggle}>
          <MenuIcon />
          <Typography>Menu</Typography>
        </Box>
        <HeaderMenu
          handleToggle={handleToggle}
          open={open}
          anchorRef={anchorRef}
        />

        <Box style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <InputSearchField
              variant="outlined"
              placeholder="Film adı..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              style={{
                backgroundColor: "#121212",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "8px 16px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              type="submit"
            >
              Search
            </button>
          </form>
        </Box>

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

      {/* Arama sonuçlarını göstermek için kontrol ekledik */}
      {showResults && (
        <SearchResults
          searchResults={searchResults}
          onClose={toggleSearchResults}
        />
      )}
    </AppBar>
  );
}

export default Header;
