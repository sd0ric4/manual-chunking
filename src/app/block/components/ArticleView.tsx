import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HIGHLIGHT_COLORS, Highlight } from '../types';
import { Check } from 'lucide-react'; // 确保导入 Check 图标

interface ArticleViewProps {
  articleText: string;
  highlights: Highlight[];
  selectedColorIndex: number | null;
  onSelectColor: (index: number) => void;
  onReset: () => void;
  onHighlight: (start: number, end: number, colorIndex: number) => void;
  onUpdateHighlight: (id: string, start: number, end: number) => void;
  editingHighlightId: string | null;
  setEditingHighlightId: (id: string | null) => void;
}

export function ArticleView({
  articleText,
  highlights,
  selectedColorIndex,
  onSelectColor,
  onReset,
  onHighlight,
  onUpdateHighlight,
  editingHighlightId,
  setEditingHighlightId,
}: ArticleViewProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [isHighlighting, setIsHighlighting] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState<number | null>(null);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);

  // 找到当前编辑的高亮
  const editingHighlight = highlights.find((h) => h.id === editingHighlightId);

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    // 如果正在编辑一个高亮，则不允许创建新的高亮
    if (editingHighlightId !== null) return;

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
    if (isDraggingStart || isDraggingEnd) {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
      return;
    }

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

  // 获取文本位置
  const getTextPosition = (e: React.MouseEvent): number => {
    const articleDiv = articleRef.current;
    if (!articleDiv) return 0;

    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (!range) return 0;

    const textNode = range.startContainer;
    let offset = range.startOffset;

    // 计算该文本节点之前的所有文本长度
    let totalOffset = 0;
    const walk = document.createTreeWalker(articleDiv, NodeFilter.SHOW_TEXT);
    let node = walk.nextNode();

    while (node && node !== textNode) {
      totalOffset += node.textContent?.length || 0;
      node = walk.nextNode();
    }

    return totalOffset + offset;
  };

  // 处理浮标拖动
  const handleMarkerMouseDown = (e: React.MouseEvent, isStart: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (isStart) {
      setIsDraggingStart(true);
    } else {
      setIsDraggingEnd(true);
    }
  };

  // 处理文档鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editingHighlight || (!isDraggingStart && !isDraggingEnd)) return;

    const position = getTextPosition(e);

    if (isDraggingStart) {
      // 不能拖到结束位置之后
      if (position < editingHighlight.end) {
        onUpdateHighlight(editingHighlight.id, position, editingHighlight.end);
      }
    } else if (isDraggingEnd) {
      // 不能拖到开始位置之前
      if (position > editingHighlight.start) {
        onUpdateHighlight(
          editingHighlight.id,
          editingHighlight.start,
          position
        );
      }
    }
  };

  // 完成编辑
  const handleCompleteEdit = () => {
    setEditingHighlightId(null);
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
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

          // 修改渲染高亮文本函数中的相关部分
          if (currentColors.length === 0) {
            // 无高亮文本
            textParts.push(
              <span key={`text-${currentStart}`}>{segmentText}</span>
            );
          } else {
            // 有高亮文本，可能有多种颜色叠加
            const { className, style } = getHighlightClasses(currentColors);
            textParts.push(
              <span
                key={`highlight-${currentStart}`}
                className={className}
                style={style}
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

    // 如果正在编辑高亮，添加起始和结束浮标以及确认按钮
    const result = <>{textParts}</>;

    if (editingHighlight) {
      return (
        <div className='relative'>
          {result}
          {/* 起始浮标 */}
          <div
            className={`absolute cursor-ew-resize w-2 h-6 bg-primary border border-background rounded-full z-50`}
            style={{
              left: getPositionForIndex(editingHighlight.start) - 4,
              top: getLineHeightForIndex(editingHighlight.start) - 3,
            }}
            onMouseDown={(e) => handleMarkerMouseDown(e, true)}
            title='拖动调整起始位置'
          />
          {/* 结束浮标 */}
          <div
            className={`absolute cursor-ew-resize w-2 h-6 bg-primary border border-background rounded-full z-50`}
            style={{
              left: getPositionForIndex(editingHighlight.end) - 4,
              top: getLineHeightForIndex(editingHighlight.end) - 3,
            }}
            onMouseDown={(e) => handleMarkerMouseDown(e, false)}
            title='拖动调整结束位置'
          />
          {/* 完成编辑确认按钮 - 放在结束浮标旁边 */}
          <Button
            size='icon'
            variant='outline'
            className='absolute h-6 w-6 rounded-full bg-primary/10 hover:bg-primary/20 z-50 cursor-pointer flex items-center justify-center'
            style={{
              left: getPositionForIndex(editingHighlight.end) + 4,
              top: getLineHeightForIndex(editingHighlight.end) - 3,
            }}
            onClick={handleCompleteEdit}
            title='完成编辑'
          >
            <Check className='h-3 w-3 text-primary' />
          </Button>
        </div>
      );
    }

    return result;
  };

  // 辅助函数：获取指定文本索引的水平位置
  const getPositionForIndex = (index: number): number => {
    if (!articleRef.current) return 0;

    // 创建一个临时范围来获取位置
    const range = document.createRange();
    const textNodes = getTextNodesIn(articleRef.current);

    let currentIndex = 0;
    let foundNode = null;
    let nodeIndex = 0;

    // 找到包含该索引的文本节点
    for (const node of textNodes) {
      const nodeLength = node.textContent?.length || 0;
      if (currentIndex + nodeLength > index) {
        foundNode = node;
        nodeIndex = index - currentIndex;
        break;
      }
      currentIndex += nodeLength;
    }

    if (foundNode) {
      range.setStart(
        foundNode,
        Math.min(nodeIndex, foundNode.textContent?.length || 0)
      );
      range.collapse(true);

      const rect = range.getBoundingClientRect();
      const containerRect = articleRef.current.getBoundingClientRect();
      return rect.left - containerRect.left;
    }

    return 0;
  };

  // 辅助函数：获取指定文本索引的垂直位置
  const getLineHeightForIndex = (index: number): number => {
    if (!articleRef.current) return 0;

    // 创建一个临时范围来获取位置
    const range = document.createRange();
    const textNodes = getTextNodesIn(articleRef.current);

    let currentIndex = 0;
    let foundNode = null;
    let nodeIndex = 0;

    // 找到包含该索引的文本节点
    for (const node of textNodes) {
      const nodeLength = node.textContent?.length || 0;
      if (currentIndex + nodeLength > index) {
        foundNode = node;
        nodeIndex = index - currentIndex;
        break;
      }
      currentIndex += nodeLength;
    }

    if (foundNode) {
      range.setStart(
        foundNode,
        Math.min(nodeIndex, foundNode.textContent?.length || 0)
      );
      range.collapse(true);

      const rect = range.getBoundingClientRect();
      const containerRect = articleRef.current.getBoundingClientRect();
      return rect.top - containerRect.top + rect.height / 2;
    }

    return 0;
  };

  // 辅助函数：获取元素中的所有文本节点
  const getTextNodesIn = (node: Node): Node[] => {
    const textNodes: Node[] = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }

    return textNodes;
  };

  // 辅助函数：根据颜色索引列表生成样式类名
  const getHighlightClasses = (colorIndices: number[]) => {
    if (colorIndices.length === 0) return { className: '', style: {} };

    if (colorIndices.length === 1) {
      // 单种颜色
      return {
        className: cn(
          HIGHLIGHT_COLORS[colorIndices[0]].bgClass,
          'rounded px-0.5'
        ),
        style: {},
      };
    } else {
      // 多种颜色叠加，使用叠层背景色
      const colors = colorIndices.map((index) => {
        // 获取颜色类名中的具体颜色值
        const colorClass = HIGHLIGHT_COLORS[index].bgClass;
        // 使用正则提取颜色名称部分(如 red, blue 等)
        const colorNameMatch = colorClass.match(/bg-(\w+)-\d+/);
        return colorNameMatch ? colorNameMatch[1] : 'gray';
      });

      // 创建多层背景渐变
      const backgroundLayers = colors
        .map((colorName, i) => {
          const opacity = 0.3; // 每层的透明度
          return `linear-gradient(to bottom, var(--${colorName}-300-semi) 0%, var(--${colorName}-300-semi) 100%)`;
        })
        .join(', ');

      return {
        className: 'rounded px-0.5 highlight-overlap',
        style: {
          background: backgroundLayers,
          // 确保叠加效果正确
          backgroundBlendMode: 'multiply',
        } as React.CSSProperties,
      };
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
                  'w-10 h-8 p-0 border-2 cursor-pointer',
                  selectedColorIndex === index && 'ring-2 ring-primary/50',
                  color.borderClass
                )}
                onClick={() => onSelectColor(index)}
                disabled={editingHighlightId !== null}
              >
                <span className={cn('w-full h-full', color.bgClass)}></span>
                <span className='sr-only'>{color.name}荧光笔</span>
              </Button>
            ))}
            <Button
              size='sm'
              variant='outline'
              onClick={onReset}
              disabled={editingHighlightId !== null}
              className='cursor-pointer' // 添加指针样式
            >
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
          onMouseMove={handleMouseMove}
          style={{
            userSelect: editingHighlightId ? 'none' : 'text',
            position: 'relative',
          }}
        >
          {renderHighlightedText()}
        </div>
      </CardContent>
    </Card>
  );
}
