import React from "react";
import { formatDay, getWeatherIcon } from "../utils";

class Day extends React.Component {
  render() {
    const { date, max, min, code, isToday } = this.props;

    return (
      <li className="day">
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(date)}</p>
        <p>
          {Math.floor(min)} &deg; &mdash; {Math.ceil(max)} &deg;
        </p>
      </li>
    );
  }
}

export default Day;
