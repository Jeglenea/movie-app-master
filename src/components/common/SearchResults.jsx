import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {
  styled,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const ResultItem = styled("li")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "20px",
});

const DetailsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

const Poster = styled("img")({
  maxWidth: "50%",
  maxHeight: "400px", // Poster yüksekliğini ayarlayabilirsiniz
  objectFit: "cover", // Poster görüntüsünü düzgün bir şekilde sığdırmak için
});

const MovieDetails = styled("div")({
  flex: 1,
  padding: "20px",
});

const MovieDetailItem = styled("div")({
  marginBottom: "10px",
});

const DirectorLink = styled(Typography)`
  color: #1976d2;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// Boş poster yerine kullanılacak varsayılan fotoğraf URL'i
const defaultPoster =
  "https://fastly.picsum.photos/id/1035/200/300.jpg?hmac=744aBtkMLjfDyn2TzkMxsFzw2T0L57TMlNGFlX-Qgq0";

function SearchResults({ searchResults, platformFilter }) {
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [moviePlatform, setMoviePlatfrom] = useState(null);
  const [director, setDirector] = useState("Bilinmiyor");
  const [topActors, setTopActors] = useState([]);
  const [isVisible, setIsVisible] = useState(true); // isVisible state'i eklenmiş



  const yearsToFilter = [2023, 2022, 2021, 2020];
  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);

    // Film detayları için istek
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;

    // Film ekibi (crew) için istek
    const movieCrewUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;

    const moviePlatformUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;


    
    try {
      // Film detayları için istek
      const detailsResponse = await axios.get(movieDetailsUrl);
      const detailsData = detailsResponse.data;

      // Film ekibi (crew) için istek
      const crewResponse = await axios.get(movieCrewUrl);
      const crewData = crewResponse.data;

      // Film ekibi (crew) için istek
      const platformResponse = await axios.get(moviePlatformUrl);
      const platfromData = platformResponse.data;

      // Yönetmeni bul ve ayarla
      const directorInfo = crewData.crew.find(
        (crew) => crew.job === "Director"
      );
      if (directorInfo) {
        setDirector(directorInfo.name);
      }

      // En üstteki 5 oyuncuyu bul ve ayarla
      const actors = crewData.cast.slice(0, 5);
      setTopActors(actors.map((actor) => actor.name));

      // Film türleri ve yayın yılına erişim
      const genres = detailsData.genres.map((genre) => genre.name).join(", ");
      const releaseYear = detailsData.release_date
        ? detailsData.release_date.slice(0, 4)
        : "Bilinmiyor";

      const platforms = platfromData.results.US; // US yerine istediğiniz ülkenin kodunu kullanabilirsiniz
      setMoviePlatfrom(platforms);

      // Film detaylarını ayarla
      const movieDetails = {
        genres,
        releaseYear,
      };
      setMovieDetails(movieDetails);
    } catch (error) {
      console.error("Error while fetching movie details", error);
    }
  };
  const filterByYearRange = (movie) => {
    if (startYear === null || endYear === null) {
      return true;
    }
  
    const releaseYear = movie.release_date
      ? parseInt(movie.release_date.substring(0, 4))
      : null;
  
    return releaseYear >= startYear && releaseYear <= endYear;
  };
  const filteredResults = selectedYear
  ? searchResults.filter((movie) => {
      const releaseYear = movie.release_date
        ? parseInt(movie.release_date.substring(0, 4))
        : null;
      return releaseYear === selectedYear;
    })
  : searchResults;

  const handleClose = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
    setDirector("Bilinmiyor");
    setTopActors([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };



  return (
    <div>
       {isVisible && (
        <div>
          <IconButton
            style={{ position: "absolute", top: 10, right: 10 }}
            onClick={toggleVisibility}
            color="inherit"
            aria-label="Kapat"
          >
            <CloseIcon />
          </IconButton>
          {/* Filtreleme düğmelerini burada ekliyoruz */}
          <div>
            <h2>Filtreleme:</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {yearsToFilter.map((year) => (
                <li key={year}>
                  <button onClick={() => handleFilterByYear(year)}>{year}</button>
                </li>
              ))}
            </ul>
          </div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredResults.map((movie) => (
              <ResultItem
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
              >
                <Poster
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
                      : defaultPoster
                  }
                  alt={movie.title}
                  style={{ maxWidth: "100%", cursor: "pointer" }}
                />
                <div style={{ textAlign: "center" }}>
                  <h3>{movie.title}</h3>
                  <p>
                    <strong>Yıl:</strong>{" "}
                    {movie.release_date && movie.release_date.substring(0, 4)}
                  </p>
                  <p>
                    <strong>Puan:</strong> {movie.vote_average}
                  </p>
                </div>
              </ResultItem>
            ))}
          </ul>
        </div>
      )}
      {selectedMovie && movieDetails && (
        <Dialog
          open={Boolean(selectedMovie)}
          onClose={handleClose}
          maxWidth="md"
        >
          <DialogTitle>{selectedMovie.original_title}</DialogTitle>
          <DialogContent>
            <DetailsContainer>
              <Poster
                src={
                  selectedMovie.poster_path
                    ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
                    : defaultPoster
                }
                alt={selectedMovie.original_title}
              />
              <MovieDetails>
                <Typography variant="h6">Overview</Typography>
                <Typography>{selectedMovie.overview}</Typography>

                <MovieDetailItem>
                  <Typography variant="h6">Genres</Typography>
                  <Typography>{movieDetails.genres}</Typography>
                </MovieDetailItem>

                <MovieDetailItem>
                  <Typography variant="h6">Release Date</Typography>
                  <Typography>{movieDetails.releaseYear}</Typography>
                </MovieDetailItem>

                <MovieDetailItem>
                  <Typography variant="h6">Director</Typography>
                  <DirectorLink onClick={() => console.log("Yönetmen bilgisi")}>
                    {director}
                  </DirectorLink>
                </MovieDetailItem>

                <MovieDetailItem>
                  <Typography variant="h6">Lead Actors</Typography>
                  <Typography>{topActors.join(", ")}</Typography>
                </MovieDetailItem>
                <MovieDetailItem>
                  <Typography variant="h6">Platforms</Typography>
                  {moviePlatform &&
                    moviePlatform.flatrate &&
                    moviePlatform.flatrate.map((platform, index) => (
                      <Typography key={index}>
                        {platform.provider_name}
                      </Typography>
                    ))}
                </MovieDetailItem>
              </MovieDetails>
            </DetailsContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Kapat</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default SearchResults;
