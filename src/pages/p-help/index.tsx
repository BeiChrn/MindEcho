

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface HelpNavItem {
  id: string;
  icon: string;
  label: string;
  contentId: string;
}

const PHelpPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeHelpNavItem, setActiveHelpNavItem] = useState('intro');
  const [helpSearchTerm, setHelpSearchTerm] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const helpNavItems: HelpNavItem[] = [
    { id: 'intro', icon: 'fas fa-play-circle', label: '入门指南', contentId: 'help-content-intro' },
    { id: 'features', icon: 'fas fa-cogs', label: '功能介绍', contentId: 'help-content-features' },
    { id: 'ai', icon: 'fas fa-robot', label: 'AI功能使用', contentId: 'help-content-ai' },
    { id: 'reading', icon: 'fas fa-book-open', label: '阅读设置', contentId: 'help-content-reading' },
    { id: 'files', icon: 'fas fa-file-upload', label: '文件管理', contentId: 'help-content-files' },
    { id: 'common', icon: 'fas fa-question-circle', label: '常见问题', contentId: 'help-content-common' },
    { id: 'contact', icon: 'fas fa-envelope', label: '联系我们', contentId: 'help-content-contact' }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '帮助中心 - MindEcho 心锚';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleHelpNavItemClick = (itemId: string) => {
    setActiveHelpNavItem(itemId);
    setHelpSearchTerm('');
    clearSearchHighlights();
  };

  const handleHelpSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    setHelpSearchTerm(searchTerm);
    
    if (searchTerm === '') {
      clearSearchHighlights();
      return;
    }

    clearSearchHighlights();

    const textElements = document.querySelectorAll('p, li, h3');
    textElements.forEach(element => {
      const originalText = element.innerHTML;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlightedText = originalText.replace(regex, '<span class="' + styles.searchHighlight + '">$1</span>');
      element.innerHTML = highlightedText;
    });

    const hasResults = Array.from(document.querySelectorAll('.' + styles.searchHighlight)).length > 0;
    if (hasResults) {
      const firstHighlight = document.querySelector('.' + styles.searchHighlight);
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const clearSearchHighlights = () => {
    const highlights = document.querySelectorAll('.' + styles.searchHighlight);
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
        parent.normalize();
      }
    });
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchTerm.trim();
      if (searchTerm) {
        console.log('全局搜索:', searchTerm);
        alert(`正在搜索: ${searchTerm}`);
      }
    }
  };

  const handleContactSupportClick = () => {
    alert('在线客服功能正在开发中，敬请期待！');
  };

  const renderHelpContent = (itemId: string) => {
    switch (itemId) {
      case 'intro':
        return (
          <div className={`${styles.helpContent} ${activeHelpNavItem === 'intro' && !helpSearchTerm ? styles.helpContentActive : ''}`}>
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-text-primary mb-6">入门指南</h1>
              
              <div className="bg-bg-primary rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">欢迎使用 MindEcho 心锚</h2>
                <p className="text-text-secondary mb-4">
                  MindEcho 心锚是一款智能阅读工具，通过AI技术帮助您更高效地阅读和理解复杂内容。以下是快速上手的基本步骤：
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div>
                      <h3 className="font-medium text-text-primary">上传文件</h3>
                      <p className="text-sm text-text-secondary">点击"文件上传"，选择或拖放您要阅读的文档（支持TXT、PDF、EPUB、DOCX格式）</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div>
                      <h3 className="font-medium text-text-primary">选择处理选项</h3>
                      <p className="text-sm text-text-secondary">勾选"启用AI内容理解"和"文本增强"以获得最佳阅读体验</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div>
                      <h3 className="font-medium text-text-primary">开始阅读</h3>
                      <p className="text-sm text-text-secondary">点击"开始阅读"进入阅读器界面，享受AI辅助的阅读体验</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary to-secondary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-text-primary mb-2">
                  <i className="fas fa-lightbulb text-accent mr-2"></i>
                  小贴士
                </h3>
                <p className="text-sm text-text-secondary">
                  初次使用建议先阅读"功能介绍"了解各项AI功能，或查看"常见问题"快速解决疑问。
                </p>
              </div>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className={`${styles.helpContent} ${activeHelpNavItem === 'features' && !helpSearchTerm ? styles.helpContentActive : ''}`}>
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-text-primary mb-6">功能介绍</h1>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-robot text-primary text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">AI内容理解</h3>
                  <ul className="text-sm text-text-secondary space-y-2">
                    <li>• 人物关系梳理与可视化</li>
                    <li>• 复杂概念智能解释</li>
                    <li>• 思维导图自动生成</li>
                    <li>• 内容摘要与关键信息提取</li>
                  </ul>
                </div>
                
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-image text-secondary text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">AI文生图</h3>
                  <ul className="text-sm text-text-secondary space-y-2">
                    <li>• 选中文本生成相关图片</li>
                    <li>• 人物画像智能生成</li>
                    <li>• 多种艺术风格选择</li>
                    <li>• 图片保存与分享</li>
                  </ul>
                </div>
                
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-magic text-accent text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">文本增强</h3>
                  <ul className="text-sm text-text-secondary space-y-2">
                    <li>• 关键词高亮显示</li>
                    <li>• 随机加粗吸引注意</li>
                    <li>• 文字放大突出重点</li>
                    <li>• 一键开关增强效果</li>
                  </ul>
                </div>
                
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-bookmark text-green-500 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">知识管理</h3>
                  <ul className="text-sm text-text-secondary space-y-2">
                    <li>• 书签添加与管理</li>
                    <li>• 笔记编辑与保存</li>
                    <li>• 全文搜索功能</li>
                    <li>• 阅读进度记忆</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className={`${styles.helpContent} ${activeHelpNavItem === 'ai' && !helpSearchTerm ? styles.helpContentActive : ''}`}>
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-text-primary mb-6">AI功能使用</h1>
              
              <div className="bg-bg-primary rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">AI文生图功能</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <p className="text-sm text-text-secondary">在阅读页面中，用鼠标选中文本段落</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <p className="text-sm text-text-secondary">选中的文本上方会出现"生成图片"按钮</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <p className="text-sm text-text-secondary">点击按钮后，AI将根据文本内容生成相关图片</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-bg-primary rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">AI内容理解功能</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <p className="text-sm text-text-secondary">上传文件时勾选"启用AI内容理解"选项</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <p className="text-sm text-text-secondary">在阅读页面点击"AI助手"按钮展开面板</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <p className="text-sm text-text-secondary">查看AI生成的人物关系、思维导图等内容</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reading':
        return (
          <div className={`${styles.helpContent} ${activeHelpNavItem === 'reading' && !helpSearchTerm ? styles.helpContentActive : ''}`}>
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-text-primary mb-6">阅读设置</h1>
              
              <div className="bg-bg-primary rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">个性化阅读设置</h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">字体与字号</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• 支持多种字体选择</li>
                      <li>• 字号可在12px-24px间调整</li>
                      <li>• 可通过工具栏快速调整</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">背景与主题</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• 多种背景颜色选择</li>
                      <li>• 夜间模式保护视力</li>
                      <li>• 自定义背景图片</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">排版设置</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• 行间距调整</li>
                      <li>• 页边距自定义</li>
                      <li>• 文本增强开关</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">其他功能</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• 阅读进度自动保存</li>
                      <li>• 书签与笔记同步</li>
                      <li>• 全文搜索功能</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'files':
        return (
          <div className={`${styles.helpContent} ${activeHelpNavItem === 'files' && !helpSearchTerm ? styles.helpContentActive : ''}`}>
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-text-primary mb-6">文件管理</h1>
              
              <div className="bg-bg-primary rounded-lg shadow-card p-6 mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">文件上传与管理</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-text-primary mb-2">支持格式</h3>
                    <p className="text-sm text-text-secondary">
                      支持TXT、PDF、EPUB、DOCX格式，单个文件最大50MB，每次最多上传3个文件。
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-text-primary mb-2">历史记录</h3>
                    <p className="text-sm text-text-secondary">
                      所有上传的文件都会保存在历史记录中，可随时查看和再次阅读。
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-text-primary mb-2">文件删除</h3>
                    <p className="text-sm text-text-secondary">
                      可在历史记录页面删除不需要的文件，删除后相关的笔记和书签也会被清除。
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-text-primary mb-2">离线支持</h3>
                    <p className="text-sm text-text-secondary">
                      已阅读的文件会被缓存，断网时也可查看已缓存的内容。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'common':
        return (
          <div className={`${styles.helpContent} ${activeHelpNavItem === 'common' && !helpSearchTerm ? styles.helpContentActive : ''}`}>
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-text-primary mb-6">常见问题</h1>
              
              <div className="space-y-6">
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <h3 className="font-semibold text-text-primary mb-3">Q: AI生成图片需要多长时间？</h3>
                  <p className="text-sm text-text-secondary">
                    A: 通常需要10-15秒。如果网络状况良好，可能更快完成。如遇AI服务繁忙，时间可能会延长。
                  </p>
                </div>
                
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <h3 className="font-semibold text-text-primary mb-3">Q: 支持哪些文件格式？</h3>
                  <p className="text-sm text-text-secondary">
                    A: 目前支持TXT、PDF、EPUB、DOCX四种格式，更多格式正在开发中。
                  </p>
                </div>
                
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <h3 className="font-semibold text-text-primary mb-3">Q: 免费用户有什么限制？</h3>
                  <p className="text-sm text-text-secondary">
                    A: 免费用户每日AI图片生成次数限制为10次，AI内容理解功能每日限制20次。付费用户无此限制。
                  </p>
                </div>
                
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <h3 className="font-semibold text-text-primary mb-3">Q: 我的文件和数据安全吗？</h3>
                  <p className="text-sm text-text-secondary">
                    A: 我们严格保护用户隐私，所有文件和数据都经过加密处理，仅用于为您提供服务，不会用于其他商业目的。
                  </p>
                </div>
                
                <div className="bg-bg-primary rounded-lg shadow-card p-6">
                  <h3 className="font-semibold text-text-primary mb-3">Q: 如何备份我的笔记和书签？</h3>
                  <p className="text-sm text-text-secondary">
                    A: 笔记和书签会自动同步到您的账户中，您可以在任何设备上登录查看。建议定期导出重要笔记。
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className={`${styles.helpContent} ${activeHelpNavItem === 'contact' && !helpSearchTerm ? styles.helpContentActive : ''}`}>
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-text-primary mb-6">联系我们</h1>
              
              <div className="bg-bg-primary rounded-lg shadow-card p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-envelope text-primary text-2xl"></i>
                  </div>
                  <h2 className="text-lg font-semibold text-text-primary mb-2">需要帮助？</h2>
                  <p className="text-text-secondary">我们的客服团队会在24小时内回复您的问题</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="text-center">
                    <h3 className="font-medium text-text-primary mb-2">邮箱支持</h3>
                    <p className="text-sm text-text-secondary mb-3">发送邮件至客服邮箱</p>
                    <a href="mailto:support@mindecho.com" className="text-primary hover:text-secondary">
                      support@mindecho.com
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium text-text-primary mb-2">在线客服</h3>
                    <p className="text-sm text-text-secondary mb-3">工作日 9:00-18:00 在线</p>
                    <button 
                      onClick={handleContactSupportClick}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                    >
                      立即咨询
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border-primary">
                  <h3 className="font-medium text-text-primary mb-3">反馈建议</h3>
                  <p className="text-sm text-text-secondary">
                    您的建议是我们改进产品的重要依据，欢迎通过以下方式向我们反馈：
                  </p>
                  <ul className="text-sm text-text-secondary space-y-1 mt-2">
                    <li>• 产品内反馈功能</li>
                    <li>• 官方论坛讨论区</li>
                    <li>• 社交媒体私信</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-bg-primary border-b border-border-primary shadow-nav z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <i className="fas fa-bars text-text-secondary"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-text-primary">MindEcho 心锚</h1>
            </div>
          </div>
          
          {/* 中间：全局搜索 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索文件内容..." 
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：用户操作区 */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="https://s.coze.cn/image/kTJQr30UDpI/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full" 
              />
              <span className="hidden md:block text-sm font-medium">张三</span>
              <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-primary transition-all duration-300 z-40 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        <nav className="p-4 space-y-2">
          <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-home text-lg w-5"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link to="/file-upload" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-upload text-lg w-5"></i>
            {!isSidebarCollapsed && <span>文件上传</span>}
          </Link>
          <Link to="/reader" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-book-open text-lg w-5"></i>
            {!isSidebarCollapsed && <span>阅读器</span>}
          </Link>
          <Link to="/history" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-history text-lg w-5"></i>
            {!isSidebarCollapsed && <span>历史记录</span>}
          </Link>
          <Link to="/settings" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-cog text-lg w-5"></i>
            {!isSidebarCollapsed && <span>设置</span>}
          </Link>
          <Link to="/help" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-primary`}>
            <i className="fas fa-question-circle text-lg w-5"></i>
            {!isSidebarCollapsed && <span>帮助</span>}
          </Link>
          <Link to="/profile" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-user text-lg w-5"></i>
            {!isSidebarCollapsed && <span>个人中心</span>}
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        {/* 页面头部 */}
        <div className="bg-bg-primary border-b border-border-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">帮助中心</h2>
              <nav className="text-sm text-text-secondary mt-1">
                <span>首页</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>帮助中心</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索帮助内容..." 
                  value={helpSearchTerm}
                  onChange={handleHelpSearchChange}
                  className="pl-10 pr-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>
            </div>
          </div>
        </div>

        {/* 帮助内容区域 */}
        <div className="flex">
          {/* 帮助文档导航 */}
          <aside className="w-64 bg-bg-primary border-r border-border-primary p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-4">帮助主题</h3>
            <nav className="space-y-1 text-sm">
              {helpNavItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleHelpNavItemClick(item.id)}
                  className={`${styles.helpNavItem} px-3 py-2 rounded-lg ${activeHelpNavItem === item.id ? styles.helpNavItemActive : 'text-text-secondary'}`}
                >
                  <i className={`${item.icon} mr-2 text-xs`}></i>
                  {item.label}
                </div>
              ))}
            </nav>
          </aside>

          {/* 帮助内容展示区 */}
          <div className="flex-1 p-6 max-w-4xl">
            {helpNavItems.map((item) => renderHelpContent(item.id))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PHelpPage;

