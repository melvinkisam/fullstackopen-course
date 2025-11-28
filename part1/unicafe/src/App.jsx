import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const setToBad = (bad, setBad) => () => {
  setBad(bad + 1)
}

const setToNeutral = (neutral, setNeutral) => () => {
  setNeutral(neutral + 1)
}

const setToGood = (good, setGood) => () => {
  setGood(good + 1)
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={props.good} />
        <StatisticsLine text="neutral" value={props.neutral} />
        <StatisticsLine text="bad" value={props.bad} />
        <StatisticsLine text="all" value={props.good + props.neutral + props.bad} />
        <StatisticsLine text="average" value={(props.good - props.bad) / (props.good + props.neutral + props.bad)} />
        <StatisticsLine text="positive" value={props.good / (props.good + props.neutral + props.bad) * 100 + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={setToGood(good, setGood)} text='good' />
      <Button onClick={setToNeutral(neutral, setNeutral)} text='neutral' />
      <Button onClick={setToBad(bad, setBad)} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App