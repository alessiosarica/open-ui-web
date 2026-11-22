// Copia in dist/ i file che il pacchetto pubblica così come sono.
// Script in Node (e non `cp`) così funziona anche su Windows.
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist/styles", { recursive: true });
cpSync("src/fonts", "dist/fonts", { recursive: true });
cpSync("src/styles/theme.css", "dist/styles/theme.css");
cpSync("src/styles/fonts.css", "dist/styles/fonts.css");
cpSync("src/styles/utilities.css", "dist/styles/utilities.css");
