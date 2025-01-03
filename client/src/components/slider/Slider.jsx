import { useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(0); // Đang chọn ảnh nào
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal có mở không
  const [isZoomed, setIsZoomed] = useState(false); // Trạng thái thu nhỏ/phóng to ảnh

  const toggleZoom = () => {
    setIsZoomed((prevZoom) => !prevZoom); // Chuyển đổi giữa phóng to và thu nhỏ
  };

  const handleImageClick = (index) => {
    setImageIndex(index);
    setIsModalOpen(true); // Mở modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal
    setIsZoomed(false); // Đặt lại trạng thái thu nhỏ/phóng to
  };

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    } else {
      setImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }
  };

  return (
    <div className="slider">
      <div className="bigImage">
        <img
          src={images[imageIndex]}
          alt=""
          onClick={() => setImageIndex(imageIndex)}
          onDoubleClick={() => handleImageClick(imageIndex)}
        />
      </div>
      <div className="smallImages">
        {images.map((image, index) => (
          <img
            src={image}
            alt=""
            key={index}
            className={index === imageIndex ? "active" : ""}
            onClick={() => setImageIndex(index)}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <div className="arrow left" onClick={() => changeSlide("left")}>
              ❮
            </div>
            <img
              src={images[imageIndex]}
              alt=""
              style={{
                transform: isZoomed ? "scale(1.5)" : "scale(1)",
              }}
              onDoubleClick={toggleZoom} // Nhấn đúp để phóng to/thu nhỏ
            />
            <div className="arrow right" onClick={() => changeSlide("right")}>
              ❯
            </div>
          </div>
          <div className="modalClose" onClick={closeModal}>
            ✕
          </div>
        </div>
      )}
    </div>
  );
}

export default Slider;
