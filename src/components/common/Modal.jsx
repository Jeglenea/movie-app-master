import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function MovieInfoModal({ open, handleClose, movie }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{movie.title}</DialogTitle>
      <DialogContent>
        <img
          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
          alt={movie.title}
        />
        <p>Yıl: {movie.release_date && movie.release_date.substring(0, 4)}</p>
        <p>Puan: {movie.vote_average}</p>
        <p>{movie.overview}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MovieInfoModal;