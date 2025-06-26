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
import { Modal } from "react-bootstrap";

const CLIENT_ID = "0842ae76a4a94dca9c80f872d67ac85d";
const CLIENT_SECRET = "eee5acafb8e8409fb2411f0975276fc8";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [ratings, setRatings] = useState({});

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

    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const data = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        searchInput +
        "&type=artist,track,album&limit=10",
      searchParameters
    ).then((response) => response.json());

    // Log full response for debugging
    console.log("Spotify API Response:", data);

    // Set state with full required info
    setArtists(
      data.artists?.items?.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.images?.[0]?.url || null,
      })) || []
    );

    setAlbums(
      data.albums?.items?.map((item) => ({
        id: item.id,
        name: item.name,
        images: item.images || [], // You use images[0] in JSX
      })) || []
    );

    setTracks(
      data.tracks?.items?.map((item) => ({
        id: item.id,
        name: item.name,
        artist: item.artists?.[0]?.name || "Unknown",
        image: item.album?.images?.[0]?.url || null,
      })) || []
    );
  }
  function handleRating(rating) {
    if (!selectedCard?.id) return;
    setRatings((prev) => ({
      ...prev,
      [selectedCard.id]: rating,
    }));
    console.log(`Rated "${selectedCard.name}" as: ${rating}`);
    setShowModal(false);
  }

  return (
    <div className="App">
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCard?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCard?.images?.[0]?.url && (
            <img
              src={selectedCard.images[0].url}
              alt={selectedCard.name}
              style={{ width: "100%", borderRadius: "12px" }}
            />
          )}
          <p style={{ marginTop: "1rem" }}>How was it?</p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            <div onClick={() => handleRating("liked")}>
              <div
                style={{
                  backgroundColor: "#C8E6C9",
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 8,
                }}
              >
                👍
              </div>
              <div style={{ fontSize: 14, color: "#444" }}>I liked it!</div>
            </div>

            <div onClick={() => handleRating("fine")}>
              <div
                style={{
                  backgroundColor: "#FFF9C4",
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 8,
                }}
              >
                😐
              </div>
              <div style={{ fontSize: 14, color: "#444" }}>It was fine</div>
            </div>

            <div onClick={() => handleRating("disliked")}>
              <div
                style={{
                  backgroundColor: "#FFCDD2",
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 8,
                }}
              >
                👎
              </div>
              <div style={{ fontSize: 14, color: "#444" }}>
                I didn’t like it
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

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
          {albums.map((album, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                zIndex: 0,
              }}
            >
              {ratings[album.id] && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor:
                      ratings[album.id] === "liked"
                        ? "#81C784"
                        : ratings[album.id] === "fine"
                        ? "#FFF176"
                        : "#E57373",
                    color: "#000",
                    padding: "4px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {ratings[album.id] === "liked"
                    ? "👍 Liked"
                    : ratings[album.id] === "fine"
                    ? "😐 Fine"
                    : "👎 Nope"}
                </div>
              )}

              <Card
                className="m-2"
                onClick={() => {
                  setSelectedCard(album);
                  setShowModal(true);
                }}
                style={{ cursor: "pointer", zIndex: 1 }}
              >
                <Card.Img src={album.images?.[0]?.url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
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
