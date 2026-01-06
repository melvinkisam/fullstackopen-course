import { useState, useEffect } from 'react'
import personService from './services/person'
import Notification from './components/Notification'
import './index.css'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <>
      {personsToShow.map(person => 
        <li key={person.id}>
          {person.name} {person.number} <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
        </li>
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [addMessage, setAddMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setAddMessage({ text: `Changed ${newName} number`, type: 'added' })
            setTimeout(() => {
              setAddMessage(null)
            }, 3000)
          })
          .catch(error => {
            setAddMessage({ text: `Information of ${newName} has already been removed from server`, type: 'error' })
            setTimeout(() => {
              setAddMessage(null)
            }, 3000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setAddMessage({ text: `Added ${newName}`, type: 'added' })
        setTimeout(() => {
          setAddMessage(null)
        }, 3000)
      })

  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name} ?`)) return

    personService
      .remove(id)
      .then(response => {
        setAddMessage({ text: `Information of ${name} has been successfully removed from server`, type: 'added' })
        setTimeout(() => {
          setAddMessage(null)
        }, 3000)        
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        setAddMessage({ text: `Information of ${name} has already been removed from server`, type: 'error' })
        setTimeout(() => {
          setAddMessage(null)
        }, 3000)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={addMessage} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App 