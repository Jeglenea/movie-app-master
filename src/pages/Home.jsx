import React from "react";

import { useEffect, useState } from "react";
import { categoryMovies } from "../services/apiKey";
import { NOWPLAYING_API_URL } from "../constants/constant";
import { Box, styled } from "@mui/material";

import SearchResults from "../components/common/Header";
import Header from "../components/common/Header";
import Banner from "../components/Banner";
import UpNext from "../components/UpNext";
import Slide from "../components/Slide";


const Container = styled(Box)`
  padding: 0 115px !important;
  padding: 20px;
`;

const Wrapper = styled(Box)`
  display: flex;
  padding: 20px;
`;


const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const getData = async () => {
      let response = await categoryMovies(NOWPLAYING_API_URL);
      setMovies(response.results);
    };
    getData();
  }, []);
  return (
    <React.Fragment>
      <Header />
      <Container>
        <Wrapper>

          <Banner movies={movies} />
          <UpNext movies={movies} />
        </Wrapper>
        <Slide movies={movies}></Slide>
        <Slide movies={movies}></Slide>
      </Container>
    </React.Fragment>
  );
};

export default Home;