import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HIGHLIGHT_COLORS, Highlight } from '../types';

interface ArticleViewProps {
  articleText: string;
  highlights: Highlight[];
  selectedColorIndex: number | null;
  onSelectColor: (index: number) => void;
  onReset: () => void;
  onHighlight: (start: number, end: number, colorIndex: number) => void;
}

export function ArticleView({
  articleText,
  highlights,
  selectedColorIndex,
  onSelectColor,
  onReset,
  onHighlight,
}: ArticleViewProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [isHighlighting, setIsHighlighting] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState<number | null>(null);

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedColorIndex === null) return;

    setIsHighlighting(true);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selection.removeAllRanges();
    }

    // 计算点击位置在文本中的索引
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'DIV' ||
      target.tagName === 'P' ||
      target.tagName === 'SPAN'
    ) {
      const articleDiv = articleRef.current;
      if (articleDiv) {
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range) {
          const textNode = range.startContainer;
          let offset = range.startOffset;

          // 计算该文本节点之前的所有文本长度
          let totalOffset = 0;
          const walk = document.createTreeWalker(
            articleDiv,
            NodeFilter.SHOW_TEXT
          );
          let node = walk.nextNode();

          while (node && node !== textNode) {
            totalOffset += node.textContent?.length || 0;
            node = walk.nextNode();
          }

          setStartPosition(totalOffset + offset);
        }
      }
    }
  };

  // 处理鼠标释放事件
  const handleMouseUp = (e: React.MouseEvent) => {
    if (
      !isHighlighting ||
      selectedColorIndex === null ||
      startPosition === null
    )
      return;

    setIsHighlighting(false);
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const articleDiv = articleRef.current;

      if (articleDiv && articleDiv.contains(range.commonAncestorContainer)) {
        // 计算选中文本的结束位置
        let endPosition = startPosition;
        endPosition += selection.toString().length;

        // 调用传入的高亮处理函数
        onHighlight(startPosition, endPosition, selectedColorIndex);

        // 清除选择
        selection.removeAllRanges();
      }
    }

    setStartPosition(null);
  };

  // 修复后的渲染高亮文本函数
  const renderHighlightedText = () => {
    if (highlights.length === 0) return articleText;

    // 创建一个字符位置到颜色索引的映射
    const colorMap = new Map<number, number[]>();

    // 为每个文本位置记录应用的所有颜色
    highlights.forEach((highlight) => {
      for (let i = highlight.start; i < highlight.end; i++) {
        if (!colorMap.has(i)) {
          colorMap.set(i, []);
        }
        colorMap.get(i)!.push(highlight.colorIndex);
      }
    });

    // 将连续相同颜色组合的文本生成为段落
    const textParts: React.ReactNode[] = [];
    let currentColors: number[] = [];
    let currentStart = 0;

    // 处理所有字符，确保包含结束位置
    for (let i = 0; i <= articleText.length; i++) {
      // 获取当前位置应用的颜色，超出文本范围返回空数组
      const posColors = i < articleText.length ? colorMap.get(i) || [] : [];

      // 检查颜色组合是否变化
      const colorsChanged =
        currentColors.length !== posColors.length ||
        !arraysEqual(currentColors, posColors);

      // 当颜色变化或到达文本末尾时处理当前段落
      if (colorsChanged || i === articleText.length) {
        // 添加之前累积的文本段
        if (i > currentStart) {
          const segmentText = articleText.substring(currentStart, i);

          if (currentColors.length === 0) {
            // 无高亮文本
            textParts.push(
              <span key={`text-${currentStart}`}>{segmentText}</span>
            );
          } else {
            // 有高亮文本，可能有多种颜色叠加
            textParts.push(
              <span
                key={`highlight-${currentStart}`}
                className={getHighlightClasses(currentColors)}
              >
                {segmentText}
              </span>
            );
          }
        }

        // 更新当前颜色和起始位置
        currentColors = [...posColors];
        currentStart = i;
      }
    }

    return <>{textParts}</>;
  };

  // 辅助函数：根据颜色索引列表生成样式类名
  const getHighlightClasses = (colorIndices: number[]) => {
    if (colorIndices.length === 0) return '';

    if (colorIndices.length === 1) {
      // 单种颜色
      return cn(HIGHLIGHT_COLORS[colorIndices[0]].bgClass, 'rounded px-0.5');
    } else {
      // 多种颜色混合，使用 CSS 混合模式
      return cn(
        // 叠加第一种颜色
        HIGHLIGHT_COLORS[colorIndices[0]].bgClass,
        // 对额外的颜色使用混合模式
        'rounded px-0.5 relative',
        colorIndices.length > 1 && 'mix-blend-multiply'
      );
    }
  };

  // 辅助函数：比较两个数组是否相等
  const arraysEqual = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
  };

  return (
    <Card className='h-[calc(100vh-10rem)] overflow-hidden flex flex-col'>
      <CardHeader className='pb-0'>
        <CardTitle className='flex justify-between items-center'>
          <span>原始文章</span>
          <div className='flex items-center gap-2'>
            {HIGHLIGHT_COLORS.map((color, index) => (
              <Button
                key={`color-${index}`}
                size='sm'
                variant={selectedColorIndex === index ? 'default' : 'outline'}
                className={cn(
                  'w-10 h-8 p-0 border-2',
                  selectedColorIndex === index && 'ring-2 ring-primary/50',
                  color.borderClass
                )}
                onClick={() => onSelectColor(index)}
              >
                <span className={cn('w-full h-full', color.bgClass)}></span>
                <span className='sr-only'>{color.name}荧光笔</span>
              </Button>
            ))}
            <Button size='sm' variant='outline' onClick={onReset}>
              重置
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow overflow-auto pt-6'>
        <div
          ref={articleRef}
          className='prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap'
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{ userSelect: 'text' }}
        >
          {renderHighlightedText()}
        </div>
      </CardContent>
    </Card>
  );
}
