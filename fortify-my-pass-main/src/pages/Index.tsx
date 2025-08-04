import { Hero } from '@/components/Hero';
import { ChatBot } from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      {/* Chat Section */}
      <section id="chatbot" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent">
              Проверьте ваш пароль
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Просто введите пароль в чат, и наш AI проанализирует его безопасность за секунды
            </p>
          </div>
          
          <ChatBot />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-green/20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 CyberGuard AI. Ваша безопасность - наш приоритет.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;