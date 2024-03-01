import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import styled from "@emotion/styled";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Define custom styled components
const CustomDatePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CustomDatePickerWrapper = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
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

const SubscriptionCalendar = () => {
  const { token } = useParams();
  const [selectedDate, setSelectedDate] = React.useState(dayjs("2022-04-17"));
  const [selectedTime, setSelectedTime] = React.useState(
    dayjs("2022-04-17T15:30")
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false); // State for success

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl =
        "https://ip-dev-85ba34ddc4a3.herokuapp.com/api/webhook/set-schedule-calendar";
      const requestBody = {
        data: {
          token,
          date: selectedDate.format("DD-MM-YYYY"),
          time: selectedTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        },
      };
      console.log(requestBody);

      await axios.post(apiUrl, requestBody);
      console.log("Data submitted successfully");
      setSuccess(true); // Set success state to true
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomDatePickerContainer>
          <CustomDatePickerWrapper>
            <CustomLabel htmlFor="datepicker">Select a Date:</CustomLabel>
            <CustomDatePicker
              id="datepicker"
              value={selectedDate}
              onChange={setSelectedDate}
            />
            <CustomLabel htmlFor="timepicker">Select a Time:</CustomLabel>
            <MobileTimePicker
              id="timepicker"
              value={selectedTime}
              onChange={setSelectedTime}
            />
            <CustomSubmitButton onClick={handleSubmit} disabled={loading}>
              {loading ? "Proceeding..." : "Proceed"}
            </CustomSubmitButton>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* {success && <SuccessTick />} */}
          </CustomDatePickerWrapper>
        </CustomDatePickerContainer>
      </LocalizationProvider>
    </div>
  );
};

export default SubscriptionCalendar;
