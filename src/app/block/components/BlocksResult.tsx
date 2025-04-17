import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Block, HIGHLIGHT_COLORS } from '../types';
import { X } from 'lucide-react'; // 导入 X 图标

interface BlocksResultProps {
  blocks: Block[];
  processed: boolean;
  onGenerateBlocks: () => void;
  hasHighlights: boolean;
  onEditBlock: (blockId: string) => void;
  editingHighlightId: string | null;
  onDeleteBlock?: (blockId: string) => void; // 添加删除块的回调函数
}

export function BlocksResult({
  blocks,
  processed,
  onGenerateBlocks,
  hasHighlights,
  onEditBlock,
  editingHighlightId,
  onDeleteBlock,
}: BlocksResultProps) {
  return (
    <Card className='h-[calc(100vh-10rem)] overflow-hidden flex flex-col'>
      <CardHeader className='flex-shrink-0 pb-0'>
        <CardTitle className='flex justify-between items-center'>
          <span>分块结果</span>
          <Button
            size='sm'
            onClick={onGenerateBlocks}
            disabled={
              (!hasHighlights && processed) || editingHighlightId !== null
            }
          >
            生成分块
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow overflow-auto pt-6'>
        {!processed ? (
          <div className='h-full flex items-center justify-center text-center'>
            <div>
              <p className='text-lg mb-4'>
                请使用荧光笔标记文本，然后点击"生成分块"
              </p>
              <p className='text-muted-foreground'>
                未标记的文本将自动成为独立的块
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={cn(
                  'p-3 rounded-md border',
                  block.color !== null
                    ? cn(
                        HIGHLIGHT_COLORS[block.color].bgClass,
                        'border-2',
                        HIGHLIGHT_COLORS[block.color].borderClass,
                        block.id === editingHighlightId &&
                          'ring-2 ring-primary',
                        // 添加条件指针样式
                        block.color !== null &&
                          editingHighlightId === null &&
                          'cursor-pointer'
                      )
                    : 'bg-muted/30'
                )}
                onClick={() => block.color !== null && onEditBlock(block.id)}
                style={{ position: 'relative' }}
              >
                {block.color !== null && editingHighlightId === null && (
                  <div className='absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <span className='text-xs font-medium'>点击调整范围</span>
                  </div>
                )}
                <div className='flex justify-between items-center mb-2'>
                  <Badge variant={block.color !== null ? 'default' : 'outline'}>
                    {block.color !== null
                      ? `块 ${index + 1} - ${
                          HIGHLIGHT_COLORS[block.color].name
                        }`
                      : `块 ${index + 1} - 未标记`}
                  </Badge>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>
                      {block.text.length} 字符
                    </span>
                    {/* 添加删除按钮，但仅对高亮的块显示 */}
                    {block.color !== null && onDeleteBlock && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止事件冒泡，避免触发编辑
                          onDeleteBlock(block.id);
                        }}
                        className='text-muted-foreground hover:text-destructive rounded-full p-1 transition-colors'
                        aria-label='删除分块'
                        title='删除分块'
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p
                  className={cn(
                    'whitespace-pre-wrap text-sm',
                    block.color !== null &&
                      HIGHLIGHT_COLORS[block.color].textClass
                  )}
                >
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
