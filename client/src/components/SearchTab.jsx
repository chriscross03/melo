import React from "react";
import {
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  Card,
} from "react-bootstrap";

function SearchTab({
  searchInput,
  setSearchInput,
  search,
  loading,
  topResults,
  ratings,
  setSelectedCard,
  setSelectedType,
  setShowModal,
  tracks,
  artists,
  albums,
}) {
  return (
    <>
      <InputGroup className="mb-3" size="lg">
        <FormControl
          placeholder="Search for Artist, Album, or Track"
          type="input"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              search();
            }
          }}
        />
        <Button onClick={search}>Search</Button>
      </InputGroup>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div className="pixel-spinner">
            <div className="pixel-square"></div>
            <div className="pixel-square"></div>
            <div className="pixel-square"></div>
          </div>
          <p style={{ color: "#777", marginTop: "10px" }}>Searching...</p>
        </div>
      ) : (
        topResults.length > 0 && (
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
                        <div style={{ fontWeight: "bold" }}>{track.name}</div>
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
                      setSelectedType("artist");
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
                      setSelectedType("album");
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
                      <Card.Text style={{ fontSize: "0.9em", color: "#555" }}>
                        {album.artist}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Row>
          </>
        )
      )}
      {topResults.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh", // bigger to fill more of the blank area
            textAlign: "center",
            color: "#777",
          }}
        >
          <h1 style={{ fontSize: "3em", fontWeight: "bold" }}>
            🎵 welcome to melo 🎵
          </h1>
          <p style={{ fontSize: "1.5em", maxWidth: "600px" }}>
            Search for an artist, album, or track in the search bar above to
            start ranking your favorites! ⬆
          </p>
        </div>
      )}
    </>
  );
}

export default SearchTab;
