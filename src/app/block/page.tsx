'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ModeToggle } from '@/components/toggle-button';
import { ArticleView } from './components/ArticleView';
import { BlocksResult } from './components/BlocksResult';
import { Highlight, Block, SAMPLE_TEXT } from './types';
import { generateBlocksFromHighlights, findHighlightByBlockId } from './utils';

export default function BlockPage() {
  const [articleText] = useState(SAMPLE_TEXT);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(
    null
  );
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [processed, setProcessed] = useState(false);
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(
    null
  );

  // 添加高亮
  const handleHighlight = (start: number, end: number, colorIndex: number) => {
    const newId = uuidv4();
    setHighlights((prev) => [
      ...prev,
      {
        start,
        end,
        colorIndex,
        id: newId, // 为每个高亮生成唯一ID
      },
    ]);
    return newId;
  };

  // 更新高亮
  const handleUpdateHighlight = (id: string, start: number, end: number) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, start, end } : h))
    );

    // 如果已经生成了分块，则重新生成
    if (processed) {
      // 延迟执行以避免重叠操作
      requestAnimationFrame(() => {
        const updatedBlocks = generateBlocksFromHighlights(
          articleText,
          highlights
        );
        setBlocks(updatedBlocks);
      });
    }
  };

  // 重置所有高亮
  const resetHighlights = () => {
    setHighlights([]);
    setSelectedColorIndex(null);
    setBlocks([]);
    setProcessed(false);
    setEditingHighlightId(null);
  };

  // 生成分块
  const generateBlocks = () => {
    const newBlocks = generateBlocksFromHighlights(articleText, highlights);
    setBlocks(newBlocks);
    setProcessed(true);
  };

  // 处理编辑块
  const handleEditBlock = (blockId: string) => {
    // 检查是否已经在编辑
    if (editingHighlightId !== null) return;

    // 查找对应的高亮
    const highlight = findHighlightByBlockId(highlights, blockId);
    if (highlight) {
      setEditingHighlightId(blockId);
    }
  };

  // 添加删除高亮函数
  const handleDeleteBlock = (blockId: string) => {
    // 从高亮列表中移除对应ID的高亮
    setHighlights((prev) => prev.filter((h) => h.id !== blockId));

    // 如果已经生成了分块，重新生成
    if (processed) {
      const updatedHighlights = highlights.filter((h) => h.id !== blockId);
      const newBlocks = generateBlocksFromHighlights(
        articleText,
        updatedHighlights
      );
      setBlocks(newBlocks);
    }

    // 如果正在编辑该分块，取消编辑状态
    if (editingHighlightId === blockId) {
      setEditingHighlightId(null);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 relative'>
      {/* 切换按钮放在右上角 */}
      <div className='absolute top-0 right-0 mt-4 mr-4 z-10'>
        <ModeToggle />
      </div>

      <div className='mb-8 relative z-10'>
        <h1 className='text-4xl font-bold tracking-tighter'>
          手动文本分块工具
        </h1>
        <p className='text-lg mt-2 text-muted-foreground'>
          使用荧光笔标记文本段落，创建自定义分块
        </p>
        {editingHighlightId && (
          <p className='text-sm text-primary mt-1'>
            正在调整分块范围，拖动浮标调整后点击"完成编辑"
          </p>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10'>
        {/* 左侧文章区域 */}
        <ArticleView
          articleText={articleText}
          highlights={highlights}
          selectedColorIndex={selectedColorIndex}
          onSelectColor={setSelectedColorIndex}
          onReset={resetHighlights}
          onHighlight={handleHighlight}
          onUpdateHighlight={handleUpdateHighlight}
          editingHighlightId={editingHighlightId}
          setEditingHighlightId={setEditingHighlightId}
        />

        {/* 右侧结果区域 */}
        <BlocksResult
          blocks={blocks}
          processed={processed}
          onGenerateBlocks={generateBlocks}
          hasHighlights={highlights.length > 0}
          onEditBlock={handleEditBlock}
          editingHighlightId={editingHighlightId}
          onDeleteBlock={handleDeleteBlock} // 添加删除功能
        />
      </div>
    </div>
  );
}
