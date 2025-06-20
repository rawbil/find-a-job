import { app } from "./app";
import ConnectDb from "./utils/db";
const PORT = process.env.PORT;
require("dotenv").config();

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  ConnectDb();
});
