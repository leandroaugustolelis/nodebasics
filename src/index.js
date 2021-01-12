const express = require('express')
const { v4, validate } = require('uuid');

const app = express();

app.use(express.json());         //Fazer o express identificar que API pode receber formato JSON

/**
 * Métodos HTTP
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 * 
 */

 /**
  * 
  * QUERY PARAMS: Filtros e Paginação
  * ROUTE PARAMS: Identificar recursos(atualizar/deletar)
  * REQUEST BODY: Conteúdo na hora de criar ou ediar um recurso(JSON)
  * 
  */

  /**
   * 
   * MIDDLEWARES: Interceptador de requisições que podem interromper ou alterar dados da requisição
   * 
   */

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel);

  next();  //Próximo middleware

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!validate(id)) {
    return response.status(400).json({ error: 'Invalid Project ID' })
  }

  return next();
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  const { name } = request.query;

  // const results = projects.find(project => project.name === name)

  const results = name
    ? projects.filter(project => project.name.includes(name))
    : projects

  return response.json(results)
})

app.post('/projects', (request, response) => {
  const { name, email } = request.body;

  const project = { id: v4(), name, email }

  projects.push(project);

  return response.json(project)
})

app.put('/projects/:id',(request, response) => {
  const { id } = request.params;
  const { name, email } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id)

  if(projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found'})
  }

  const project = {
    id,
    name,
    email
  }

  projects[projectIndex] = project;

  return response.json(project)
})

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id)

  if(projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found'})
  }

  projects.splice(projectIndex,1)

  return response.status(204).send()
})

app.listen(3333, () => {
  console.log('🚀Back-end started!')
})