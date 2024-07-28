import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Supabaseのモックをインポート
jest.mock('../utils/supabase');

describe('App コンポーネントのタイトル', () => {
  test('タイトルが正しく表示されていること', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '登録' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: '一覧' })).toBeInTheDocument();
    });
  });
});

describe('学習記録の追加', () => {
  test('フォームに学習内容と時間を入力して登録ボタンを押すと新たに記録が追加されている', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText('学習内容')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('学習内容'), { target: { value: 'React学習' } });
    fireEvent.change(screen.getByLabelText('学習時間'), { target: { value: '2' } });
    
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      const items = screen.getAllByText('React学習：2時間');
      expect(items.length).toBeGreaterThan(0);
    });
  });
});

describe('学習記録の削除', () => {
  test('削除ボタンを押すと学習記録が削除される', async () => {
    render(<App />);

    // 初期データが読み込まれるのを待つ
    await waitFor(() => {
      expect(screen.getByText('React学習：2時間')).toBeInTheDocument();
    });

    // 削除前の記録数を確認
    const initialItems = screen.getAllByText(/.*：.*時間/);
    const initialCount = initialItems.length;

    const deleteButtons = screen.getAllByRole('button', { name: '削除' });
    fireEvent.click(deleteButtons[0]);

    // 削除後の記録数を確認
    await waitFor(() => {
      const remainingItems = screen.getAllByText(/.*：.*時間/);
      expect(remainingItems.length).toBe(initialCount - 1);
    }, { timeout: 2000 }); // タイムアウトを増やす
  });
});

describe('フォームのバリデーション', () => {
  test('入力をしないで登録を押すとエラーが表示される', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(screen.getByText('入力されていない項目があります')).toBeInTheDocument();
    });
  });
});