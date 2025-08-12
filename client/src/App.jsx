import logo from "./logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./App.css";
import useSpotifyToken from "./hooks/useSpotifyToken";
import searchSpotify from "./utils/searchSpotify";
import handleRatingFn from "./utils/handleRating";
import finishComparisonFn from "./utils/finishComparison";
import renderRankedList from "./utils/renderRankedList";
import RatingModal from "./components/RatingModal";
import ComparisonModal from "./components/ComparisonModal";
import RankingsTab from "./components/RankingsTab";
import SearchTab from "./components/SearchTab";

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
  const [dataLoaded, setDataLoaded] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedRatings = localStorage.getItem("ratings");
    const savedRatedAlbums = localStorage.getItem("ratedAlbums");
    const savedRatedTracks = localStorage.getItem("ratedTracks");
    const savedRatedArtists = localStorage.getItem("ratedArtists");

    if (savedRatings) setRatings(JSON.parse(savedRatings));
    if (savedRatedAlbums) setRatedAlbums(JSON.parse(savedRatedAlbums));
    if (savedRatedTracks) setRatedTracks(JSON.parse(savedRatedTracks));
    if (savedRatedArtists) setRatedArtists(JSON.parse(savedRatedArtists));

    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    localStorage.setItem("ratings", JSON.stringify(ratings));
    localStorage.setItem("ratedAlbums", JSON.stringify(ratedAlbums));
    localStorage.setItem("ratedTracks", JSON.stringify(ratedTracks));
    localStorage.setItem("ratedArtists", JSON.stringify(ratedArtists));
  }, [ratings, ratedAlbums, ratedTracks, ratedArtists]);

  const accessToken = useSpotifyToken();
  // Search
  async function search() {
    if (!searchInput.trim()) return; // avoid empty queries
    setLoading(true);
    try {
      await searchSpotify({
        accessToken,
        searchInput,
        setAlbums,
        setTracks,
        setArtists,
        setTopResults,
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!accessToken) return;
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      search();
    }, 400);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [searchInput, accessToken]);

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
  function renderRankedListWrapper(type) {
    return renderRankedList({
      type,
      ratings,
      ratedAlbums,
      ratedTracks,
      ratedArtists,
    });
  }

  return (
    <div className="App">
      <RatingModal
        show={showModal}
        onHide={() => setShowModal(false)}
        selectedCard={selectedCard}
        selectedType={selectedType}
        handleRating={handleRating}
      />
      <ComparisonModal
        showComparison={showComparison}
        setShowComparison={setShowComparison}
        selectedCard={selectedCard}
        comparisonTarget={comparisonTarget}
        finishComparison={finishComparison}
      />

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
          <SearchTab
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            search={search}
            loading={loading}
            topResults={topResults}
            ratings={ratings}
            setSelectedCard={setSelectedCard}
            setSelectedType={setSelectedType}
            setShowModal={setShowModal}
            tracks={tracks}
            artists={artists}
            albums={albums}
          />
        )}

        {currentTab === "rankings" && (
          <RankingsTab
            selectedRankingType={selectedRankingType}
            setSelectedRankingType={setSelectedRankingType}
            ratedAlbums={ratedAlbums}
            ratedTracks={ratedTracks}
            ratedArtists={ratedArtists}
            renderRankedListWrapper={renderRankedListWrapper}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
