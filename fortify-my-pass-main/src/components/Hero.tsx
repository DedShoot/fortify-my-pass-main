import { Shield, Lock, Key, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cyberHero from '@/assets/cyber-hero.jpg';
export const Hero = () => {
  const scrollToChat = () => {
    document.getElementById('chatbot')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{
      backgroundImage: `url(${cyberHero})`
    }} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyber-green/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '-1s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyber-purple/5 rounded-full blur-3xl animate-float" style={{
        animationDelay: '-2s'
      }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Icon Grid */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="p-3 rounded-lg bg-cyber-green/20 backdrop-blur-sm border border-cyber-green/30 animate-pulse-glow">
            <Shield className="w-8 h-8 text-cyber-green" />
          </div>
          <div className="p-3 rounded-lg bg-cyber-blue/20 backdrop-blur-sm border border-cyber-blue/30 animate-pulse-glow" style={{
          animationDelay: '0.5s'
        }}>
            <Lock className="w-8 h-8 text-cyber-blue" />
          </div>
          <div className="p-3 rounded-lg bg-cyber-purple/20 backdrop-blur-sm border border-cyber-purple/30 animate-pulse-glow" style={{
          animationDelay: '1s'
        }}>
            <Key className="w-8 h-8 text-cyber-purple" />
          </div>
          <div className="p-3 rounded-lg bg-cyber-green/20 backdrop-blur-sm border border-cyber-green/30 animate-pulse-glow" style={{
          animationDelay: '1.5s'
        }}>
            <Bot className="w-8 h-8 text-cyber-green" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyber-green via-cyber-blue to-cyber-purple bg-clip-text text-transparent animate-pulse-glow">
          CyberGuard AI
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/90 mb-4 font-light">Анализатор пароле</p>
        
        <p className="text-2xl md:text-3xl text-cyber-green font-semibold mb-8">
          искусственного интеллекта
        </p>

        {/* Description */}
        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Мгновенная оценка безопасности ваших паролей с помощью передовых 
            алгоритмов AI. Получите персональные рекомендации и защитите 
            свои данные от киберугроз.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-cyber-green/20 hover:border-cyber-green/40 transition-all duration-300">
            <Shield className="w-6 h-6 text-cyber-green mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Анализ безопасности</h3>
            <p className="text-xs text-muted-foreground mt-1">Глубокий анализ уязвимостей</p>
          </div>
          
          <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-cyber-blue/20 hover:border-cyber-blue/40 transition-all duration-300">
            <Bot className="w-6 h-6 text-cyber-blue mx-auto mb-2" />
            <h3 className="font-semibold text-sm">AI рекомендации</h3>
            <p className="text-xs text-muted-foreground mt-1">Умные советы по улучшению</p>
          </div>
          
          <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-cyber-purple/20 hover:border-cyber-purple/40 transition-all duration-300">
            <Key className="w-6 h-6 text-cyber-purple mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Генерация паролей</h3>
            <p className="text-xs text-muted-foreground mt-1">Создание надежных паролей</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button onClick={scrollToChat} size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyber-green to-cyber-blue hover:from-cyber-green/80 hover:to-cyber-blue/80 text-background font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyber-green/20 animate-pulse-glow">
          Начать анализ пароля
          <Bot className="ml-2 w-5 h-5" />
        </Button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyber-green/50 rounded-full p-1">
            <div className="w-1 h-3 bg-cyber-green rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>;
};