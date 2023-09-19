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
import Select from "react-select";

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
  maxHeight: "400px",
  objectFit: "cover",
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

const defaultPoster =
  "https://fastly.picsum.photos/id/1035/200/300.jpg?hmac=744aBtkMLjfDyn2TzkMxsFzw2T0L57TMlNGFlX-Qgq0";

function SearchResults({ searchResults }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [moviePlatform, setMoviePlatfrom] = useState(null);
  const [director, setDirector] = useState("Bilinmiyor");
  const [topActors, setTopActors] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const genresToFilter = ["Action", "Drama", "Comedy", "Science Fiction"];
  const yearsToFilter = [2023, 2022, 2021, 2020];

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);

    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;
    const movieCrewUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;
    const moviePlatformUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;

    try {
      const detailsResponse = await axios.get(movieDetailsUrl);
      const detailsData = detailsResponse.data;

      const crewResponse = await axios.get(movieCrewUrl);
      const crewData = crewResponse.data;

      const platformResponse = await axios.get(moviePlatformUrl);
      const platfromData = platformResponse.data;

      const directorInfo = crewData.crew.find(
        (crew) => crew.job === "Director"
      );
      if (directorInfo) {
        setDirector(directorInfo.name);
      }

      const actors = crewData.cast.slice(0, 5);
      setTopActors(actors.map((actor) => actor.name));

      const genres = detailsData.genres.map((genre) => genre.name).join(", ");
      const releaseYear = detailsData.release_date
        ? detailsData.release_date.slice(0, 4)
        : "Bilinmiyor";

      const platforms = platfromData.results.US;
      setMoviePlatfrom(platforms);

      const movieDetails = {
        genres,
        releaseYear,
      };
      setMovieDetails(movieDetails);
    } catch (error) {
      console.error("Error while fetching movie details", error);
    }
  };
  const handleFilterByGenre = (selectedOptions) => {
    setSelectedGenres(selectedOptions);
  };

  const handleFilterByYear = (selectedOption) => {
    setSelectedYear(selectedOption);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      maxWidth: "200px",
    }),
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      width: "50%",
      display: "inline-block",
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: 0,
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "12px",
      color: "black", // Seçeneklerin rengi siyah
    }),
  };

  const filteredResults = searchResults.filter((movie) => {
    const releaseYear = movie.release_date
      ? parseInt(movie.release_date.substring(0, 4))
      : null;

    const movieGenres = movieDetails?.genres
      ? movieDetails.genres.split(", ")
      : [];

    const yearFilterCondition =
      !selectedYear || (releaseYear && releaseYear === selectedYear.value);

    const genreFilterCondition =
      selectedGenres.length === 0 ||
      selectedGenres.every((genre) => movieGenres.includes(genre.value));

    return yearFilterCondition && genreFilterCondition;
  });

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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{ marginRight: "10px", width: "500px", height: "100px" }}
            >
              <h2 style={{ fontSize: "12px", marginBottom: "5px" }}>
                Türlere Göre Filtrele:
              </h2>
              <Select
                isMulti
                options={genresToFilter.map((genre) => ({
                  label: genre,
                  value: genre,
                }))}
                value={selectedGenres}
                onChange={handleFilterByGenre}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    color: "black",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "lightskyblue"
                      : "white",
                    color: "black",
                  }),
                }}
                isClearable={true}
              />
            </div>
            <div style={{ width: "500px", height: "100px" }}>
              <h2 style={{ fontSize: "12px", marginBottom: "5px" }}>
                Yıllara Göre Filtrele:
              </h2>
              <Select
                options={yearsToFilter.map((year) => ({
                  label: year,
                  value: year,
                }))}
                value={selectedYear}
                onChange={handleFilterByYear}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    color: "black",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "lightskyblue"
                      : "white",
                    color: "black",
                  }),
                }}
                isClearable={true}
              />
            </div>
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
