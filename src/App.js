import React from "react";

import { convertToFlag } from "./utils";
import Weather from "./components/Weather";
class App extends React.Component {
  state = {
    location: "",
    isLoading: false,
    displayLocation: "",
    weather: {},
  };

  fetchWeather = async () => {
    if (this.state.location.length < 2) return this.setState({ weather: {} });
    try {
      this.setState({ isLoading: true });
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };
  componentDidMount() {
    this.setState({ location: localStorage.getItem("location") || "" });
  }
  componentDidUpdate(prevProps, PrevState) {
    if (this.state.location !== PrevState.location) {
      this.fetchWeather();
      localStorage.setItem("location", this.state.location);
    }
  }
  render() {
    return (
      <>
        <div className="app">
          <h1>Classy Weather</h1>
          <div>
            <input
              type="text"
              placeholder="Search For Location ..........."
              value={this.state.location}
              onChange={(e) => this.setState({ location: e.target.value })}
            />
          </div>
          <button onClick={this.fetchWeather} className="get-btn">
            {" "}
            Get Weather
          </button>
          {this.state.isLoading && <p>Loading ............</p>}
          {this.state.weather.time && (
            <Weather
              weather={this.state.weather}
              location={this.state.displayLocation}
            />
          )}
        </div>
      </>
    );
  }
}

export default App;
