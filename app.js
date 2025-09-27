const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mainRoutes = require('./routes/mainRoutes');

const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

//const swaggerUi = require('swagger-ui-express');
//const swaggerDocs = require('./swagger.json'); // Atau gunakan swagger-jsdoc jika dinamis

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Middleware untuk dokumentasi Swagger
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route untuk otentikasi
app.use('/auth', authRoutes);

app.use('/api', mainRoutes);

// Error handling (opsional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  //console.log('Swagger Docs tersedia di http://localhost:${port}/api-docs');
});
