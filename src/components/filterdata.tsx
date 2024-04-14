import axios from "axios";
import React from "react";
import { IUser, ResultsEntity } from "./IUsers";

export interface FilterDataProps {
  country?: string;
  name?: string;
  timezone?: String;
  setData: React.Dispatch<React.SetStateAction<ResultsEntity[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const fetchFilteredData = async ({
  country,
  name,
  timezone,
  setData,
  setLoading,
}: FilterDataProps) => {
  setLoading(true);
  try {
    let apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=search(cou_name_en%2C%22${country}%22)`;

    if (name) {
      apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=Search(name%2C%22${name}%22)&limit=20`;
    }

    if (timezone) {
      apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=Search(timezone%2C%22${timezone}%22)&limit=20`;
    }

    const response = await axios.get<IUser>(apiUrl);
    const results = response.data.results;
    if (results) {
      setData(results);
      setLoading(false);
    }
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    setLoading(false);
  }
};

export const FilterInput: React.FC<{
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}> = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="search.."
        className="border border-gray-400 p-1 rounded"
      />
    </div>
  );
};
export const Filter: React.FC<{
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}> = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <form action="/search" className="max-w-[480px] w-full px-4">
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="search.."
          className="w-full border h-12 shadow p-4 rounded-full dark:text-gray-800 dark:border-gray-700 dark:bg-gray-200"
        />
      </div>
    </form>
  );
};
