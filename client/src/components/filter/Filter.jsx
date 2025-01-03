import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

const properties = [
  { label: "Tất cả", value: "" },
  { label: "Căn hộ", value: "apartment" },
  { label: "Căn nhà", value: "house" },
  { label: "Chung cư", value: "condo" },
  { label: "Đất", value: "land" },
];
const types = [
  { label: "Mua", value: "buy" },
  { label: "Thuê", value: "rent" },
];

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "buy",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Kết quả tìm kiếm <b>{query.city}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Vị trí</label>
          <input
            type="text"
            id="city"
            name="city"
            onChange={handleChange}
            value={query.city }
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Loại</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Bất động sản</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            value={query.property}
          >
            {properties.map((property) => (
              <option key={property.value} value={property.value}>
                {property.label}
              </option>
            ))}
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Giá thấp nhất</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Giá cao nhất</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Phòng ngủ</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="Tìm kiếm" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
