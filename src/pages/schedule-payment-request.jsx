import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import styled from "@emotion/styled";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTimezones } from "../contexts/TimezoneContext";

// Define custom styled components
const CustomDatePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 97vh;
  /* max-width: fit-content; */
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
  width: 240px; /* Adjust width as needed */
  height: 140px;
  margin-bottom: 20px; /* Add some spacing between the logo and the form */
`;
const SuccessImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
`;
const SuccessTick = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="green"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M9 16.2l-2.5-2.5L5 15l4 4 8-8-1.4-1.4-6.6 6.6z" />
  </svg>
);

const RequestCalendar = () => {
  const timezones = useTimezones();
  const { token } = useParams();
  const tomorrow = dayjs().add(1, "day"); // Get tomorrow's date

  const [selectedDate, setSelectedDate] = React.useState(tomorrow);
  const [selectedTime, setSelectedTime] = React.useState(
    dayjs("2022-04-17T15:30")
  );

  const [selectedTimezone, setSelectedTimezone] = React.useState(
    timezones?.timezones?.length > 0 ? timezones.timezones[0]?.timezone : ""
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const formattedTimezone = selectedTimezone.split("-")[1];

    try {
      const apiUrl =
        "https://ip-dev-85ba34ddc4a3.herokuapp.com/api/webhook/set-schedule-payment-request";
      const requestBody = {
        data: {
          token,
          date: selectedDate.format("DD-MM-YYYY"),
          time: selectedTime.format("h:mm A"),
          timezone: formattedTimezone,
        },
      };
      console.log(requestBody);

      await axios.post(apiUrl, requestBody);
      console.log("Data submitted successfully");
      setSuccess(true);
      // Automatically close the page after 3 seconds
      //   setTimeout(() => {
      //     window.close();
      //   }, 3000);
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
                />
              </div>
              <div
                style={{
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CustomLabel htmlFor="timepicker">Select a Time:</CustomLabel>
                <MobileTimePicker
                  id="timepicker"
                  value={selectedTime}
                  onChange={setSelectedTime}
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
                    <em>None</em>
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
              <CustomSubmitButton
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  cursor: `${loading ? "default" : "pointer"}`,
                }}
              >
                {loading ? "Proceeding..." : "Proceed"}
              </CustomSubmitButton>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {/* {success && <SuccessTick />} */}
            </CustomDatePickerWrapper>
          </CustomDatePickerContainer>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default RequestCalendar;
