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
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonTarget, setComparisonTarget] = useState(null);
  const [binaryCompareQueue, setBinaryCompareQueue] = useState([]);
  const [binaryIndexRange, setBinaryIndexRange] = useState([0, 0]);
  const [ratedAlbums, setRatedAlbums] = useState([]);
  const [ratedTracks, setRatedTracks] = useState([]);
  const [ratedArtists, setRatedArtists] = useState([]);
  const [selectedType, setSelectedType] = useState("album"); // "album", "track", or "artist"

  const [currentTab, setCurrentTab] = useState("search");

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
  function handleRating(category) {
    if (!selectedCard?.id || !selectedType) return;

    const id = selectedCard.id;

    // Determine the correct setRatedX function
    const setRatedFn =
      selectedType === "album"
        ? setRatedAlbums
        : selectedType === "track"
        ? setRatedTracks
        : setRatedArtists;

    // Add to rated list if not already there
    setRatedFn((prev) => {
      if (prev.find((item) => item.id === id)) return prev;
      return [...prev, selectedCard];
    });

    // Find all items of same type and category
    const sameCategoryIds = Object.keys(ratings).filter(
      (id) =>
        ratings[id].category === category && ratings[id].type === selectedType
    );

    if (sameCategoryIds.length === 0) {
      let startScore =
        category === "fine" ? 5.0 : category === "disliked" ? 1.0 : 10.0;

      setRatings((prev) => ({
        ...prev,
        [id]: { category, score: startScore, type: selectedType },
      }));
      setShowModal(false);
      return;
    }

    const sortedIds = sameCategoryIds
      .map((id) => ({ id, score: ratings[id].score }))
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.id);

    setBinaryCompareQueue(sortedIds);
    setBinaryIndexRange([0, sortedIds.length - 1]);

    const allRated =
      selectedType === "album"
        ? ratedAlbums
        : selectedType === "track"
        ? ratedTracks
        : ratedArtists;

    const mid = Math.floor((0 + sortedIds.length - 1) / 2);
    const target =
      (selectedType === "album"
        ? albums
        : selectedType === "track"
        ? tracks
        : artists
      ).find((a) => a.id === sortedIds[mid]) ||
      allRated.find((a) => a.id === sortedIds[mid]);

    setComparisonTarget(target);
    setShowComparison(true);
    setShowModal(false);
  }

  function finishComparison(preferred) {
    if (!comparisonTarget || !selectedCard) return;

    const id = selectedCard.id;
    const category = ratings[comparisonTarget.id].category;
    const type = selectedType;

    const sortedEntries = binaryCompareQueue
      .map((id) => ({
        id,
        score: ratings[id].score,
      }))
      .sort((a, b) => b.score - a.score);

    let [min, max] = binaryIndexRange;
    const mid = Math.floor((min + max) / 2);
    const midId = sortedEntries[mid].id;

    if (preferred.id === id) {
      max = mid - 1;
    } else {
      min = mid + 1;
    }

    if (min > max) {
      const newList = [...sortedEntries];
      newList.splice(min, 0, { id });

      let startScore =
        category === "fine" ? 5.0 : category === "disliked" ? 1.0 : 10.0;
      const newRatings = { ...ratings };

      for (let i = 0; i < newList.length; i++) {
        const itemId = newList[i].id;
        newRatings[itemId] = {
          category,
          score: parseFloat((startScore - i * 0.1).toFixed(2)),
          type,
        };
      }

      setRatings(newRatings);
      setShowComparison(false);
      setBinaryCompareQueue([]);
      return;
    }

    const nextMid = Math.floor((min + max) / 2);
    const nextId = sortedEntries[nextMid].id;

    const allRated =
      type === "album"
        ? ratedAlbums
        : type === "track"
        ? ratedTracks
        : ratedArtists;

    const nextTarget =
      (type === "album" ? albums : type === "track" ? tracks : artists).find(
        (a) => a.id === nextId
      ) || allRated.find((a) => a.id === nextId);

    setComparisonTarget(nextTarget);
    setBinaryIndexRange([min, max]);
  }

  return (
    <div className="App">
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCard?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType === "album" && selectedCard?.images?.[0]?.url && (
            <img
              src={selectedCard.images[0].url}
              alt={selectedCard.name}
              style={{ width: "100%", borderRadius: "12px" }}
            />
          )}
          {selectedType === "artist" && (
            <img
              src={selectedCard.image}
              alt={selectedCard.name}
              style={{ width: "100%", borderRadius: "12px" }}
            />
          )}
          {selectedType === "track" && (
            <img
              src={selectedCard.image}
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

      <Modal
        show={showComparison}
        onHide={() => setShowComparison(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {comparisonTarget ? "Which do you prefer?" : "Thanks for rating!"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {comparisonTarget ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div onClick={() => finishComparison(selectedCard)}>
                  <img
                    src={
                      selectedCard.image ||
                      selectedCard.images?.[0]?.url ||
                      selectedCard.album?.images?.[0]?.url
                    }
                    alt={selectedCard.name}
                    style={{
                      width: "100px",
                      borderRadius: "12px",
                      marginBottom: 8,
                    }}
                  />
                  <p>{selectedCard.name}</p>
                </div>

                <div onClick={() => finishComparison(comparisonTarget)}>
                  <img
                    src={
                      comparisonTarget.image ||
                      comparisonTarget.images?.[0]?.url ||
                      comparisonTarget.album?.images?.[0]?.url
                    }
                    alt={comparisonTarget.name}
                    style={{
                      width: "100px",
                      borderRadius: "12px",
                      marginBottom: 8,
                    }}
                  />
                  <p>{comparisonTarget.name}</p>
                </div>
              </div>
            </>
          ) : (
            <p>
              We’ll start showing comparisons once you’ve rated more albums!
            </p>
          )}
        </Modal.Body>
      </Modal>

      <Container>
        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <Button
            variant={currentTab === "search" ? "primary" : "outline-primary"}
            onClick={() => setCurrentTab("search")}
            style={{ marginRight: "10px" }}
          >
            Search
          </Button>
          <Button
            variant={currentTab === "rankings" ? "primary" : "outline-primary"}
            onClick={() => setCurrentTab("rankings")}
          >
            Rankings
          </Button>
        </div>

        {/* Conditional Content */}
        {currentTab === "search" && (
          <>
            <InputGroup className="mb-3" size="lg">
              <FormControl
                placeholder="Search for Artist, Album, or Track"
                type="input"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    search();
                  }
                }}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <Button onClick={search}>Search</Button>
            </InputGroup>

            <h3>Albums</h3>
            <Row className="mx-2 row row-cols-4">
              {albums.map((album, i) => (
                <div key={i} style={{ position: "relative" }}>
                  {ratings[album.id] && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor:
                          ratings[album.id].category === "liked"
                            ? "#81C784"
                            : ratings[album.id].category === "fine"
                            ? "#FFF176"
                            : "#E57373",
                        color: "#000",
                        padding: "4px 8px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      {ratings[album.id].score.toFixed(1)}
                    </div>
                  )}

                  <Card
                    className="m-2"
                    onClick={() => {
                      setSelectedCard(album);
                      setSelectedType("album"); // or "artist"
                      setShowModal(true);
                    }}
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                    }}
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
                <div key={i} style={{ position: "relative" }}>
                  {ratings[track.id] && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor:
                          ratings[track.id].category === "liked"
                            ? "#81C784"
                            : ratings[track.id].category === "fine"
                            ? "#FFF176"
                            : "#E57373",
                        color: "#000",
                        padding: "4px 8px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      {ratings[track.id].score.toFixed(1)}
                    </div>
                  )}

                  <Card
                    className="m-2"
                    onClick={() => {
                      setSelectedCard(track);
                      setSelectedType("track"); // or "artist"
                      setShowModal(true);
                    }}
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Card.Img src={track.image} />
                    <Card.Body>
                      <Card.Title>{track.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Row>

            <h3 className="mt-4">Artists</h3>
            <Row className="mx-2 row row-cols-4">
              {artists.map((artist, i) => (
                <div key={i} style={{ position: "relative" }}>
                  {ratings[artist.id] && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor:
                          ratings[artist.id].category === "liked"
                            ? "#81C784"
                            : ratings[artist.id].category === "fine"
                            ? "#FFF176"
                            : "#E57373",
                        color: "#000",
                        padding: "4px 8px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      {ratings[artist.id].score.toFixed(1)}
                    </div>
                  )}

                  <Card
                    className="m-2"
                    onClick={() => {
                      setSelectedCard(artist);
                      setSelectedType("artist"); // or "artist"
                      setShowModal(true);
                    }}
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Card.Img src={artist.image} />
                    <Card.Body>
                      <Card.Title>{artist.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Row>
          </>
        )}

        {currentTab === "rankings" && (
          <>
            <h3>Your Album Rankings</h3>
            {ratedAlbums.length === 0 ? (
              <p>You haven't rated any albums yet.</p>
            ) : (
              <>
                <h5>Liked</h5>
                {renderRankedList("liked", "album")}

                <h5 className="mt-3">Fine</h5>
                {renderRankedList("fine", "album")}

                <h5 className="mt-3">Disliked</h5>
                {renderRankedList("disliked", "album")}
              </>
            )}

            <h3>Your Track Rankings</h3>
            <h5>Liked</h5>
            {renderRankedList("liked", "track")}
            <h5 className="mt-3">Fine</h5>
            {renderRankedList("fine", "track")}
            <h5 className="mt-3">Disliked</h5>
            {renderRankedList("disliked", "track")}

            <h3 className="mt-4">Your Artist Rankings</h3>
            <h5>Liked</h5>
            {renderRankedList("liked", "artist")}
            <h5 className="mt-3">Fine</h5>
            {renderRankedList("fine", "artist")}
            <h5 className="mt-3">Disliked</h5>
            {renderRankedList("disliked", "artist")}
          </>
        )}
      </Container>
    </div>
  );
  function renderRankedList(category, type) {
    const allRated =
      type === "album"
        ? ratedAlbums
        : type === "track"
        ? ratedTracks
        : ratedArtists;

    const ranked = Object.entries(ratings)
      .filter(([id, data]) => data.category === category && data.type === type)
      .sort((a, b) => b[1].score - a[1].score)
      .map(([id]) => allRated.find((item) => item.id === id))
      .filter(Boolean);

    if (ranked.length === 0) {
      return <p>No {type}s rated in this category.</p>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {ranked.map((album, index) => {
          const scoreData = ratings[album.id];
          let scoreColor = "#81C784"; // green for liked

          if (scoreData.category === "fine") scoreColor = "#FFD54F"; // yellow
          if (scoreData.category === "disliked") scoreColor = "#E57373"; // red

          return (
            <div
              key={album.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "8px",
                borderColor: "black",
                border: "1px solid #1e1e1e",
              }}
            >
              {/* Left: Index, Image, Info */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div style={{ width: "20px", color: "#aaa" }}>{index + 1}</div>
                <img
                  src={
                    album.image ||
                    album.images?.[2]?.url ||
                    album.images?.[0]?.url ||
                    album.album?.images?.[0]?.url
                  }
                  alt={album.name}
                  style={{ width: "50px", height: "50px", borderRadius: "4px" }}
                />
                <div>
                  <div style={{ fontWeight: "bold", color: "#1e1e1e" }}>
                    {album.name}
                  </div>
                  <div style={{ color: "#bbb", fontSize: "0.9em" }}>
                    {album.artists?.[0]?.name}
                  </div>
                </div>
              </div>

              {/* Right: Score Badge */}
              <div
                style={{
                  backgroundColor: scoreColor,
                  color: "#000",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  minWidth: "40px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {scoreData.score.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
