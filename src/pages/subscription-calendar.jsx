import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import styled from "@emotion/styled";
import axios from "axios";
import { useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTimezones } from "../contexts/TimezoneContext";

// Styled components for custom styling
const CustomDatePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 97vh;
`;

const CustomDatePickerWrapper = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 80%;
`;

const CustomLabel = styled.label`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const CustomDatePicker = styled(MobileDatePicker)`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const CustomSubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  /* background-color: #007bff; */
  background: rgb(3, 51, 164);
  background: linear-gradient(
    310deg,
    rgba(3, 51, 164, 0.8) 16%,
    rgba(240, 11, 240, 0.8) 97%
  );
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: rgb(3, 51, 164);
    background: linear-gradient(
      310deg,
      rgba(3, 51, 164, 0.9668242296918768) 16%,
      rgba(240, 11, 240, 0.9472163865546218) 97%
    );
  }
`;

const LogoImage = styled.img`
  width: 240px;
  height: 140px;
  margin-bottom: 20px;
`;
const SuccessImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
`;

export default function SubscriptionCalendar() {
  const timezones = useTimezones();
  const tomorrow = dayjs().add(1, "day"); // Get tomorrow's date

  const [selectedTimezone, setSelectedTimezone] = React.useState(
    timezones?.timezones?.length > 0 ? timezones.timezones[0]?.timezone : ""
  );

  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { token } = useParams();
  console.log("Token:", token);

  //   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJJZCI6IjcyMjQ3NTUwMDc2MDgxMjMiLCJpbnN0YUNoYXRib3RJZCI6IjY1ZGVlYjFmNmM1MDJlZDliMGE1ZDdiZSIsImlhdCI6MTcwOTI3MTgyNCwiZXhwIjoxNzA5Mjg5ODI0fQ.O9Pz-6cEMB1F6h8mqPjGKAU6IRWQa_fUuwat63zZmFQ

  const handleSubmit = async () => {
    setSuccess(false);
    setLoading(true);
    setError(null);
    const formattedTimezone = selectedTimezone.split("-")[1];

    try {
      const apiUrl =
        "https://ip-dev-85ba34ddc4a3.herokuapp.com/api/webhook/set-subscription-calendar";
      const requestBody = {
        data: {
          token,
          date: selectedDate.format("DD-MM-YYYY"),
          timezone: formattedTimezone,
        },
      };
      console.log(requestBody);
      await axios.post(apiUrl, requestBody);
      console.log("Data submitted successfully");
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        width: "100%",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {success ? (
          <CustomDatePickerContainer>
            <SuccessImage
              src="https://cdn.iconscout.com/icon/premium/png-256-thumb/success-8634476-7012213.png"
              alt="Logo"
            />
          </CustomDatePickerContainer>
        ) : (
          <CustomDatePickerContainer>
            <LogoImage
              src="https://instapay-user.vercel.app/static/media/logo.3bf108bfae968aa09291ca566ff36a4e.svg"
              alt="Logo"
            />
            <CustomDatePickerWrapper>
              <div
                style={{
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CustomLabel htmlFor="datepicker">Select a Date:</CustomLabel>
                <MobileDatePicker
                  id="datepicker"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  disabled={loading}
                  minDate={tomorrow}
                />
              </div>
              <div
                style={{
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CustomLabel htmlFor="timepicker">
                  Select a Timezone:
                </CustomLabel>
                <Select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  displayEmpty
                  id="timezone"
                >
                  <MenuItem value="">
                    <em>System Default</em>
                  </MenuItem>
                  {timezones?.timezones.length > 0 &&
                    timezones?.timezones?.map((country, index) => (
                      <MenuItem
                        key={index}
                        value={country.name + "-" + country.timezone}
                      >
                        {`${country.name} - ${country.timezone}`}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <CustomSubmitButton
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  cursor: `${loading ? "default" : "pointer"}`,
                }}
              >
                {loading ? "Proceeding..." : "Proceed"}
              </CustomSubmitButton>
            </CustomDatePickerWrapper>
          </CustomDatePickerContainer>
        )}
      </LocalizationProvider>
    </div>
  );
}
