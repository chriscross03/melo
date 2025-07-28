import React from "react";
import { Modal } from "react-bootstrap";

const ComparisonModal = ({
  showComparison,
  setShowComparison,
  selectedCard,
  comparisonTarget,
  finishComparison,
}) => {
  return (
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
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              alignItems: "stretch",
              marginTop: "10px",
            }}
          >
            {[selectedCard, comparisonTarget].map((item) => (
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
        ) : (
          <p>We’ll start showing comparisons once you’ve rated more albums!</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ComparisonModal;
