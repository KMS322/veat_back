const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const exceljs = require("exceljs");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://192.168.0.5", "fe80::4009:75ff:fe3c:200"],
    credentials: true,
  })
);

app.get("/", function (req, res) {
  res.send("AA");
});
const totalDataStorage = [];
app.post("/object", async (req, res) => {
  try {
    const receivedData = req.body;
    // console.log("Received data:", receivedData);

    const lock = true; // 락 획득
    if (lock) {
      const dataStorage = receivedData;
      // dataStorage.push(receivedData);
      // console.log("이것은 dataStorage : ", dataStorage);
      totalDataStorage.push(dataStorage);
      // console.log("total : ", totalDataStorage);
      // Excel 파일로 만들기
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // 헤더 추가
      worksheet.addRow(["Time", "PPG", "Pulse", "Factor"]);

      // 데이터 추가
      dataStorage.forEach((data) => {
        worksheet.addRow([data.time, data.ppg, data.pulse, data.factor]);
      });

      const formatDateTime = (date) => {
        const updatedDate = new Date(date);

        const year = updatedDate.getFullYear();
        const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
        const day = String(updatedDate.getDate()).padStart(2, "0");
        const hour = String(updatedDate.getHours()).padStart(2, "0");
        const minute = String(updatedDate.getMinutes()).padStart(2, "0");
        const second = String(updatedDate.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
      };

      const formattedTime = formatDateTime(new Date());
      // Excel 파일로 저장
      const filePath = path.join(__dirname, "public", `${formattedTime}.xlsx`);
      await workbook.xlsx.writeFile(filePath);

      res.status(200).send("receive success");
      // 클라이언트에 응답
      console.log("send data success");
    } else {
      console.log("Failed to acquire lock for data storage.");
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/objectRaw", async (req, res) => {
  try {
    const receivedData = req.body;
    console.log("Received data:", receivedData);

    const lock = true; // 락 획득
    if (lock) {
      const dataStorage = receivedData;
      // dataStorage.push(receivedData);
      // console.log("이것은 dataStorage : ", dataStorage);
      totalDataStorage.push(dataStorage);
      // console.log("total : ", totalDataStorage);
      // Excel 파일로 만들기
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // 헤더 추가
      worksheet.addRow(["Time", "IR", "RED", "TEMP"]);

      // 데이터 추가
      dataStorage.forEach((data) => {
        worksheet.addRow([data.time, data.ir, data.red, data.temp]);
      });

      const formatDateTime = (date) => {
        const updatedDate = new Date(date);

        const year = updatedDate.getFullYear();
        const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
        const day = String(updatedDate.getDate()).padStart(2, "0");
        const hour = String(updatedDate.getHours()).padStart(2, "0");
        const minute = String(updatedDate.getMinutes()).padStart(2, "0");
        const second = String(updatedDate.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
      };

      const formattedTime = formatDateTime(new Date());
      // Excel 파일로 저장
      const filePath = path.join(__dirname, "public", `${formattedTime}.xlsx`);
      await workbook.xlsx.writeFile(filePath);

      res.status(200).send("receive success");
      // 클라이언트에 응답
      console.log("send data success");
    } else {
      console.log("Failed to acquire lock for data storage.");
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/device", async (req, res) => {
  try {
    // console.log("req.body : ", req.body);
    const receivedData = req.body;

    const lock = true;
    if (lock) {
      const dataStorage = receivedData;

      // 기존의 Excel 파일 열기
      const filePath = path.join(__dirname, "public", "data.xlsx");
      const workbook = new exceljs.Workbook();
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.getWorksheet("Data");

      // 새로운 데이터를 기존 워크시트에 추가
      // const { ir, red, date } = dataStorage;
      // for (let i = 0; i < ir.length; i++) {
      //   worksheet.addRow([date[i], ir[i], red[i]]);
      // }
      const { ir, red } = dataStorage;
      for (let i = 0; i < ir.length; i++) {
        worksheet.addRow([i, ir[i], red[i]]);
      }

      // 변경된 내용을 Excel 파일에 저장
      const recorded = await workbook.xlsx.writeFile(filePath);
      if (recorded) {
        console.log("data recorded");
      } else {
        console.log("data unrecorded");
      }
      res.status(200).send("receive success");
      // 클라이언트에 응답
    } else {
      console.log("Failed to acquire lock for data storage.");
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(8001, () => {
  console.log(`Server is running on port 8001!!`);
});
