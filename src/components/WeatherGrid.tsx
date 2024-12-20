import React from 'react';
import '../styles/components/a11y.css';
import '../styles/components/weatherGrid.css';

import { TbCloudSearch } from "react-icons/tb";
import { SiApachecloudstack } from "react-icons/si";

type WeatherGridProps = {
  weatherData: Array<{
    date: string;
    temperature: number;
    description: string;
    icon: string;
  }>;
  onDayClick: (date: string) => void;
};

const WeatherGrid = ({ weatherData, onDayClick }: WeatherGridProps) => {
  return (
    <div className='grid-container p-3 rounded-xl shadow-lg max-w-lg mx-auto'>
      <h2 className='offscreen'>3 Day History and Forecast</h2>
      <div className="daily-tiles" role='region' aria-labelledby='insert field'>
        <TbCloudSearch />
        <TbCloudSearch />
        <TbCloudSearch />
        <SiApachecloudstack />
        <SiApachecloudstack />
        <SiApachecloudstack /> 
      </div>
    </div>
  );
};

export default WeatherGrid;