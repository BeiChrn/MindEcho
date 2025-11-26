

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface Note {
  id: string;
  content: string;
  title: string;
}

interface Bookmark {
  id: string;
  chapter: string;
  page: string;
  paragraph: string;
}

const ReaderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTextEnhanced, setIsTextEnhanced] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTocVisible, setIsTocVisible] = useState(true);
  const [isAiPanelVisible, setIsAiPanelVisible] = useState(true);
  const [currentFontSize, setCurrentFontSize] = useState(16);
  const [textSearchValue, setTextSearchValue] = useState('');
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  
  // 模态框状态
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAiImageModal, setShowAiImageModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showTextSelectionToolbar, setShowTextSelectionToolbar] = useState(false);
  const [textSelectionPosition, setTextSelectionPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isAiImageLoading, setIsAiImageLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  
  // 数据状态
  const [notesList, setNotesList] = useState<Note[]>([
    {
      id: '1',
      content: '机器学习的三种主要类型：监督、无监督、强化学习',
      title: '核心概念'
    }
  ]);
  
  const [bookmarksList, setBookmarksList] = useState<Bookmark[]>([
    {
      id: '1',
      chapter: '第二章：机器学习的发展',
      page: '第2页',
      paragraph: '段落1'
    }
  ]);
  
  const [readingProgress, setReadingProgress] = useState(68);
  
  // Refs
  const textSelectionToolbarRef = useRef<HTMLDivElement>(null);
  const progressSaveTimerRef = useRef<number | null>(null);
  
  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'MindEcho 心锚 - 阅读器';
    return () => {
      document.title = originalTitle;
    };
  }, []);
  
  // 加载文件内容
  useEffect(() => {
    const fileId = searchParams.get('fileId');
    if (fileId) {
      loadFileContent(fileId);
    }
  }, [searchParams]);
  
  // 文本选择监听
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setTextSelectionPosition({
          x: rect.left + rect.width / 2 - 80,
          y: rect.top - 40
        });
        setSelectedText(selection.toString().trim());
        setShowTextSelectionToolbar(true);
      } else {
        setShowTextSelectionToolbar(false);
      }
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // 阅读进度保存
  useEffect(() => {
    const handleScroll = () => {
      if (progressSaveTimerRef.current) {
        clearTimeout(progressSaveTimerRef.current);
      }
      progressSaveTimerRef.current = window.setTimeout(() => {
        saveReadingProgress();
      }, 1000);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (progressSaveTimerRef.current) {
        clearTimeout(progressSaveTimerRef.current);
      }
    };
  }, []);
  
  // 模拟加载文件内容
  const loadFileContent = (fileId: string) => {
    console.log('加载文件内容，文件ID:', fileId);
  };
  
  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  // 字体大小调整
  const handleFontDecrease = () => {
    if (currentFontSize > 12) {
      setCurrentFontSize(currentFontSize - 1);
    }
  };
  
  const handleFontIncrease = () => {
    if (currentFontSize < 24) {
      setCurrentFontSize(currentFontSize + 1);
    }
  };
  
  // 夜间模式切换
  const handleNightModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // 文本增强切换
  const handleTextEnhanceToggle = () => {
    setIsTextEnhanced(!isTextEnhanced);
  };
  
  // 目录切换
  const handleTocToggle = () => {
    setIsTocVisible(!isTocVisible);
  };
  
  // AI面板切换
  const handleAiPanelToggle = () => {
    setIsAiPanelVisible(!isAiPanelVisible);
  };
  
  // 全屏切换
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // 搜索功能
  const handleTextSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setTextSearchValue(searchTerm);
    if (searchTerm) {
      console.log('搜索到内容:', searchTerm);
    }
  };
  
  // 笔记相关
  const openNoteModal = (selectedTextContent: string = '') => {
    setNoteContent(selectedTextContent ? selectedTextContent + '\n\n' : '');
    setShowNoteModal(true);
  };
  
  const handleSaveNote = () => {
    const content = noteContent.trim();
    if (content) {
      const newNote: Note = {
        id: Date.now().toString(),
        content,
        title: '笔记'
      };
      setNotesList([newNote, ...notesList]);
      setShowNoteModal(false);
      setNoteContent('');
    }
  };
  
  // AI生成图片
  const generateAIImage = async (prompt: string) => {
    setIsAiImageLoading(true);
    setShowAiImageModal(true);
    setGeneratedImageUrl('');
    
    try {
      // 调用文生图API
      const response = await fetch('https://s.coze.cn/image/ft8k8jlpa0I/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-257225d6f0fb42078779d74270d13a66',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 处理SSE响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      const decoder = new TextDecoder();
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // 解析SSE响应，提取图像URL
          // 这里假设响应格式包含图像URL
          // 实际解析逻辑需要根据API返回的具体格式调整
          if (chunk.includes('image_url')) {
            const match = chunk.match(/"image_url":"([^"]+)"/);
            if (match && match[1]) {
              setGeneratedImageUrl(match[1]);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating AI image:', error);
      // 出错时使用备用图片
      setGeneratedImageUrl('https://s.coze.cn/image/1CntC_vi7KI/');
    } finally {
      setIsAiImageLoading(false);
    }
  };
  // 重新生成图片
  const handleRegenerateImage = () => {
    const currentParagraph = '机器学习是人工智能的一个重要分支，它使计算机能够通过数据学习并改进性能，而无需显式编程。';
    generateAIImage(currentParagraph);
  };
  
  // AI生成总结
  const generateSummary = async (text: string) => {
    setIsSummaryLoading(true);
    setGeneratedSummary('');
    
    try {
      // 调用AI总结模型API
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-257225d6f0fb42078779d74270d13a66',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [
            {
              role: 'system',
              content: '请总结以下文本内容，保持简洁明了。'
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 200
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        setGeneratedSummary(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setGeneratedSummary('生成总结失败，请稍后重试。');
    } finally {
      setIsSummaryLoading(false);
    }
  };
  
  const handleSaveImage = () => {
    console.log('保存图片到本地');
  };
  
  // 书签相关
  const addBookmark = () => {
    const currentChapter = '第二章：机器学习的发展';
    console.log('添加书签:', currentChapter);
  };
  
  // 章节导航
  const handleChapterNavigation = (chapterId: string) => {
    const targetElement = document.querySelector(`#${chapterId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 保存阅读进度
  const saveReadingProgress = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    setReadingProgress(Math.round(scrollPercent));
    console.log('保存阅读进度:', Math.round(scrollPercent) + '%');
  };
  
  // 模态框背景点击关闭
  const handleModalOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowNoteModal(false);
      setShowAiImageModal(false);
      setShowBookmarkModal(false);
    }
  };
  
  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
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
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
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
                src="https://s.coze.cn/image/3qmZ55UvoQ0/" 
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
          <Link to="/reader" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-primary`}>
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
          <Link to="/help" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
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
              <h2 className="text-lg font-semibold text-text-primary">《人工智能简史》</h2>
              <nav className="text-sm text-text-secondary mt-1">
                <span>首页</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>阅读器</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>人工智能简史</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-text-secondary">
                <span>阅读进度: {readingProgress}%</span>
                <div className="w-32 h-1 bg-gray-200 rounded-full mt-1">
                  <div className={styles.readingProgress} style={{ width: `${readingProgress}%` }}></div>
                </div>
              </div>
              <button onClick={handleFullscreenToggle} className="p-2 rounded-lg hover:bg-gray-100">
                <i className="fas fa-expand text-text-secondary"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="bg-bg-primary border-b border-border-primary px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 搜索 */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索文本内容..." 
                  value={textSearchValue}
                  onChange={handleTextSearchChange}
                  className="pl-10 pr-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>
              
              {/* 书签 */}
              <button 
                onClick={() => setShowBookmarkModal(true)}
                className={`${styles.toolbarButton} p-2 rounded-lg text-text-secondary hover:text-primary`}
              >
                <i className="fas fa-bookmark"></i>
                <span className="ml-1 text-sm">书签</span>
              </button>
              
              {/* 笔记 */}
              <button 
                onClick={() => openNoteModal()}
                className={`${styles.toolbarButton} p-2 rounded-lg text-text-secondary hover:text-primary`}
              >
                <i className="fas fa-sticky-note"></i>
                <span className="ml-1 text-sm">笔记</span>
              </button>
              {/* AI文生图 */}
              <button 
                onClick={() => {
                  const currentParagraph = '机器学习是人工智能的一个重要分支，它使计算机能够通过数据学习并改进性能，而无需显式编程。';
                  generateAIImage(currentParagraph);
                }}
                className={`${styles.toolbarButton} p-2 rounded-lg text-text-secondary hover:text-primary`}
              >
                <i className="fas fa-image"></i>
                <span className="ml-1 text-sm">AI生成图片</span>
              </button>
              
              {/* AI总结 */}
              <button 
                onClick={() => {
                  const currentParagraph = '机器学习是人工智能的一个重要分支，它使计算机能够通过数据学习并改进性能，而无需显式编程。这一领域的发展可以追溯到20世纪50年代，但真正的突破发生在最近几十年。在监督学习中，算法通过标记好的训练数据学习输入和输出之间的映射关系。这种方法在图像识别、语音识别等领域取得了巨大成功。相比之下，无监督学习处理的是没有标签的数据。算法需要自己发现数据中的模式和结构。强化学习则是另一种重要的学习范式，它通过与环境的交互来学习最优策略。';
                  generateSummary(currentParagraph);
                }}
                className={`${styles.toolbarButton} p-2 rounded-lg text-text-secondary hover:text-primary`}
              >
                <i className="fas fa-file-alt"></i>
                <span className="ml-1 text-sm">AI总结</span>
              </button>
              
              {/* 分隔线 */}
              <div className="w-px h-6 bg-border-secondary"></div>
              
              {/* 字体大小 */}
              <div className="flex items-center space-x-2">
                <button onClick={handleFontDecrease} className="p-1 rounded hover:bg-gray-100">
                  <i className="fas fa-minus text-sm text-text-secondary"></i>
                </button>
                <span className="text-sm text-text-secondary">{currentFontSize}px</span>
                <button onClick={handleFontIncrease} className="p-1 rounded hover:bg-gray-100">
                  <i className="fas fa-plus text-sm text-text-secondary"></i>
                </button>
              </div>
              
              {/* 夜间模式 */}
              <button 
                onClick={handleNightModeToggle}
                className={`${styles.toolbarButton} p-2 rounded-lg text-text-secondary hover:text-primary`}
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              
              {/* 文本增强 */}
              <button 
                onClick={handleTextEnhanceToggle}
                className={`${styles.toolbarButton} p-2 rounded-lg text-primary ${isTextEnhanced ? 'bg-primary bg-opacity-10' : ''}`}
              >
                <i className="fas fa-magic"></i>
                <span className="ml-1 text-sm">文本增强</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* AI功能面板切换 */}
              <button 
                onClick={handleAiPanelToggle}
                className={`${styles.toolbarButton} px-3 py-2 rounded-lg text-text-secondary hover:text-primary`}
              >
                <i className="fas fa-robot mr-1"></i>
                <span className="text-sm">AI助手</span>
              </button>
              
              {/* 目录 */}
              <button 
                onClick={handleTocToggle}
                className={`${styles.toolbarButton} px-3 py-2 rounded-lg text-text-secondary hover:text-primary`}
              >
                <i className="fas fa-list mr-1"></i>
                <span className="text-sm">目录</span>
              </button>
            </div>
          </div>
        </div>

        {/* 阅读区域 */}
        <div className="flex">
          {/* 目录侧边栏 */}
          {isTocVisible && (
            <aside className="w-64 bg-bg-primary border-r border-border-primary p-4 hidden lg:block">
              <h3 className="text-sm font-semibold text-text-primary mb-3">目录</h3>
              <nav className="space-y-1 text-sm">
                <button 
                  onClick={() => handleChapterNavigation('chapter-1')}
                  className="block py-2 px-3 rounded-lg hover:bg-gray-100 text-text-secondary w-full text-left"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs"></i>
                  第一章：人工智能的起源
                </button>
                <button 
                  onClick={() => handleChapterNavigation('chapter-2')}
                  className="block py-2 px-3 rounded-lg bg-primary bg-opacity-10 text-primary w-full text-left"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs"></i>
                  第二章：机器学习的发展
                </button>
                <button 
                  onClick={() => handleChapterNavigation('chapter-3')}
                  className="block py-2 px-3 rounded-lg hover:bg-gray-100 text-text-secondary w-full text-left"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs"></i>
                  第三章：深度学习革命
                </button>
                <button 
                  onClick={() => handleChapterNavigation('chapter-4')}
                  className="block py-2 px-3 rounded-lg hover:bg-gray-100 text-text-secondary w-full text-left"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs"></i>
                  第四章：未来展望
                </button>
              </nav>
            </aside>
          )}

          {/* 主阅读区 */}
          <div className="flex-1 p-6 max-w-4xl mx-auto">
            {/* 文本内容 */}
            <article className="prose prose-lg max-w-none" style={{ fontSize: `${currentFontSize}px` }}>
              <h1 id="chapter-2" className="text-2xl font-bold text-text-primary mb-4">第二章：机器学习的发展</h1>
              
              <p className="mb-4 leading-relaxed">
                {isTextEnhanced ? (
                  <>
                    {Math.random() < 0.35 ? 
                      <span className={`${styles.textEnhanced} ${styles.underline}`}>机器学习</span> : 
                      '机器学习'
                    }
                    是人工智能的一个重要分支，它使计算机能够通过数据学习并改进性能，而无需显式编程。这一领域的发展可以追溯到20世纪50年代，但真正的突破发生在最近几十年。
                  </>
                ) : '机器学习是人工智能的一个重要分支，它使计算机能够通过数据学习并改进性能，而无需显式编程。这一领域的发展可以追溯到20世纪50年代，但真正的突破发生在最近几十年。'}
              </p>
              
              <div className={styles.conceptExplanation}>
                <strong>概念解释：</strong>机器学习是人工智能的一个分支，它使计算机系统能够自动学习和改进，而无需明确编程。通过分析数据，机器学习算法可以识别模式、做出预测并不断优化其性能。
              </div>
              
              <p className="mb-4 leading-relaxed">
                {isTextEnhanced ? (
                  <>
                    在{Math.random() < 0.35 ? 
                      <span className={`${styles.textEnhanced} ${styles.italic}`}>监督学习</span> : 
                      '监督学习'
                    }中，算法通过标记好的训练数据学习输入和输出之间的映射关系。这种方法在图像识别、语音识别等领域取得了巨大成功。例如，当我们训练一个{Math.random() < 0.35 ? 
                      <span className={`${styles.textEnhanced} ${styles.enlarge}`}>图像分类器</span> : 
                      '图像分类器'
                    }时，我们会提供大量带有标签的图像，让算法学习如何区分不同的物体。
                  </>
                ) : '在监督学习中，算法通过标记好的训练数据学习输入和输出之间的映射关系。这种方法在图像识别、语音识别等领域取得了巨大成功。例如，当我们训练一个图像分类器时，我们会提供大量带有标签的图像，让算法学习如何区分不同的物体。'}
              </p>
              
              <p className="mb-4 leading-relaxed">
                {isTextEnhanced ? (
                  <>
                    相比之下，{Math.random() < 0.35 ? 
                      <span className={`${styles.textEnhanced} ${styles.highlight}`}>无监督学习</span> : 
                      '无监督学习'
                    }处理的是没有标签的数据。算法需要自己发现数据中的模式和结构。这种方法在聚类分析、异常检测等场景中非常有用。{Math.random() < 0.35 ? 
                      <span className={`${styles.textEnhanced} ${styles.underline}`}>强化学习</span> : 
                      '强化学习'
                    }则是另一种重要的学习范式，它通过与环境的交互来学习最优策略。
                  </>
                ) : '相比之下，无监督学习处理的是没有标签的数据。算法需要自己发现数据中的模式和结构。这种方法在聚类分析、异常检测等场景中非常有用。强化学习则是另一种重要的学习范式，它通过与环境的交互来学习最优策略。'}
              </p>
              
              <div className={styles.conceptExplanation}>
                <strong>关键技术：</strong>支持向量机(SVM)、决策树、随机森林、神经网络等是机器学习中常用的算法。这些算法各有特点，适用于不同的应用场景。
              </div>
              
              <p className="mb-4 leading-relaxed">
                随着计算能力的提升和大数据时代的到来，机器学习技术得到了前所未有的发展。今天，机器学习已经广泛应用于医疗诊断、金融风控、自动驾驶、推荐系统等各个领域，深刻改变着我们的生活方式。
              </p>
              
              <div className="bg-gradient-to-r from-primary to-secondary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-text-primary mb-2">
                  <i className="fas fa-lightbulb text-accent mr-2"></i>
                  思考问题
                </h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• 监督学习和无监督学习的主要区别是什么？</li>
                  <li>• 机器学习在哪些领域对人类社会产生了重大影响？</li>
                  <li>• 未来机器学习技术可能会有哪些新的突破？</li>
                </ul>
              </div>
            </article>

            {/* 阅读进度指示器 */}
            <div className="mt-8 pt-6 border-t border-border-primary">
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>第2章，共4章</span>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleChapterNavigation('chapter-1')}
                    className="px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    <i className="fas fa-chevron-left mr-1"></i>上一章
                  </button>
                  <button 
                    onClick={() => handleChapterNavigation('chapter-3')}
                    className="px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    下一章<i className="fas fa-chevron-right ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI助手面板 */}
          {isAiPanelVisible && (
            <aside className="w-80 bg-bg-primary border-l border-border-primary p-4 hidden xl:block">
              <div className="space-y-4">
                {/* 人物关系图 */}
                <div className={`${styles.aiPanel} rounded-lg p-4`}>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    <i className="fas fa-project-diagram text-primary mr-2"></i>
                    关键人物关系
                  </h3>
                  <div className="text-xs text-text-secondary space-y-2">
                    <div className="flex items-center justify-between">
                      <span>艾伦·图灵</span>
                      <span className="text-primary">→</span>
                      <span>奠定理论基础</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>亚瑟·塞缪尔</span>
                      <span className="text-secondary">→</span>
                      <span>提出机器学习概念</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>杰弗里·辛顿</span>
                      <span className="text-accent">→</span>
                      <span>深度学习先驱</span>
                    </div>
                  </div>
                </div>

                {/* 思维导图 */}
                <div className={`${styles.aiPanel} rounded-lg p-4`}>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    <i className="fas fa-sitemap text-primary mr-2"></i>
                    本章要点
                  </h3>
                  <div className="text-xs text-text-secondary space-y-2">
                    <div className="flex items-start space-x-2">
                      <i className="fas fa-circle text-primary text-xs mt-1.5"></i>
                      <div>
                        <div className="font-medium">机器学习定义</div>
                        <div className="text-xs opacity-75">通过数据学习改进性能</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 ml-3">
                      <i className="fas fa-dot-circle text-secondary text-xs mt-1.5"></i>
                      <div>监督学习</div>
                    </div>
                    <div className="flex items-start space-x-2 ml-3">
                      <i className="fas fa-dot-circle text-secondary text-xs mt-1.5"></i>
                      <div>无监督学习</div>
                    </div>
                    <div className="flex items-start space-x-2 ml-3">
                      <i className="fas fa-dot-circle text-secondary text-xs mt-1.5"></i>
                      <div>强化学习</div>
                    </div>
                  </div>
                </div>

                {/* 生成图片预览 */}
                <div className={`${styles.aiPanel} rounded-lg p-4`}>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    <i className="fas fa-image text-primary mr-2"></i>
                    AI生成图片
                  </h3>
                  <div className="space-y-2">
                    <img 
                      src="https://s.coze.cn/image/_yid8PKlUDE/" 
                      alt="机器学习概念图" 
                      className={`w-full h-24 object-cover rounded-lg ${styles.imagePreview}`}
                    />
                    <button 
                      onClick={() => {
                        const currentParagraph = '机器学习是人工智能的一个重要分支，它使计算机能够通过数据学习并改进性能，而无需显式编程。';
                        generateAIImage(currentParagraph);
                      }}
                      className="w-full text-xs text-primary hover:text-secondary"
                    >
                      <i className="fas fa-plus mr-1"></i>生成新图片
                    </button>
                  </div>
                </div>

                {/* 笔记列表 */}
                <div className={`${styles.aiPanel} rounded-lg p-4`}>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    <i className="fas fa-sticky-note text-primary mr-2"></i>
                    我的笔记
                  </h3>
                  <div className="space-y-2 text-xs">
                    {notesList.map((note) => (
                      <div key={note.id} className="bg-gray-50 p-2 rounded">
                        <div className="text-text-primary font-medium">{note.title}</div>
                        <div className="text-text-secondary mt-1">{note.content}</div>
                      </div>
                    ))}
                    <button 
                      onClick={() => openNoteModal()}
                      className="w-full text-xs text-primary hover:text-secondary"
                    >
                      <i className="fas fa-plus mr-1"></i>添加笔记
                    </button>
                  </div>
                </div>
                
                {/* AI总结 */}
                <div className={`${styles.aiPanel} rounded-lg p-4`}>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    <i className="fas fa-file-alt text-primary mr-2"></i>
                    AI总结
                  </h3>
                  {isSummaryLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className={`${styles.loadingSpinner} mr-2`}></div>
                      <span className="text-xs text-text-secondary">正在生成总结...</span>
                    </div>
                  ) : generatedSummary ? (
                    <div className="text-xs text-text-secondary bg-gray-50 p-3 rounded">
                      {generatedSummary}
                    </div>
                  ) : (
                    <div className="text-xs text-text-secondary text-center py-4">
                      点击上方"AI总结"按钮生成内容摘要
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* 浮动工具栏（选中文本时显示） */}
      {showTextSelectionToolbar && (
        <div 
          ref={textSelectionToolbarRef}
          className="fixed z-50 bg-bg-primary border border-border-primary rounded-lg shadow-lg p-2 space-x-2"
          style={{
            left: `${textSelectionPosition.x}px`,
            top: `${textSelectionPosition.y}px`
          }}
        >
          <button 
            onClick={() => generateAIImage(selectedText)}
            className="p-2 rounded hover:bg-gray-100 text-text-secondary" 
            title="生成图片"
          >
            <i className="fas fa-image"></i>
          </button>
          <button 
            onClick={() => generateSummary(selectedText)}
            className="p-2 rounded hover:bg-gray-100 text-text-secondary" 
            title="生成总结"
          >
            <i className="fas fa-file-alt"></i>
          </button>
          <button 
            onClick={() => openNoteModal(selectedText)}
            className="p-2 rounded hover:bg-gray-100 text-text-secondary" 
            title="添加笔记"
          >
            <i className="fas fa-sticky-note"></i>
          </button>
          <button 
            onClick={addBookmark}
            className="p-2 rounded hover:bg-gray-100 text-text-secondary" 
            title="添加书签"
          >
            <i className="fas fa-bookmark"></i>
          </button>
          <button 
            onClick={() => {
              setTextSearchValue(selectedText);
            }}
            className="p-2 rounded hover:bg-gray-100 text-text-secondary" 
            title="搜索"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      )}

      {/* 笔记编辑模态框 */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleModalOverlayClick}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} w-full max-w-md mx-auto rounded-lg shadow-xl p-6`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">添加笔记</h3>
              <textarea 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className={`${styles.noteEditor} w-full mb-4`} 
                placeholder="输入你的笔记内容..."
              />
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 border border-border-secondary rounded-lg text-text-secondary hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI生成图片模态框 */}
      {showAiImageModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleModalOverlayClick}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} w-full max-w-2xl mx-auto rounded-lg shadow-xl p-6`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">AI生成图片</h3>
              {isAiImageLoading ? (
                <div className="text-center py-8">
                  <div className={`${styles.loadingSpinner} mx-auto mb-4`}></div>
                  <p className="text-text-secondary">正在生成图片，请稍候...</p>
                </div>
              ) : (
                <div>
                  <img 
                    src={generatedImageUrl} 
                    alt="AI生成的图片" 
                    className={`w-full rounded-lg ${styles.imagePreview} mb-4`}
                  />
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={handleRegenerateImage}
                      className="px-4 py-2 border border-border-secondary rounded-lg text-text-secondary hover:bg-gray-50"
                    >
                      重新生成
                    </button>
                    <button 
                      onClick={handleSaveImage}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                    >
                      保存图片
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 书签管理模态框 */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleModalOverlayClick}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} w-full max-w-md mx-auto rounded-lg shadow-xl p-6`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">书签管理</h3>
              <div className="space-y-3 mb-4">
                {bookmarksList.map((bookmark) => (
                  <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{bookmark.chapter}</div>
                      <div className="text-xs text-text-secondary">{bookmark.page}，{bookmark.paragraph}</div>
                    </div>
                    <button className="text-text-secondary hover:text-red-500">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowBookmarkModal(false)}
                  className="px-4 py-2 border border-border-secondary rounded-lg text-text-secondary hover:bg-gray-50"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderPage;

