import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { decryptData } from "../utils/decryption";

const TimezoneContext = createContext();

export const TimezonesProvider = ({ children }) => {
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ip-dev-85ba34ddc4a3.herokuapp.com/api/account/get-all-timezones"
        );
        const decryptedData = decryptData(response.data.data);
        setTimezones(
          decryptedData?.filteredTimezonesAccordingToCountryName || []
        );
        console.log("Decrypted data:", decryptedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezones }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezones = () => useContext(TimezoneContext);
