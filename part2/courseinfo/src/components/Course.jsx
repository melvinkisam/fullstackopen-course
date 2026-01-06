const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Sum parts={course.parts} />
    </div>
  )
}

const Header = ({ course }) => <h1>{course.name}</h1>

const Content = ({ course }) => (
  <div>
    {course.parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Sum = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p><strong>total of {total} exercises</strong></p>
}

export default Course