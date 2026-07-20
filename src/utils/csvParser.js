export const parseCSV = (csvText) => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Split by comma, respecting quotes
  const parseLine = (line) => {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    return line.split(regex).map((val) => val.trim().replace(/^"|"$/g, ""));
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseLine(lines[i]);
    const obj = {};

    headers.forEach((header, index) => {
      let val = values[index] !== undefined ? values[index] : "";

      if (header === "tags") {
        obj[header] = val
          ? val
              .split(";")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];
      } else {
        obj[header] = val;
      }
    });
    results.push(obj);
  }

  return results;
};
