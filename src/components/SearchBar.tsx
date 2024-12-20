import React, { useState } from 'react';
import { TbCloudSearch } from 'react-icons/tb';
import { SiApachecloudstack } from 'react-icons/si';
import '../styles/components/a11y.css';
import '../styles/components/searchBar.css';

type SearchBarProps = {
  onSearch: (city: string) => void;
  loading: boolean;
};

const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (error) {
      setCity('');
      setError(null);
    } else {
      setCity(value);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (city.trim() === '') {
      setError('Please enter a city name.');
      return;
    } else if (/[^a-zA-Z\s]/.test(city)) {
      setError('Only letters and spaces.');
      return;
    }
    onSearch(city);  // Pass the valid city to the parent component
  };


  return (
    <form onSubmit={handleSubmit} role="search" className="search-form relative flex items-center">
      <label className="offscreen" htmlFor="search">Enter a city name:</label>

      <input
        id="search"
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder={error ? '' : 'Enter city name'}
        className={`placeholder focus:outline-none pl-3 pr-8 ${error ? 'border-2 border-gray-400' : 'border-2 border-gray-300'}`}
        role="searchbox"
        autoComplete="off"
      />

      <button type="submit" className="search-button flex items-center transform translate-x-[-6px]" aria-label="Submit Search">
        <TbCloudSearch
          className={`button stroke-[1.5] ${loading ? 'animate-spinScaleFade' : 'hidden'}`}
          size={40}
        />
        <SiApachecloudstack
          aria-hidden="true"
          className={`icon stroke-[0.13px] cursor-none ${loading || error ? 'hidden' : 'animate-scaleUpFadeIn'}`}
          size={50}
        />
      </button>

      {error && (
        <div className="display-alert absolute left-6 transform -translate-y-4 text-lg text-nowrap ml-1" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
