import React, { useEffect } from "react";

import { GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/lodersSlice";
import { useDispatch } from "react-redux";
import { message } from "antd";
import Dividerr from "../../Components/Dividerr";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";
import { useSelector } from "react-redux";

function Home({ isDarkMode, toggleDarkMode }) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status: "approved",
    category: [],
    age: [],
    search: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <div className="flex gap-5">
        {showFilters && (
          <Filters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        <div className="flex flex-col gap-5 w-full">
          <div className="flex gap-5 items-center">
            {/* Dark mode toggle button */}
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {isDarkMode ? (
                <i className="ri-sun-line"></i> // Light mode icon
              ) : (
                <i className="ri-moon-fill"></i> // Dark mode icon
              )}
            </button>

            {!showFilters && (
              <i
                className="ri-equalizer-line text-xl cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              ></i>
            )}
            <input
              type="text"
              placeholder="Search Products  here..."
              className="border border-gray-300 rounded border-solid px-2 py-1 h-14 w-full"
              //by gpt to add search functionality
              value={filters.search} // bind search state to input
              onChange={
                (e) => setFilters({ ...filters, search: e.target.value }) // update search state
              }
            />
          </div>
          <div
            className={`
      grid gap-5 ${
        showFilters
          ? "grid-cols-2 md:grid-cols-4"
          : "grid-cols-2 md:grid-cols-5"
      }
    `}
          >
            {products?.map((product) => {
              return (
                <div
                  className="border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer"
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images[0]}
                    className="w-full h-52 md:h-72 p-2 rounded-md object-cover"
                    alt=""
                  />
                  <div className="px-2 flex flex-col">
                    <h1 className="text-lg font-semibold">{product.name}</h1>
                    <p className="text-sm">
                      {product.age} {product.age === 1 ? " year" : " years"} old
                    </p>
                    <Dividerr />
                    <span className="text-xl font-semibold text-green-700">
                      ₹ {product.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
