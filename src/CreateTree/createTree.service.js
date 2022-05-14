import xlsx from "node-xlsx";
import fs from 'fs';
import { createOriginHistory } from "./utils/createOriginHistoryTree.js";

export const createTreeService = async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let dictFile = req.files.dict;
      // сохраняем файл
      await dictFile.mv(`./uploads/${dictFile.name}`);
// парсинг xlsx файл, превращаем его в массив с данными
       const workSheetsFromFile = xlsx.parse(`./uploads/${dictFile.name}`)[0]
        .data;
      const formattedSheet = workSheetsFromFile
        .filter((row, indexRow) => indexRow !== 0 && row.length)
        .map((row) => ({
          name: row[0],
          data: row.splice(1, row.length),
        }));
      //функция обработки теблицы
      const tree = createOriginHistory(formattedSheet);



      //send response
      res.send(tree);
      await fs.unlinkSync(`./uploads/${dictFile.name}`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
