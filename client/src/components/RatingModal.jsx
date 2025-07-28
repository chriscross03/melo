import { Modal } from "react-bootstrap";

export default function RatingModal({
  show,
  onHide,
  selectedCard,
  selectedType,
  handleRating,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
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
        {selectedType !== "album" && selectedCard?.image && (
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
          {[
            {
              category: "liked",
              bg: "#e6f4ea",
              border: "#cde3d1",
              text: "Really liked it!",
              color: "#356859",
            },
            {
              category: "fine",
              bg: "#fff9e6",
              border: "#f0e4bc",
              text: "It was fine",
              color: "#a17900",
            },
            {
              category: "disliked",
              bg: "#fceaea",
              border: "#f2c0c0",
              text: "Didn’t like it",
              color: "#b93e3e",
            },
          ].map(({ category, bg, border, text, color }) => (
            <div
              key={category}
              onClick={() => handleRating(category)}
              style={{
                flex: 1,
                padding: "16px",
                backgroundColor: bg,
                borderRadius: "12px",
                border: `1px solid ${border}`,
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
                  color: color,
                }}
              >
                {text}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
