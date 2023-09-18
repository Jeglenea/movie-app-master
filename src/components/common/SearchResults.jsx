import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";

// Boş poster yerine kullanılacak varsayılan fotoğraf URL'i
const defaultPoster =
  "https://fastly.picsum.photos/id/1035/200/300.jpg?hmac=744aBtkMLjfDyn2TzkMxsFzw2T0L57TMlNGFlX-Qgq0";

function SearchResults({ searchResults }) {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const openMovieInfo = (movie) => {
    setSelectedMovie(movie);
  };

  const closeMovieInfo = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <h2>Arama Sonuçları</h2>
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
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                style={{ display: "flex", marginBottom: 20 }}
              >
                <div style={{ flex: "1 1 auto" }}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
                        : defaultPoster
                    }
                    alt={movie.title}
                    style={{ maxWidth: "100%", cursor: "pointer" }}
                    onClick={() => openMovieInfo(movie)}
                  />
                </div>
                <div
                  style={{
                    flex: "2 2 auto",
                    marginLeft: 10,
                    textAlign: "center",
                  }}
                >
                  <h3>{movie.title}</h3>
                  <p>
                    <strong>Yıl:</strong>{" "}
                    {movie.release_date && movie.release_date.substring(0, 4)}
                  </p>
                  <p>
                    <strong>Puan:</strong> {movie.vote_average}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <MovieInfoModal
        selectedMovie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={closeMovieInfo}
      />
    </div>
  );
}

function MovieInfoModal({ selectedMovie, isOpen, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (selectedMovie) {
      // Film detayları için istek yapabilirsiniz
      const apiKey = "986fd9a832dc29e418d6705c077923df";
      const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${selectedMovie.id}?api_key=${apiKey}&language=en-US`;
  
      axios
        .get(movieDetailsUrl)
        .then((response) => {
          const movieDetailsData = response.data;
  
          // Elde edilen film detaylarını "movieDetails" state'ine ayarlayın
          setMovieDetails(movieDetailsData);
        })
        .catch((error) => {
          console.error("Error fetching movie details:", error);
        });
    }
  }, [selectedMovie]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md">
      {selectedMovie && (
        <>
          <DialogTitle>{selectedMovie.title}</DialogTitle>
          <DialogContent>
            {movieDetails ? (
              <Box display="flex">
                <div style={{ flex: 1 }}>
                  <img
                    src={
                      selectedMovie.poster_path
                        ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
                        : defaultPoster
                    }
                    alt={selectedMovie.title}
                    style={{ maxWidth: "100%" }}
                  />
                </div>
                <div style={{ flex: 2, marginLeft: 10 }}>
                  <Typography variant="h6">Açıklama</Typography>
                  <Typography>{selectedMovie.overview}</Typography>
                  

                </div>
              </Box>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Kapat</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default SearchResults;