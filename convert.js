const fs = require("fs");

const raw = fs.readFileSync("kangxi-strokecount.csv", "utf-8");
const lines = raw.split("\n");
const startIndex = lines.findIndex(line => line.includes("CodePoint"));
const dataLines = lines.slice(startIndex + 1);

const result = {};

dataLines.forEach(line => {
    const parts = line.split(",");

    if (parts.length < 4) return;

    const char = parts[2];
    const stroke = parseInt(parts[3]);

    if (char && char.length === 1 && !isNaN(stroke)) {
        result[char] = stroke;
    }
});

fs.writeFileSync("stroke.json", JSON.stringify(result, null, 2), "utf-8");

console.log("轉換完成");