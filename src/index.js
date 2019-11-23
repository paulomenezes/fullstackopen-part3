const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', req => JSON.stringify(req.body));

const app = express();
app.use(cors());
app.use(bodyParser());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'));
app.use(express.static('build'));

const random = () => Math.floor(Math.random() * 999999);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<br />${new Date()}</p>`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  persons = persons.filter(p => p.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const person = request.body;
  const id = random();

  if (!person.name) {
    return response.status(400).json({ error: 'name is required' });
  }

  if (!person.number) {
    return response.status(400).json({ error: 'number is required' });
  }

  if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id,
    name: person.name,
    number: person.name,
  };

  persons = persons.concat(newPerson);

  response.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
