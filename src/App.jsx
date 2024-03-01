import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScheduleCalendar from "./pages/schedule-calendar";
import SubscriptionCalendar from "./pages/subscription-calendar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScheduleCalendar />} />
        <Route path="/scheduled/:token" element={<ScheduleCalendar />} />
        <Route path="/subscription/:token" element={<SubscriptionCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}
