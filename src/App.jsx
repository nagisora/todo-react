import React from 'react';
import { useState, useEffect } from "react";
import { getSupabase } from '../utils/supabase';
import './App.css'

const supabase = getSupabase();

function App() {

  const [records, setRecords] = useState([]); // recordsの初期状態を空の配列に設定
  const [studySession, setStudySession] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isIncomplete, setIsIncomplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // isLoading stateを追加

  const onChangeStudySession = (event) => setStudySession(event.target.value);
  const onChangeStudyTime = (event) => setStudyTime(parseFloat(event.target.value) || 0); // 数値変換

  const onClickSubmit = async () => {
    // エラーハンドリング
    const isFormIncomplete = studySession === "" || studyTime <= 0;
    setIsIncomplete(isFormIncomplete);
    if (isFormIncomplete) return;

    // record登録
    const newRecord = { title: studySession, time: studyTime };
    setRecords(prevRecords => [...prevRecords, newRecord]);

    // Supabaseにデータを挿入
    const { error } = await supabase
      .from('study-record')
      .insert([newRecord]);

    if (error) {
      console.error('Error inserting data:', error);
    }

    // フォームのリセット
    setStudySession("");
    setStudyTime(0);
  };

  const onClickDelete = async (index) => {
    const recordToDelete = records[index];
    const { error } = await supabase
      .from('study-record')
      .delete()
      .eq('id', recordToDelete.id);

    if (error) {
      console.error('Error deleting record:', error);
    } else {
      setRecords(prevRecords => prevRecords.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    // 合計時間計算
    const sumTime = records ? records.reduce((total, record) => total + Number(record.time), 0) : 0;
    setTotalTime(sumTime);
  }, [records]);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('study-record').select('*');
      if (error) {
        console.error('Error fetching records:', error);
      } else {
        setRecords(data || []);
      }
      setIsLoading(false);
    };

    fetchRecords();
  }, []);

  return (
    <>
      <h2>登録</h2>
      <div>
        <label htmlFor="content-input">学習内容</label>
        <input
          id="content-input"
          type="text"
          value={studySession}
          onChange={onChangeStudySession}
        />
      </div>
      <div>
        <label htmlFor="time-input">学習時間</label>
        <input
          id="time-input"
          type="number"
          value={studyTime}
          onChange={onChangeStudyTime}
        />
        時間
      </div>
      <div>入力されている学習内容：{studySession}</div>
      <div>入力されている時間：{studyTime}時間</div>
      <button onClick={onClickSubmit}>登録</button>
      {isIncomplete && <div>入力されていない項目があります</div>}
      <div>合計時間：{totalTime}/1000(h)</div>
      <hr/>
      <h2>一覧</h2>
      {isLoading ? "Loading..." : (
        <ul>
          {records && records.map((record, index) => (
            <li key={index}>
              <span>{record.title}：{record.time}時間</span>
              <button onClick={() => onClickDelete(index)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default App;