import logo from "./logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Col,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./App.css";

import useSpotifyToken from "./hooks/useSpotifyToken";
import searchSpotify from "./utils/searchSpotify";
import handleRatingFn from "./utils/handleRating";
import finishComparisonFn from "./utils/finishComparison";

function App() {
  const [searchInput, setSearchInput] = useState("");
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
  const [selectedRankingType, setSelectedRankingType] = useState("album"); // album | track | artist
  const [topResults, setTopResults] = useState([]);
  const [currentTab, setCurrentTab] = useState("search");

  const accessToken = useSpotifyToken();
  // Search
  function search() {
    searchSpotify({
      accessToken,
      searchInput,
      setAlbums,
      setTracks,
      setArtists,
      setTopResults,
    });
  }

  function handleRating(category) {
    handleRatingFn({
      category,
      selectedCard,
      selectedType,
      ratings,
      setRatings,
      setShowModal,
      setShowComparison,
      setComparisonTarget,
      setBinaryCompareQueue,
      setBinaryIndexRange,
      ratedAlbums,
      ratedTracks,
      ratedArtists,
      albums,
      tracks,
      artists,
      setRatedAlbums,
      setRatedTracks,
      setRatedArtists,
    });
  }

  function finishComparison(preferred) {
    finishComparisonFn({
      preferred,
      selectedCard,
      selectedType,
      comparisonTarget,
      binaryCompareQueue,
      binaryIndexRange,
      ratings,
      setRatings,
      setShowComparison,
      setBinaryCompareQueue,
      setBinaryIndexRange,
      setComparisonTarget,
      albums,
      tracks,
      artists,
      ratedAlbums,
      ratedTracks,
      ratedArtists,
    });
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
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "1.1em",
              color: "#333",
            }}
          >
            How was this listen?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1.5rem",
              gap: "16px",
            }}
          >
            <div
              onClick={() => handleRating("liked")}
              style={{
                flex: 1,
                padding: "16px",
                backgroundColor: "#e6f4ea",
                borderRadius: "12px",
                border: "1px solid #cde3d1",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  fontSize: "1.5em",
                  fontWeight: "600",
                  color: "#356859",
                }}
              >
                Really liked it!
              </div>
            </div>

            <div
              onClick={() => handleRating("fine")}
              style={{
                flex: 1,
                padding: "16px",
                backgroundColor: "#fff9e6",
                borderRadius: "12px",
                border: "1px solid #f0e4bc",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  fontSize: "1.5em",
                  fontWeight: "600",
                  color: "#a17900",
                }}
              >
                It was fine
              </div>
            </div>

            <div
              onClick={() => handleRating("disliked")}
              style={{
                flex: 1,
                padding: "16px",
                backgroundColor: "#fceaea",
                borderRadius: "12px",
                border: "1px solid #f2c0c0",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  fontSize: "1.5em",
                  fontWeight: "600",
                  color: "#b93e3e",
                }}
              >
                Didn’t like it
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
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                  alignItems: "stretch",
                  marginTop: "10px",
                }}
              >
                {[selectedCard, comparisonTarget].map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => finishComparison(item)}
                    style={{
                      flex: 1,
                      maxWidth: "200px",
                      height: "300px",
                      padding: "16px",
                      backgroundColor: "#fdfdfd",
                      border: "1px solid #e0e0e0",
                      borderRadius: "16px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      textAlign: "center",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 6px 18px rgba(0,0,0,0.15)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)")
                    }
                  >
                    <img
                      src={
                        item.image ||
                        item.images?.[0]?.url ||
                        item.album?.images?.[0]?.url
                      }
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        backgroundColor: "#fffdf7",
                      }}
                    />
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "1.1em",
                        marginTop: "10px",
                        color: "#333",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                ))}
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
        {/* Header with Logo */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src={logo}
            alt="Melo Logo"
            style={{
              width: "140px",
              imageRendering: "pixelated",
              marginBottom: "-50px",
            }}
          />
        </div>
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

            {topResults.length > 0 && (
              <>
                <Row className="mx-2">
                  <Col md={6} className="d-flex flex-column">
                    <h4>Top Result</h4>
                    <div
                      className="flex-grow-1 d-flex flex-column"
                      style={{ height: "100%" }}
                    >
                      {topResults.slice(0, 1).map(({ type, item }, i) => (
                        <Card
                          key={i}
                          className="h-100 d-flex flex-column"
                          onClick={() => {
                            setSelectedCard({
                              ...item,
                              image:
                                item.image ||
                                item.images?.[0]?.url ||
                                item.album?.images?.[0]?.url,
                            });
                            setSelectedType(type);
                            setShowModal(true);
                          }}
                          style={{
                            cursor: "pointer",
                            height: "100%",
                            position: "relative",
                          }}
                        >
                          {ratings[item.id] && (
                            <div
                              style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                backgroundColor:
                                  ratings[item.id].category === "liked"
                                    ? "#81C784"
                                    : ratings[item.id].category === "fine"
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
                              {ratings[item.id].score.toFixed(1)}
                            </div>
                          )}
                          <div
                            style={{
                              width: "fit-content",
                              padding: "4px",
                              border: "3px dashed #decba4",
                              backgroundColor: "#fffdf7",
                              borderRadius: "12px",
                              display: "inline-block",
                            }}
                          >
                            <Card.Img
                              src={
                                item.image ||
                                item.images?.[0]?.url ||
                                item.album?.images?.[0]?.url
                              }
                              style={{
                                width: "250px",
                                height: "250px",
                                objectFit: "contain",
                                borderRadius: "12px",
                                backgroundColor: "#fffdf7",
                                display: "block",
                              }}
                            />
                          </div>
                          <Card.Body>
                            <Card.Title
                              style={{ fontSize: "2em", fontWeight: "bold" }}
                            >
                              {item.name}
                            </Card.Title>
                            {type !== "artist" && (
                              <Card.Text
                                style={{ fontSize: "1.2em", color: "#555" }}
                              >
                                {item.album_type.charAt(0).toUpperCase() +
                                  item.album_type.slice(1)}{" "}
                                ~ {item.artists?.[0]?.name}
                              </Card.Text>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Col>

                  <Col md={6}>
                    <h4>Tracks</h4>
                    <div style={{ maxHeight: "100%", overflowY: "auto" }}>
                      {tracks.slice(0, 6).map((track, i) => (
                        <div
                          key={i}
                          className="d-flex align-items-start mb-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedCard(track);
                            setSelectedType("track");
                            setShowModal(true);
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              width: "64px",
                              height: "64px",
                              marginRight: "12px",
                            }}
                          >
                            {ratings[track.id] && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor:
                                    ratings[track.id].category === "liked"
                                      ? "#81C784"
                                      : ratings[track.id].category === "fine"
                                      ? "#FFF176"
                                      : "#E57373",
                                  color: "#000",
                                  padding: "2px 6px",
                                  borderRadius: 12,
                                  fontSize: 10,
                                  fontWeight: "bold",
                                  zIndex: 2,
                                }}
                              >
                                {ratings[track.id].score.toFixed(1)}
                              </div>
                            )}
                            <img
                              src={track.image}
                              alt={track.name}
                              style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "8px",
                                border: "2px dashed #decba4",
                                backgroundColor: "#fffdf7",
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              {track.name}
                            </div>
                            <div style={{ fontSize: "0.9em", color: "#555" }}>
                              {track.artist}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
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
                        <div
                          style={{
                            padding: "4px",
                            border: "3px dashed #decba4",
                            backgroundColor: "#fffdf7",
                            borderRadius: "50%",
                          }}
                        >
                          <Card.Img
                            src={artist.image}
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              backgroundColor: "#fffdf7",
                            }}
                          />
                        </div>
                        <Card.Body>
                          <Card.Title>{artist.name}</Card.Title>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </Row>
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
                                ? "#b6e2a1"
                                : ratings[album.id].category === "fine"
                                ? "#fff6a5"
                                : "#f9bdbb",
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
                        <div
                          style={{
                            padding: "4px",
                            border: "3px dashed #decba4",
                            backgroundColor: "#fffdf7",
                            borderRadius: "12px",
                          }}
                        >
                          <Card.Img src={album.images?.[0]?.url} />
                        </div>
                        <Card.Body>
                          <Card.Title>{album.name}</Card.Title>
                          <Card.Text
                            style={{ fontSize: "0.9em", color: "#555" }}
                          >
                            {album.artist}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </Row>
              </>
            )}
          </>
        )}

        {currentTab === "rankings" && (
          <>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              My Rankings
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Button
                variant={
                  selectedRankingType === "album"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedRankingType("album")}
                style={{ marginRight: "10px" }}
              >
                Albums
              </Button>
              <Button
                variant={
                  selectedRankingType === "track"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedRankingType("track")}
                style={{ marginRight: "10px" }}
              >
                Tracks
              </Button>
              <Button
                variant={
                  selectedRankingType === "artist"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedRankingType("artist")}
              >
                Artists
              </Button>
            </div>

            {selectedRankingType === "album" &&
              (ratedAlbums.length === 0 ? (
                <p>You haven't rated any albums yet.</p>
              ) : (
                renderRankedList("album")
              ))}

            {selectedRankingType === "track" &&
              (ratedTracks.length === 0 ? (
                <p>You haven't rated any tracks yet.</p>
              ) : (
                renderRankedList("track")
              ))}

            {selectedRankingType === "artist" &&
              (ratedArtists.length === 0 ? (
                <p>You haven't rated any artists yet.</p>
              ) : (
                renderRankedList("artist")
              ))}
          </>
        )}
      </Container>
    </div>
  );
  function renderRankedList(type) {
    const allRated =
      type === "album"
        ? ratedAlbums
        : type === "track"
        ? ratedTracks
        : ratedArtists;

    // Filter ratings only for this type
    const ratedItems = Object.entries(ratings)
      .filter(([id, data]) => data.type === type)
      .sort((a, b) => b[1].score - a[1].score)
      .map(([id]) => allRated.find((item) => item.id === id))
      .filter(Boolean);

    if (ratedItems.length === 0) {
      return <p>No {type}s rated yet.</p>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {ratedItems.map((item, index) => {
          const scoreData = ratings[item.id];
          let scoreColor = "#81C784"; // green for liked

          if (scoreData.category === "fine") scoreColor = "#FFD54F"; // yellow
          if (scoreData.category === "disliked") scoreColor = "#E57373"; // red

          return (
            <div
              key={item.id}
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
                    item.image ||
                    item.images?.[2]?.url ||
                    item.images?.[0]?.url ||
                    item.album?.images?.[0]?.url
                  }
                  alt={item.name}
                  style={{ width: "50px", height: "50px", borderRadius: "4px" }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#1e1e1e",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.name}
                  </div>

                  {(type === "album" || type === "track") && item.artist && (
                    <div
                      style={{
                        color: "#bbb",
                        fontSize: "0.9em",
                        marginTop: "2px",
                      }}
                    >
                      {item.artist}
                    </div>
                  )}
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
