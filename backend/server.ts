import { app } from "./app";
const PORT = process.env.PORT;
require("dotenv").config();

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});