

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const HomePage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'MindEcho 心锚 - 智能阅读器';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchValue.trim();
      if (searchTerm) {
        navigate(`/reader?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleUploadNewFile = () => {
    navigate('/file-upload');
  };

  const handleContinueReading = () => {
    navigate('/reader?fileId=file_001');
  };

  const handleRecentReadingItemClick = (index: number) => {
    const fileIds = ['file_001', 'file_002', 'file_003'];
    navigate(`/reader?fileId=${fileIds[index]}`);
  };

  const handleNotificationsClick = () => {
    console.log('显示通知列表');
  };

  const handleUserMenuClick = () => {
    console.log('显示用户菜单');
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
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：用户操作区 */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleNotificationsClick}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
            </button>
            <div 
              onClick={handleUserMenuClick}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            >
              <img 
                src="https://s.coze.cn/image/L_SqXRDDvtI/" 
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
          <Link 
            to="/home" 
            className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-primary`}
          >
            <i className="fas fa-home text-lg w-5"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link 
            to="/file-upload" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}
          >
            <i className="fas fa-upload text-lg w-5"></i>
            {!isSidebarCollapsed && <span>文件上传</span>}
          </Link>
          <Link 
            to="/reader" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}
          >
            <i className="fas fa-book-open text-lg w-5"></i>
            {!isSidebarCollapsed && <span>阅读器</span>}
          </Link>
          <Link 
            to="/history" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}
          >
            <i className="fas fa-history text-lg w-5"></i>
            {!isSidebarCollapsed && <span>历史记录</span>}
          </Link>
          <Link 
            to="/settings" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}
          >
            <i className="fas fa-cog text-lg w-5"></i>
            {!isSidebarCollapsed && <span>设置</span>}
          </Link>
          <Link 
            to="/help" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}
          >
            <i className="fas fa-question-circle text-lg w-5"></i>
            {!isSidebarCollapsed && <span>帮助</span>}
          </Link>
          <Link 
            to="/profile" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}
          >
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
              <h2 className="text-lg font-semibold text-text-primary">欢迎回来，张三</h2>
              <p className="text-sm text-text-secondary mt-1">探索智能阅读的无限可能</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-text-secondary">
                <span>今日阅读时长: 2小时30分</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="p-6 space-y-8">
          {/* 英雄区域 */}
          <section className={`${styles.heroGradient} rounded-2xl p-8 text-white relative overflow-hidden`}>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-4">AI赋能阅读，让知识触手可及</h1>
              <p className="text-lg opacity-90 mb-6">MindEcho 心锚 - 您的智能阅读伙伴，通过AI技术提升阅读体验，让复杂内容变得简单易懂</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleUploadNewFile}
                  className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-upload mr-2"></i>上传新文件
                </button>
                <button 
                  onClick={handleContinueReading}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                >
                  <i className="fas fa-book-open mr-2"></i>继续阅读
                </button>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -mr-16 -mb-16"></div>
          </section>

          {/* 快速统计 */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${styles.statsCard} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">已读文件</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">24</p>
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-alt text-primary text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className={`${styles.statsCard} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">阅读时长</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">126小时</p>
                </div>
                <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-secondary text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className={`${styles.statsCard} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">AI生成图片</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">156张</p>
                </div>
                <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-image text-accent text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className={`${styles.statsCard} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">笔记数量</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">89条</p>
                </div>
                <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-sticky-note text-green-500 text-xl"></i>
                </div>
              </div>
            </div>
          </section>

          {/* 核心功能介绍 */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">核心功能</h2>
              <p className="text-text-secondary">探索MindEcho为您带来的智能阅读体验</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI辅助阅读 */}
              <div className={`${styles.featureCard} bg-bg-primary rounded-xl p-6 shadow-card`}>
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-robot text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">AI辅助理解</h3>
                <p className="text-text-secondary text-sm mb-4">
                  智能梳理人物关系、解释复杂概念、生成思维导图，让您轻松理解复杂内容
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    人物关系可视化
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    概念智能解释
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    思维导图生成
                  </li>
                </ul>
              </div>

              {/* 文本增强 */}
              <div className={`${styles.featureCard} bg-bg-primary rounded-xl p-6 shadow-card`}>
                <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-magic text-secondary text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">文本增强</h3>
                <p className="text-text-secondary text-sm mb-4">
                  个性化文本增强功能，帮助阅读障碍者提升阅读体验，让阅读更高效
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    智能高亮显示
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    重点内容放大
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    色彩标记
                  </li>
                </ul>
              </div>

              {/* AI文生图 */}
              <div className={`${styles.featureCard} bg-bg-primary rounded-xl p-6 shadow-card`}>
                <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-image text-accent text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">AI文生图</h3>
                <p className="text-text-secondary text-sm mb-4">
                  选中任意文本段落，AI自动生成相关图片，让抽象文字变成直观图像
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    段落生成图片
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    多风格选择
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    人物画像生成
                  </li>
                </ul>
              </div>

              {/* 个性化阅读 */}
              <div className={`${styles.featureCard} bg-bg-primary rounded-xl p-6 shadow-card`}>
                <div className="w-16 h-16 bg-purple-500 bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-palette text-purple-500 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">个性化阅读</h3>
                <p className="text-text-secondary text-sm mb-4">
                  丰富的自定义选项，调整字体、背景、行间距，打造专属阅读环境
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    字体字号调整
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    夜间模式
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    背景主题
                  </li>
                </ul>
              </div>

              {/* 知识管理 */}
              <div className={`${styles.featureCard} bg-bg-primary rounded-xl p-6 shadow-card`}>
                <div className="w-16 h-16 bg-green-500 bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-bookmark text-green-500 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">知识管理</h3>
                <p className="text-text-secondary text-sm mb-4">
                  完善的笔记、书签、搜索功能，让您的阅读过程更加高效有序
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    智能书签
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    笔记管理
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    全文搜索
                  </li>
                </ul>
              </div>

              {/* 无障碍支持 */}
              <div className={`${styles.featureCard} bg-bg-primary rounded-xl p-6 shadow-card`}>
                <div className="w-16 h-16 bg-orange-500 bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-universal-access text-orange-500 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">无障碍支持</h3>
                <p className="text-text-secondary text-sm mb-4">
                  专为阅读障碍者设计，提供文本增强、专注模式等功能，让每个人都能享受阅读
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    阅读障碍辅助
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    专注模式
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    易读设计
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 最近阅读 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">最近阅读</h2>
              <Link 
                to="/history" 
                className="text-primary hover:text-secondary text-sm font-medium"
              >
                查看全部 <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 最近阅读项目1 */}
              <div 
                onClick={() => handleRecentReadingItemClick(0)}
                className="bg-bg-primary rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-file-pdf text-white text-lg"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">人工智能简史</h3>
                    <p className="text-sm text-text-secondary mt-1">PDF • 245页</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                      <span className="text-xs text-text-secondary ml-2">68%</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">上次阅读：今天 14:30</p>
                  </div>
                </div>
              </div>

              {/* 最近阅读项目2 */}
              <div 
                onClick={() => handleRecentReadingItemClick(1)}
                className="bg-bg-primary rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-file-word text-white text-lg"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">深度学习研究报告</h3>
                    <p className="text-sm text-text-secondary mt-1">DOCX • 89页</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{width: '34%'}}></div>
                      </div>
                      <span className="text-xs text-text-secondary ml-2">34%</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">上次阅读：昨天 16:45</p>
                  </div>
                </div>
              </div>

              {/* 最近阅读项目3 */}
              <div 
                onClick={() => handleRecentReadingItemClick(2)}
                className="bg-bg-primary rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-file-alt text-white text-lg"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">算法导论</h3>
                    <p className="text-sm text-text-secondary mt-1">TXT • 1024页</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{width: '12%'}}></div>
                      </div>
                      <span className="text-xs text-text-secondary ml-2">12%</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">上次阅读：3天前</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 底部区域 */}
        <footer className="bg-bg-primary border-t border-border-primary px-6 py-8 mt-12">
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © 2024 MindEcho 心锚. 让阅读更智能，让知识更易懂.
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-sm text-text-secondary">
              <a href="#" className="hover:text-primary">隐私政策</a>
              <a href="#" className="hover:text-primary">服务条款</a>
              <a href="#" className="hover:text-primary">联系我们</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;

