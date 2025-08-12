import React from "react";
import { Button } from "react-bootstrap";

function RankingsTab({
  selectedRankingType,
  setSelectedRankingType,
  ratedAlbums,
  ratedTracks,
  ratedArtists,
  renderRankedListWrapper,
}) {
  return (
    <>
      <h3 style={{ textAlign: "left", marginBottom: "20px" }}>My Rankings</h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          variant={
            selectedRankingType === "album" ? "primary" : "outline-primary"
          }
          onClick={() => setSelectedRankingType("album")}
          style={{ marginRight: "10px" }}
        >
          Albums
        </Button>
        <Button
          variant={
            selectedRankingType === "track" ? "primary" : "outline-primary"
          }
          onClick={() => setSelectedRankingType("track")}
          style={{ marginRight: "10px" }}
        >
          Tracks
        </Button>
        <Button
          variant={
            selectedRankingType === "artist" ? "primary" : "outline-primary"
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
          renderRankedListWrapper("album")
        ))}

      {selectedRankingType === "track" &&
        (ratedTracks.length === 0 ? (
          <p>You haven't rated any tracks yet.</p>
        ) : (
          renderRankedListWrapper("track")
        ))}

      {selectedRankingType === "artist" &&
        (ratedArtists.length === 0 ? (
          <p>You haven't rated any artists yet.</p>
        ) : (
          renderRankedListWrapper("artist")
        ))}
    </>
  );
}

export default RankingsTab;
