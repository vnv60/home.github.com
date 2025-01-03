import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = [
  { label: "Mua", value: "buy" },
  { label: "Thuê", value: "rent" },
];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
    bedroom: "",
    
  });

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => setQuery((prev) => ({ ...prev, type: type.value }))}
            className={query.type === type.value ? "active" : ""}
          >
            {type.label}
          </button>
        ))}
      </div>
      <form>
        <input
          type="text"
          name="city"
          placeholder="Thành phố"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Giá thấp nhất"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Giá cao nhất"
          onChange={handleChange}
        />
        
        <Link className="linkbutton"
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button>
            <img src="/search.png" alt="Tìm kiếm" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
