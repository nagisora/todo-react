import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react'; // react-dom/test-utils から react に変更

// Supabaseクライアントをモックする
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockResolvedValue({ data: [], error: null }),
  insert: jest.fn().mockResolvedValue({ data: null, error: null }),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockResolvedValue({ data: null, error: null }),
};

// supabaseモジュールをモックする
jest.mock('../utils/supabase', () => ({
  getSupabase: jest.fn(() => mockSupabase),
}));

// Appコンポーネントのインポートをモックの後に移動
import App from './App';

describe('App コンポーネントのタイトル', () => {
  test('タイトルが正しく表示されていること', async () => {
    render(<App />);
    
    expect(await screen.findByRole('heading', { level: 2, name: '登録' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 2, name: '一覧' })).toBeInTheDocument();
  });
});

describe('学習記録の追加', () => {
  test('フォームに学習内容と時間を入力して登録ボタンを押すと新たに記録が追加されている', async () => {
    await act(async () => {
      render(<App />);
    });

    // フォームの要素を取得
    const contentInput = screen.getByLabelText('学習内容');
    const timeInput = screen.getByLabelText('学習時間');
    const submitButton = screen.getByRole('button', { name: /登録/i });

    await act(async () => {
      // フォームに値を入力
      fireEvent.change(contentInput, { target: { value: 'React テスト' } });
      fireEvent.change(timeInput, { target: { value: '2' } });

      // 登録ボタンをクリック
      fireEvent.click(submitButton);
    });

    // 新しい記録が追加されたことを確認
    await waitFor(() => {
      expect(screen.getByText('React テスト：2時間')).toBeInTheDocument();
    });
  });
});

describe('学習記録の削除', () => {
  test('削除ボタンを押すと学習記録が削除される', async () => {
    // モックデータを設定
    const mockData = [
      { id: 1, title: 'React学習', time: 2 },
      { id: 2, title: 'Jest学習', time: 1 },
    ];
    
    // selectメソッドのモックを上書き
    mockSupabase.select.mockResolvedValue({ data: mockData, error: null });

    await act(async () => {
      render(<App />);
    });

    // データが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText('React学習：2時間')).toBeInTheDocument();
      expect(screen.getByText('Jest学習：1時間')).toBeInTheDocument();
    });

    // 最初の項目の削除ボタンを取得してクリック
    const deleteButtons = screen.getAllByRole('button', { name: /削除/i });
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    // 削除後の状態を確認
    await waitFor(() => {
      expect(screen.queryByText('React学習：2時間')).not.toBeInTheDocument();
      expect(screen.getByText('Jest学習：1時間')).toBeInTheDocument();
    });

    // Supabaseのdeleteメソッドが正しく呼び出されたか確認
    expect(mockSupabase.delete).toHaveBeenCalledTimes(1);
    expect(mockSupabase.delete().eq).toHaveBeenCalledWith('id', 1);
  });
});

describe('フォームのバリデーション', () => {
  test('入力をしないで登録を押すとエラーが表示される', async () => {
    await act(async () => {
      render(<App />);
    });

    // 登録ボタンを取得
    const submitButton = screen.getByRole('button', { name: /登録/i });

    // 登録ボタンをクリック
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('入力されていない項目があります')).toBeInTheDocument();
    });

    // 学習内容と学習時間の入力フィールドが空であることを確認
    const contentInput = screen.getByLabelText('学習内容');
    const timeInput = screen.getByLabelText('学習時間');
    expect(contentInput).toHaveValue('');
    expect(timeInput).toHaveValue(0);
  });
});