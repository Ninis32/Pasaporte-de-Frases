require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarDB = require('./config/db');
const caminitoRoutes = require('./routes/caminito');
const authRoutes = require('./routes/auth');

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

app.use('/api/caminito', caminitoRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
