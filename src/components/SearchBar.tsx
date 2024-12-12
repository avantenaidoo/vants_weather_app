import React, { useState } from 'react';
import { TbCloudSearch } from "react-icons/tb";
import { SiApachecloudstack } from "react-icons/si";
import '../styles/components/a11y.css';
import '../styles/components/searchBar.css'

type SearchBarProps = {
  onSearch: (city: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [city, setCity] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(city);
  };

  return (
    <form onSubmit={handleSubmit} role="search" className='search-form'>
      <label className="offscreen" htmlFor="search">Enter a city name:</label>
      <input
        id="search"
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder="Enter city name"
        className="focus:outline-none pl-3"
        role="searchbox"
      />
      <button type="submit" className="search-button" title="Lookup City" aria-label="Submit Search">
        <TbCloudSearch className="button1 stroke-[1.5]" size={40} />
        <SiApachecloudstack className='button2 hidden stroke-[0.19px]' size={40}/>
      </button>
    </form>
  );
};

export default SearchBar;