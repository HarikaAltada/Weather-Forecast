import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { fetchFilteredData, FilterInput, Filter } from "./filterdata";
import { IUser, ResultsEntity } from "./IUsers";
import "./table.css";
import Header from "./Header";
const TableComponent: React.FC = () => {
  const [data, setData] = useState<ResultsEntity[]>([]);
  const [showFilterInputCity, setShowFilterInputCity] = useState(false);
  const [showFilterInputCountry, setShowFilterInputCountry] = useState(false);
  const [showFilterInputOther, setShowFilterInputOther] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offset}`;
      const response = await axios.get<IUser>(apiUrl);
      const results = response.data.results;
      if (results) {
        setData((prevData) => [...prevData, ...results]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [offset]);

  const fetchSortedData = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&order_by=${sortField}%20${sortOrder}&offset=${offset}`;
      const response = await axios.get<IUser>(apiUrl);
      const results = response.data.results;
      if (results) {
        setData(results);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching sorted data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sortField) {
      fetchSortedData();
    } else {
      fetchTableData();
    }
  }, [sortField, sortOrder, offset]);

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(
      sortField === field ? (sortOrder === "ASC" ? "DESC" : "ASC") : "ASC"
    );
  };

  const handleFilter = ({
    country,
    name,
    timezone,
  }: {
    country: string;
    name: string;
    timezone: string;
  }) => {
    setCountry(country);
    setName(name);
    setTimezone(timezone);
    setOffset(0);
    setSortField("");
    setSortOrder("ASC");
    setData([]);
    fetchFilteredData({
      country,
      name,
      timezone,
      setData,
      setLoading,
    });
  };

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight
    ) {
      setOffset((prevOffset) => prevOffset + 20);
    }
  };

  const refresh = () => {
    setOffset(0);
    setSortField("");
    setSortOrder("ASC");
    setData([]);
    fetchTableData();
  };
  useEffect(() => {
    if (country.trim() !== "") {
      setOffset(0);
      fetchFilteredData({
        country: country.trim().toLowerCase(),
        setData,
        setLoading,
      });
    } else {
      fetchTableData();
    }
  }, [country, offset]);

  useEffect(() => {
    if (name.trim() !== "") {
      setOffset(0);
      fetchFilteredData({
        name: name.trim().toLowerCase(),
        setData,
        setLoading,
      });
    } else {
      fetchTableData();
    }
  }, [name, offset]);

  useEffect(() => {
    if (timezone.trim() !== "") {
      setOffset(0);
      fetchFilteredData({
        timezone: timezone.trim().toLowerCase(),
        setData,
        setLoading,
      });
    } else {
      fetchTableData();
    }
  }, [timezone, offset]);

  const toggleFilterInputCity = () => {
    setShowFilterInputCity(!showFilterInputCity);
  };

  const toggleFilterInputCountry = () => {
    setShowFilterInputCountry(!showFilterInputCountry);
  };

  const toggleFilterInputOther = () => {
    setShowFilterInputOther(!showFilterInputOther);
  };
  return (
    <div className="flex justify-center ">
      <div className="max-w-screen-lg w-full p-4">
        <Header />
        <div className="mb-5">
          <Filter
            searchInput={name}
            setSearchInput={setName}
            handleSearch={() => handleFilter({ country, name, timezone })}
          />
        </div>
        <InfiniteScroll
          dataLength={data.length}
          next={fetchTableData}
          hasMore={true}
          loader={null}
          refreshFunction={refresh}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          scrollableTarget="scrollableDiv"
          onScroll={handleScroll}
          scrollThreshold={0.9} // Adjust this value if needed
          style={{ maxHeight: "600px", width: "100%" }}
        >
          <div
            className="overflow-x-auto bg-white rounded-lg shadow"
            style={{ maxHeight: "550px", overflowY: "auto" }}
            id="scrollableDiv"
            ref={containerRef}
          >
            <table className="w-full text-left table-auto min-w-max">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">
                    <span className="flex item-center">
                      City
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="h-4 w-4 ml-1 mt-1"
                        onClick={() => handleSort("name")}
                      >
                        <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-4 w-4 ml-1 mt-1"
                        onClick={toggleFilterInputCity}
                      >
                        <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                      </svg>
                    </span>
                    {showFilterInputCity && (
                      <FilterInput
                        searchInput={name}
                        setSearchInput={setName}
                        handleSearch={() =>
                          handleFilter({ country, name, timezone })
                        }
                      />
                    )}
                  </th>
                  <th className="px-4 py-2">
                    <span className="flex item-center">
                      Country
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="h-4 w-4 ml-1 mt-1"
                        onClick={() => handleSort("cou_name_en")}
                      >
                        <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-4 w-4 ml-1 mt-1"
                        onClick={toggleFilterInputCountry}
                      >
                        <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                      </svg>
                    </span>
                    {showFilterInputCountry && (
                      <FilterInput
                        searchInput={country}
                        setSearchInput={setCountry}
                        handleSearch={() =>
                          handleFilter({ country, name, timezone })
                        }
                      />
                    )}
                  </th>
                  <th className="px-4 py-2 flex flex-col item-center">
                    <span className="flex item-center">
                      Timezone
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="h-4 w-4 ml-1 mt-1"
                        onClick={() => handleSort("timezone")}
                      >
                        <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-4 w-4 ml-1 mt-1"
                        onClick={toggleFilterInputOther}
                      >
                        <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                      </svg>
                    </span>
                    {showFilterInputOther && (
                      <FilterInput
                        searchInput={timezone}
                        setSearchInput={setTimezone}
                        handleSearch={() =>
                          handleFilter({ country, name, timezone })
                        }
                      />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="even:bg-blue-gray-50/50"
                    style={{ cursor: "pointer" }}
                  >
                    <td className="px-4 py-2">
                      <Link to={`/forecast/${item.name}`}>{item.name}</Link>
                    </td>
                    <td className="px-4 py-2">
                      {" "}
                      <Link to={`/forecast/${item.name}`}>
                        {item.cou_name_en}
                      </Link>
                    </td>
                    <Link to={`/forecast/${item.name}`}>
                      <td className="px-4 py-2">{item.timezone}</td>
                    </Link>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default TableComponent;
