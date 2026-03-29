import { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  images: string[];
  alt?: string;
  link?: string;
  title?: string;
}

const WorkImage = ({ images, alt, link, title }: Props) => {
  const [current, setCurrent] = useState(0);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (!isHover || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isHover, images.length]);

  return (
    <div
      className="work-image"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <a href={link} target="_blank" className="work-image-in">
        
        <img src={images[current]} alt={alt} />

        {/* 🔥 overlay */}
        <div className="work-overlay">
          <h4>{title}</h4>
          {link && (
            <span className="work-overlay-icon">
              <MdArrowOutward />
            </span>
          )}
        </div>

        {/* dots */}
        {images.length > 1 && (
          <div className="work-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={i === current ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(i);
                }}
              />
            ))}
          </div>
        )}
      </a>
    </div>
  );
};

export default WorkImage;