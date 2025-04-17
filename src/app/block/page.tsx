'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 你需要安装这个包: npm install uuid @types/uuid
import { ArticleView } from './components/ArticleView';
import { BlocksResult } from './components/BlocksResult';
import { Highlight, Block, SAMPLE_TEXT } from './types';
import { generateBlocksFromHighlights } from './utils';

export default function BlockPage() {
  const [articleText] = useState(SAMPLE_TEXT);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(
    null
  );
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [processed, setProcessed] = useState(false);

  // 添加高亮
  const handleHighlight = (start: number, end: number, colorIndex: number) => {
    setHighlights((prev) => [
      ...prev,
      {
        start,
        end,
        colorIndex,
        id: uuidv4(), // 为每个高亮生成唯一ID
      },
    ]);
  };

  // 重置所有高亮
  const resetHighlights = () => {
    setHighlights([]);
    setSelectedColorIndex(null);
    setBlocks([]);
    setProcessed(false);
  };

  // 生成分块
  const generateBlocks = () => {
    const newBlocks = generateBlocksFromHighlights(articleText, highlights);
    setBlocks(newBlocks);
    setProcessed(true);
  };

  return (
    <div className='container mx-auto px-4 py-8 relative'>
      {/* 切换按钮放在右上角 */}

      <div className='mb-8 relative z-10'>
        <p className='text-lg mt-2 text-muted-foreground'>
          使用荧光笔标记文本段落，创建自定义分块
        </p>
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
        />

        {/* 右侧结果区域 */}
        <BlocksResult
          blocks={blocks}
          processed={processed}
          onGenerateBlocks={generateBlocks}
          hasHighlights={highlights.length > 0}
        />
      </div>
    </div>
  );
}
