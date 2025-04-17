import { ModeToggle } from '@/components/toggle-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <main className='container mx-auto px-4 py-16 relative'>
      {/* 泛光效果背景 */}
      <div className='glow-container absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='glow-effect'></div>
      </div>

      {/* 切换按钮放在右上角 */}
      <div className='absolute top-0 right-0 mt-4 mr-4 z-10'>
        <ModeToggle />
      </div>

      <div className='space-y-12 relative z-10'>
        {/* Hero Section */}
        <section className='flex flex-col items-center justify-center text-center space-y-6 py-16'>
          <h1 className='text-5xl font-bold tracking-tighter sm:text-6xl'>
            手动分块优化
          </h1>
          <p className='max-w-[600px] text-lg'>
            通过精确的手动分块策略，优化您的大型文本处理流程，提高向量检索效率和准确性。
          </p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <Button size='lg'>开始使用</Button>
            <Button size='lg' variant='outline'>
              查看文档
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-16'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl font-bold mb-4'>核心优势</h2>
            <p className='max-w-[600px] mx-auto'>
              手动分块如何提升您的AI应用效能
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              {
                title: '语义完整性',
                description:
                  '手动分块保证每个文本片段的语义完整，提高检索质量和回答准确性',
              },
              {
                title: '自定义控制',
                description:
                  '根据不同文档类型和领域特点，灵活调整分块策略和大小',
              },
              {
                title: '性能优化',
                description:
                  '通过精确分块减少无关信息干扰，降低token消耗，提高处理速度',
              },
            ].map((feature, index) => (
              <Card key={index} className='border'>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-16'>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>
                优化您的文本处理流程
              </CardTitle>
              <CardDescription>
                利用手动分块技术，提升AI应用的效能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='mb-4'>
                我们提供专业的手动分块工具和最佳实践指南，帮助您解决复杂文本处理挑战。
              </p>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button>免费体验</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Footer */}
        <footer className='border-t py-8 text-center'>
          <p>© 2025 手动分块优化. 保留所有权利.</p>
        </footer>
      </div>
    </main>
  );
}
