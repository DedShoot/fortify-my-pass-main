import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Shield, Key, AlertTriangle, CheckCircle, Lock, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  passwordAnalysis?: PasswordAnalysis;
  passwordSuggestions?: PasswordSuggestion[];
}

interface PasswordAnalysis {
  score: number;
  strength: 'weak' | 'medium' | 'strong' | 'excellent';
  issues: string[];
  suggestions: string[];
  estimatedCrackTime: string;
}

interface PasswordSuggestion {
  password: string;
  type: string;
  description: string;
  analysis: PasswordAnalysis;
}

export const ChatBot = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ваш AI-помощник по кибербезопасности. Отправьте мне пароль, и я проанализирую его защищенность или напишите "предложи пароли" для получения вариантов.',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzePassword = (password: string): PasswordAnalysis => {
    let score = 0;
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Length check
    if (password.length < 8) {
      issues.push('Пароль слишком короткий');
      suggestions.push('Используйте минимум 8 символов');
    } else if (password.length >= 12) {
      score += 25;
    } else {
      score += 15;
      suggestions.push('Рекомендуется использовать 12+ символов');
    }

    // Character variety
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const charTypes = [hasLower, hasUpper, hasNumbers, hasSpecial].filter(Boolean).length;
    score += charTypes * 15;

    if (!hasLower) suggestions.push('Добавьте строчные буквы');
    if (!hasUpper) suggestions.push('Добавьте заглавные буквы');
    if (!hasNumbers) suggestions.push('Добавьте цифры');
    if (!hasSpecial) suggestions.push('Добавьте специальные символы');

    // Common patterns
    const commonPatterns = ['123', 'abc', 'qwerty', 'password', '000'];
    const hasCommonPattern = commonPatterns.some(pattern => 
      password.toLowerCase().includes(pattern)
    );
    
    if (hasCommonPattern) {
      issues.push('Содержит распространенные последовательности');
      suggestions.push('Избегайте очевидных паттернов');
      score -= 20;
    }

    // Repeated characters
    const hasRepeated = /(.)\1{2,}/.test(password);
    if (hasRepeated) {
      issues.push('Много повторяющихся символов');
      suggestions.push('Разнообразьте символы в пароле');
      score -= 10;
    }

    score = Math.max(0, Math.min(100, score));

    let strength: 'weak' | 'medium' | 'strong' | 'excellent';
    let estimatedCrackTime: string;

    if (score < 30) {
      strength = 'weak';
      estimatedCrackTime = 'Менее 1 дня';
    } else if (score < 60) {
      strength = 'medium';
      estimatedCrackTime = 'Несколько месяцев';
    } else if (score < 80) {
      strength = 'strong';
      estimatedCrackTime = 'Несколько лет';
    } else {
      strength = 'excellent';
      estimatedCrackTime = 'Тысячи лет';
    }

    return { score, strength, issues, suggestions, estimatedCrackTime };
  };

  const generatePassword = (length: number, includeSpecial: boolean = true): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let availableChars = lowercase + uppercase + numbers;
    if (includeSpecial) {
      availableChars += special;
    }
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSpecial) {
      password += special[Math.floor(Math.random() * special.length)];
    }
    
    // Fill the rest randomly
    const startLength = includeSpecial ? 4 : 3;
    for (let i = startLength; i < length; i++) {
      password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const generatePasswordSuggestions = (): PasswordSuggestion[] => {
    const suggestions: PasswordSuggestion[] = [
      {
        password: generatePassword(12, true),
        type: 'Стандартный',
        description: 'Сбалансированный пароль средней длины',
        analysis: {} as PasswordAnalysis
      },
      {
        password: generatePassword(16, true),
        type: 'Усиленный',
        description: 'Длинный пароль с максимальной защитой',
        analysis: {} as PasswordAnalysis
      },
      {
        password: generatePassword(10, false),
        type: 'Простой',
        description: 'Без специальных символов для старых систем',
        analysis: {} as PasswordAnalysis
      },
      {
        password: generatePassword(20, true),
        type: 'Максимальный',
        description: 'Экстра-длинный для критически важных данных',
        analysis: {} as PasswordAnalysis
      }
    ];

    // Добавляем анализ для каждого пароля
    suggestions.forEach(suggestion => {
      suggestion.analysis = analyzePassword(suggestion.password);
    });

    return suggestions;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Скопировано!",
        description: "Пароль скопирован в буфер обмена",
      });
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать пароль",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      let botResponse: Message;

      if (input.toLowerCase().includes('предложи') || input.toLowerCase().includes('варианты') || input.toLowerCase().includes('несколько паролей')) {
        const suggestions = generatePasswordSuggestions();
        
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `Вот несколько вариантов надежных паролей на выбор:`,
          isBot: true,
          timestamp: new Date(),
          passwordSuggestions: suggestions,
        };
      } else if (input.toLowerCase().includes('сгенерируй') || input.toLowerCase().includes('создай пароль')) {
        const newPassword = generatePassword(16, true);
        const analysis = analyzePassword(newPassword);
        
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `Вот сильный пароль для вас: **${newPassword}**\n\nЭтот пароль имеет отличную защиту и его взлом займет ${analysis.estimatedCrackTime}.`,
          isBot: true,
          timestamp: new Date(),
          passwordAnalysis: analysis,
        };
      } else {
        // Check if message looks like a password
        const isPassword = input.length >= 4 && !input.includes(' ') && input.length < 50;
        
        if (isPassword) {
          const analysis = analyzePassword(input);
          
          let responseText = `Анализ вашего пароля завершен!\n\n`;
          responseText += `**Оценка безопасности:** ${analysis.score}/100\n`;
          responseText += `**Уровень защиты:** ${
            analysis.strength === 'weak' ? 'Слабый' :
            analysis.strength === 'medium' ? 'Средний' :
            analysis.strength === 'strong' ? 'Сильный' : 'Отличный'
          }\n`;
          responseText += `**Время взлома:** ${analysis.estimatedCrackTime}\n\n`;
          
          if (analysis.issues.length > 0) {
            responseText += `**Проблемы:**\n${analysis.issues.map(issue => `• ${issue}`).join('\n')}\n\n`;
          }
          
          if (analysis.suggestions.length > 0) {
            responseText += `**Рекомендации:**\n${analysis.suggestions.map(sugg => `• ${sugg}`).join('\n')}`;
          }
          
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            isBot: true,
            timestamp: new Date(),
            passwordAnalysis: analysis,
          };
        } else {
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Отправьте мне пароль для анализа, "предложи пароли" для вариантов или "сгенерируй пароль" для создания одного.',
            isBot: true,
            timestamp: new Date(),
          };
        }
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-destructive';
      case 'medium': return 'bg-amber-500';
      case 'strong': return 'bg-cyber-blue';
      case 'excellent': return 'bg-cyber-green';
      default: return 'bg-muted';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'weak': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Shield className="w-4 h-4" />;
      case 'strong': return <Lock className="w-4 h-4" />;
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] bg-card/50 backdrop-blur-lg border-cyber-green/30 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-cyber-green/30 bg-gradient-to-r from-cyber-green/10 to-cyber-blue/10">
          <div className="relative">
            <Bot className="w-8 h-8 text-cyber-green animate-pulse-glow" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-green rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">CyberGuard AI</h3>
            <p className="text-sm text-muted-foreground">Анализатор паролей</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              {message.isBot && (
                <div className="flex-shrink-0">
                  <Bot className="w-6 h-6 text-cyber-green mt-1" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.isBot ? '' : 'order-1'}`}>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.isBot
                      ? 'bg-card border border-cyber-green/30'
                      : 'bg-cyber-green text-background'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                  
                  {message.passwordAnalysis && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`${getStrengthColor(message.passwordAnalysis.strength)} text-white`}
                        >
                          {getStrengthIcon(message.passwordAnalysis.strength)}
                          <span className="ml-1">
                            {message.passwordAnalysis.score}/100
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getStrengthColor(message.passwordAnalysis.strength)}`}
                          style={{ width: `${message.passwordAnalysis.score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {message.passwordSuggestions && (
                    <div className="mt-4 space-y-3">
                      {message.passwordSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-muted/30 rounded-lg border border-cyber-green/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`${getStrengthColor(suggestion.analysis.strength)} text-white text-xs`}>
                                {suggestion.type}
                              </Badge>
                              <Badge 
                                className={`${getStrengthColor(suggestion.analysis.strength)} text-white`}
                              >
                                {suggestion.analysis.score}/100
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(suggestion.password)}
                              className="h-8 w-8 p-0 border-cyber-green/30 hover:border-cyber-green hover:bg-cyber-green/10"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="font-mono text-sm bg-background/50 p-2 rounded border border-cyber-green/20 mb-2 break-all">
                            {suggestion.password}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            {suggestion.description}
                          </p>
                          
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${getStrengthColor(suggestion.analysis.strength)}`}
                              style={{ width: `${suggestion.analysis.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setInput('предложи пароли');
                            handleSend();
                          }}
                          className="border-cyber-blue/30 hover:border-cyber-blue hover:bg-cyber-blue/10 text-cyber-blue"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Новые варианты
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {!message.isBot && (
                <div className="flex-shrink-0 order-2">
                  <User className="w-6 h-6 text-cyber-blue mt-1" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Bot className="w-6 h-6 text-cyber-green mt-1" />
              <div className="bg-card border border-cyber-green/30 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-cyber-green/30 p-4 bg-gradient-to-r from-cyber-green/5 to-cyber-blue/5">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Введите пароль или 'предложи пароли'..."
              className="flex-1 bg-input/50 border-cyber-green/30 focus:border-cyber-green focus:ring-cyber-green/20 transition-all duration-300"
            />
            <Button 
              onClick={handleSend}
              className="bg-cyber-green hover:bg-cyber-green/80 text-background transition-all duration-300 hover:shadow-lg hover:shadow-cyber-green/20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};