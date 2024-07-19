import { useState } from "react";
import './App.css'

function App() {

  const initialRecords = [
    { title: "勉強の記録1", time: 1},
    { title: "勉強の記録2", time: 3},
    { title: "勉強の記録3", time: 5}
  ]

  const [records, setRecords] = useState(initialRecords);
  const [studySession, setStudySession] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isIncomplete, setIsIncomplete] = useState(false);

  const onChangeStudySession = (event) => setStudySession(event.target.value);
  const onChangeStudyTime = (event) => setStudyTime(event.target.value);

  const onClickSubmit = () => {
    // エラーハンドリング
    const isFormIncomplete = studySession === "" || studyTime <= 0;
    setIsIncomplete(isFormIncomplete);
    if(isFormIncomplete) return;

    // record登録
    const newRecord = { title: studySession, time: studyTime};
    const newRecords = [...records, newRecord];
    setRecords(newRecords);

    setStudySession("");
    setStudyTime(0);

    // 合計時間計算
    var sumTime = 0;
    records.forEach((record) => {
      sumTime += parseInt(record.time, 10);
    });
    setTotalTime(sumTime);
  };

  // const isIncomplete = studySession === null || studyTime <= 0;

  return (
    <>
      <h2>登録</h2>
      <div>学習内容<input type="text" value={studySession} onChange={onChangeStudySession}/></div>
      <div>学習時間<input type="number" value={studyTime} onChange={onChangeStudyTime}/>時間</div>
      <div>入力されている学習内容：{studySession}</div>
      <div>入力されている時間：{studyTime}時間</div>
      <button onClick={onClickSubmit}>登録</button>
      {isIncomplete && <div>入力されていない項目があります</div>}
      <div>合計時間：{totalTime}/1000(h)</div>
      <hr/>
      <h2>一覧</h2>
      <ul>
        {records.map((record, index) => (
          <li key={index}>{record.title}：{record.time}時間</li>
        ))}
      </ul>
    </>
  )
}

export default App
