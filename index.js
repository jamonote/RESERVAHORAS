const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

app.get("/api/reservas", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/reservas.json"));
  res.json(data.horas);
});

app.post("/api/crear-reserva", (req, res) => {
  const { nombre, email, telefono, motivo, hora } = req.body;
  console.log("Reserva recibida:", req.body);

  let data = JSON.parse(fs.readFileSync("./data/reservas.json"));
  let reservas = data.horas;

  const index = reservas.findIndex(r => r.hora === hora);

  if (index === -1) return res.status(400).json({ mensaje: "Hora inválida" });
  if (reservas[index].reservada) return res.status(409).json({ mensaje: "Hora ya está ocupada" });

  reservas[index].reservada = true;
  fs.writeFileSync("./data/reservas.json", JSON.stringify(data, null, 2));

  res.status(201).json({ mensaje: "Reserva confirmada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
