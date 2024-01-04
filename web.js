const express = require("express");
const path = require("path");
const cors = require("cors"); // cors 미들웨어 추가
const app = express();
const exceljs = require("exceljs");

app.use(express.json());
app.use(cors()); // 모든 요청에 대해 CORS를 허용

const dataStorage = [];

app.get("/", function (req, res) {
  // res.sendFile(path.join(__dirname, "build", "index.html"));
  // console.log("get");
  res.send("AA");
});

app.post("/object", async (req, res) => {
  try {
    const receivedData = req.body;
    console.log("Received data:", receivedData);

    // 동기화를 위한 락 사용 (JavaScript에서는 실제 락을 사용하는 것이 어려우므로 간단한 예시)
    // 이 부분은 실제 프로덕션 환경에서는 더 고급스러운 동기화 방법이 필요할 수 있습니다.
    const lock = true; // 락 획득
    if (lock) {
      dataStorage.push(receivedData);

      // Excel 파일로 만들기
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // 헤더 추가
      worksheet.addRow(["Time", "PPG", "Pulse", "Factor"]);

      // 데이터 추가
      dataStorage.forEach((data) => {
        worksheet.addRow([data.time, data.ppg, data.pulse, data.factor]);
      });

      // Excel 파일로 저장
      const filePath = path.join(__dirname, "public", "output.xlsx");
      await workbook.xlsx.writeFile(filePath);

      // 클라이언트에 응답
      res.sendFile(filePath);
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
  console.log(`Server is running on port 8001`);
});
