import { Block, Highlight } from './types';

// 生成文本块，每个高亮作为独立块
export function generateBlocksFromHighlights(
  articleText: string,
  highlights: Highlight[]
): Block[] {
  if (highlights.length === 0) {
    return [{ text: articleText, color: null, id: 'block-0' }];
  }

  // 按开始位置排序高亮
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

  // 收集所有高亮区域作为块
  const highLightedBlocks: Block[] = sortedHighlights.map(
    (highlight, index) => ({
      text: articleText.substring(highlight.start, highlight.end),
      color: highlight.colorIndex,
      id: `block-h-${index}`,
    })
  );

  // 找出未高亮的区域
  const unHighlightedBlocks: Block[] = [];
  let lastEnd = 0;

  // 按顺序标记未高亮区域
  for (const highlight of sortedHighlights) {
    // 如果高亮区域前有未标记的文本，添加为块
    if (highlight.start > lastEnd) {
      const text = articleText.substring(lastEnd, highlight.start).trim();
      if (text) {
        unHighlightedBlocks.push({
          text,
          color: null,
          id: `block-u-${lastEnd}`,
        });
      }
    }

    // 更新结束位置为目前处理过的最远位置
    if (highlight.end > lastEnd) {
      lastEnd = highlight.end;
    }
  }

  // 处理文档末尾未高亮的部分
  if (lastEnd < articleText.length) {
    const text = articleText.substring(lastEnd).trim();
    if (text) {
      unHighlightedBlocks.push({
        text,
        color: null,
        id: `block-u-${lastEnd}`,
      });
    }
  }

  // 合并高亮和未高亮的块，并重新排序
  const allBlocks = [...highLightedBlocks, ...unHighlightedBlocks];

  // 按照文本在原文中的位置排序
  allBlocks.sort((a, b) => {
    const aStart = articleText.indexOf(a.text);
    const bStart = articleText.indexOf(b.text);
    return aStart - bStart;
  });

  return allBlocks;
}
