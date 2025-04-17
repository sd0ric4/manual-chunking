export interface Block {
  text: string;
  color: number | null; // null表示未被高亮的块
  id: string;
}

export interface Highlight {
  start: number;
  end: number;
  colorIndex: number;
  id: string; // 添加唯一标识符
}

// 定义高亮颜色
export const HIGHLIGHT_COLORS = [
  {
    name: '红色',
    bgClass: 'bg-red-300/50 dark:bg-red-500/30',
    textClass: 'text-red-600 dark:text-red-400',
    borderClass: 'border-red-400',
  },
  {
    name: '蓝色',
    bgClass: 'bg-blue-300/50 dark:bg-blue-500/30',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-400',
  },
  {
    name: '绿色',
    bgClass: 'bg-green-300/50 dark:bg-green-500/30',
    textClass: 'text-green-600 dark:text-green-400',
    borderClass: 'border-green-400',
  },
  {
    name: '黄色',
    bgClass: 'bg-yellow-300/50 dark:bg-yellow-500/30',
    textClass: 'text-yellow-600 dark:text-yellow-400',
    borderClass: 'border-yellow-400',
  },
  {
    name: '紫色',
    bgClass: 'bg-purple-300/50 dark:bg-purple-500/30',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-400',
  },
];

// 示例文章
export const SAMPLE_TEXT = `# 人工智能的应用与挑战

## 1. 引言

人工智能(AI)技术正以前所未有的速度发展，深刻改变着我们的生活、工作和社会结构。从智能手机上的语音助手到自动驾驶汽车，从医疗诊断到金融风险评估，AI的应用已经渗透到各个领域。本文将探讨AI的主要应用场景及其面临的技术和伦理挑战。

## 2. 人工智能的主要应用领域

### 2.1 医疗健康

AI在医疗领域的应用前景广阔。机器学习算法可以分析医学图像，帮助医生更准确地诊断疾病。例如，谷歌的DeepMind团队开发的AI系统能够通过分析视网膜图像预测眼部疾病。此外，自然语言处理技术可以帮助整理医疗记录，药物发现过程也借助AI技术大大加速。

### 2.2 金融服务

在金融领域，AI被广泛用于风险评估、欺诈检测和自动化交易。机器学习模型可以通过分析大量数据来预测市场走势，帮助投资者做出更明智的决策。银行机构使用AI系统检测异常交易，有效防止欺诈行为，提高安全性。

### 2.3 教育

AI正在变革教育方式。智能辅导系统可以根据学生的学习进度和能力提供个性化的学习内容和反馈。自动评分系统减轻了教师的工作负担，让他们能够更专注于教学质量的提升。语言学习应用也越来越依赖于AI技术进行口语评估和个性化指导。

## 3. 人工智能面临的挑战

### 3.1 技术挑战

尽管AI取得了令人瞩目的进展，但仍面临诸多技术挑战。解释性差是深度学习模型的主要问题之一，这使得人们难以理解AI是如何做出决策的。数据偏见也是一个严重问题，如果训练数据存在偏见，AI系统就可能继承并放大这些偏见。此外，大型AI模型的能源消耗问题也引起了广泛关注。

### 3.2 伦理挑战

AI的发展也带来了复杂的伦理问题。隐私保护是首要考虑因素，尤其是在AI系统需要收集和分析大量个人数据的情况下。就业替代也是一个敏感问题，随着AI技术的普及，一些传统工作岗位可能面临被自动化取代的风险。另外，自主武器系统的发展引发了关于战争伦理的深刻思考。

### 3.3 监管挑战

如何有效监管AI技术是各国政府面临的难题。一方面，过度监管可能阻碍创新；另一方面，监管不足可能导致AI技术被滥用。制定平衡的政策框架，既要促进AI的健康发展，又要防范潜在风险，是一个复杂的任务。

## 4. 结论与展望

人工智能技术将继续快速发展并改变我们的世界。为了充分发挥AI的潜力并同时应对其带来的挑战，需要政府、企业、学术界和公民社会的共同参与。只有通过多方合作，建立负责任的AI发展和应用框架，才能确保这一强大技术造福人类，而不是带来新的问题。

随着AI技术变得更加普及和强大，我们必须不断反思其对社会的影响，并适时调整发展策略。人工智能的未来应当是以人为本，服务于人类福祉的技术进步，而非脱离人类控制的自主发展。`;
