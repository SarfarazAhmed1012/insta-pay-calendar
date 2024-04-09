import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScheduleCalendar from "./pages/schedule-calendar";
import SubscriptionCalendar from "./pages/subscription-calendar";
import IframeComponent from "./pages/test";
import RequestCalendar from "./pages/schedule-payment-request";
import SubscriptionRequest from "./pages/subscription-payment-request";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScheduleCalendar />} />
        <Route path="/scheduled/:token" element={<ScheduleCalendar />} />
        <Route path="/subscription/:token" element={<SubscriptionCalendar />} />
        <Route path="/request-scheduled/:token" element={<RequestCalendar />} />
        <Route
          path="/request-subscription/:token"
          element={<SubscriptionRequest />}
        />
        <Route
          path="/subscription-end-date/:token"
          element={<SubscriptionCalendarEndDate />}
        />
      </Routes>
    </BrowserRouter>
  );
}
