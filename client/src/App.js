import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = "0842ae76a4a94dca9c80f872d67ac85d";
const CLIENT_SECRET = "eee5acafb8e8409fb2411f0975276fc8";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // Search
  async function search() {
    console.log("Search for " + searchInput);

    // Get request using search to get the Artist ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const searchResults = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        searchInput +
        "&type=artist,track,album&limit=10",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return {
          tracks:
            data.tracks?.items?.map((item) => ({
              id: item.id,
              name: item.name,
              artist: item.artists?.[0]?.name,
            })) || [],
          artists:
            data.artists?.items?.map((item) => ({
              id: item.id,
              name: item.name,
            })) || [],
          albums:
            data.albums?.items?.map((item) => ({
              id: item.id,
              name: item.name,
            })) || [],
        };
      });

    // Display those albums to the user
  }
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist, Album, or Track"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>

      <Container>
        <h3>Albums</h3>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            console.log("Album:", album); // 👈 This logs each album
            return (
              <Card key={i} className="m-2">
                <Card.Img src={album.images?.[0]?.url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>

        <h3 className="mt-4">Tracks</h3>
        <Row className="mx-2 row row-cols-4">
          {tracks.map((track, i) => (
            <Card key={i} className="m-2">
              <Card.Img src={track.image} />
              <Card.Body>
                <Card.Title>{track.name}</Card.Title>
                <Card.Text>By {track.artist}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>

        <h3 className="mt-4">Artists</h3>
        <Row className="mx-2 row row-cols-4">
          {artists.map((artist, i) => (
            <Card key={i} className="m-2">
              {artist.image && <Card.Img src={artist.image} />}
              <Card.Body>
                <Card.Title>{artist.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
