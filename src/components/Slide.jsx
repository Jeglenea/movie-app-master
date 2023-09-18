import React, { useState, useEffect } from "react";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

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

const StyledBanner = styled("img")({
  width: "100%",
  cursor: "pointer",
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
`

const Title = styled(Typography)`
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function Slide({ movies }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [director, setDirector] = useState("Bilinmiyor");
  const [topActors, setTopActors] = useState([]);

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);

    // Film detayları için istek
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;

    // Film ekibi (crew) için istek
    const movieCrewUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=986fd9a832dc29e418d6705c077923df&language=en-US`;

    try {
      // Film detayları için istek
      const detailsResponse = await axios.get(movieDetailsUrl);
      const detailsData = detailsResponse.data;

      // Film ekibi (crew) için istek
      const crewResponse = await axios.get(movieCrewUrl);
      const crewData = crewResponse.data;

      // Yönetmeni bul ve ayarla
      const directorInfo = crewData.crew.find((crew) => crew.job === "Director");
      if (directorInfo) {
        setDirector(directorInfo.name);
      }

      // En üstteki 5 oyuncuyu bul ve ayarla
      const actors = crewData.cast.slice(0, 5);
      setTopActors(actors.map((actor) => actor.name));

      // Film türleri ve yayın yılına erişim
      const genres = detailsData.genres.map((genre) => genre.name).join(", ");
      const releaseYear = detailsData.release_date ? detailsData.release_date.slice(0, 4) : "Bilinmiyor";

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

  const handleClose = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
    setDirector("Bilinmiyor");
    setTopActors([]);
  };

  return (
    <Box style={{ marginTop: 20 }}>
      <Carousel
         swipeable={false}
         draggable={false}
         responsive={responsive}
         infinite={true}
         autoPlay={true}
         autoPlaySpeed={3000}
         keyBoardControl={true}
         showDots={false}
         slidesToSlide={1}
         containerClass="carousel-container"
         dotListClass="custom-dot-list-style"
         itemClass="carousel-item-padding-40-px"
         >
         {movies.map((movie) => (
           <div key={movie.id} onClick={() => handleMovieClick(movie)}>
             <StyledBanner
               src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
             />
             <Title>{movie.original_title}</Title>
           </div>
         ))}
       </Carousel>
 
       {/* Filmin Detayları için Dialog */}
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
                 src={`https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`}
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
                   <DirectorLink onClick={() => console.log("Yönetmen bilgisi")} >{director}</DirectorLink>
                 </MovieDetailItem>
 
                 <MovieDetailItem>
                   <Typography variant="h6">Lead Actors</Typography>
                   <Typography>{topActors.join(", ")}</Typography>
                 </MovieDetailItem>
               </MovieDetails>
             </DetailsContainer>
           </DialogContent>
           <DialogActions>
             <Button onClick={handleClose}>Kapat</Button>
           </DialogActions>
         </Dialog>
       )}
     </Box>
   );
 }
 
 export default Slide;