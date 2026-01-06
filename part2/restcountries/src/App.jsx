import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, handleChange }) => {
  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
    </div>
  )
}

const Country = ({ country, weather }) => {
  console.log(weather)
  return (
    <>
        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
        <h1>Weather in {country.capital}</h1>
        <div>Temperature {(weather?.current?.temp - 273.15).toFixed(2)} Celsius</div>
        <img
          src={`https://openweathermap.org/img/wn/${weather?.current?.weather[0]?.icon}.png`}
          alt="Weather icon"
        />
        <div>Wind: {weather?.current?.wind_speed} m/s</div>
    </>
  )
}

const Countries = ({ countriesToShow, selected, setSelected, weather }) => {
  if (countriesToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (selected) {
    const country = selected
    return (
      <div>
        <Country country={country} weather={weather} />
      </div>
    )
  }

  if (countriesToShow.length === 1) {
    const country = countriesToShow[0]
    return (
      <div>
        <Country country={country} weather={weather} />
      </div>
    )
  }

  return (
    <>
      {countriesToShow.map((country) => (
        <li key={country.cca2}>
          {country.name.common} <button onClick={() => setSelected(country)}>show</button>
        </li>
      ))}
    </>
  )
}

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const countriesToShow = countries.filter(country => 
    country.name.common.toLowerCase().includes(value.toLowerCase())
  )

  const matchCountry = countriesToShow.length === 1 ? countriesToShow[0] : null
  const matchCountryId = matchCountry?.cca2

  useEffect(() => {
    const countryWeather = matchCountry

    if (!countryWeather) {
      setWeather(null)
      return
    }

    if (!apiKey) {
      console.log('API key not set')
      setWeather(null)
      return
    }

    console.log('fetching weather for', countryWeather.name.common)

    const lat = countryWeather.latlng?.[0]
    const lon = countryWeather.latlng?.[1]
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`

    if (!url) {
      setWeather(null)
      return
    }

    axios.get(url)
      .then(res => setWeather(res.data))
      .catch(err => {
        console.error('failed to fetch weather', err)
        setWeather(null)
      })
  }, [matchCountry?.cca2, matchCountryId, apiKey])

  useEffect(() => {
    console.log('fetching countries...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (selected && !countries.some(c => c.ccn3 === selected.ccn3)) {
      setSelected(null)
    }
  }, [countries])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSelected(null)
  }

  return (
    <div>
      <Filter value={value} handleChange={handleChange} />
      <Countries countriesToShow={countriesToShow} selected={selected} setSelected={setSelected} weather={weather} />
    </div>
  )
}

export default App