

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface SettingsData {
  font: string;
  fontSize: number;
  lineHeight: number;
  backgroundColor: string;
  margin: number;
  nightMode: boolean;
  textEnhance: boolean;
  aiCharacterRelation: boolean;
  aiConceptExplanation: boolean;
  aiMindMap: boolean;
  aiSummary: boolean;
  aiImageGeneration: boolean;
  aiCharacterPortrait: boolean;
  imageStyle: string;
  progressNotification: boolean;
  aiCompletionNotification: boolean;
  autoCache: boolean;
}

const SettingsPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [settings, setSettings] = useState<SettingsData>({
    font: 'system-ui',
    fontSize: 16,
    lineHeight: 1.6,
    backgroundColor: '#ffffff',
    margin: 50,
    nightMode: false,
    textEnhance: true,
    aiCharacterRelation: true,
    aiConceptExplanation: true,
    aiMindMap: true,
    aiSummary: true,
    aiImageGeneration: true,
    aiCharacterPortrait: true,
    imageStyle: 'realistic',
    progressNotification: true,
    aiCompletionNotification: true,
    autoCache: true
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '设置 - MindEcho 心锚';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleFontChange = (font: string) => {
    setSettings(prev => ({ ...prev, font }));
  };

  const handleFontSizeChange = (fontSize: number) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const handleLineHeightChange = (lineHeight: number) => {
    setSettings(prev => ({ ...prev, lineHeight }));
  };

  const handleBackgroundColorChange = (backgroundColor: string) => {
    setSettings(prev => ({ ...prev, backgroundColor }));
  };

  const handleMarginChange = (margin: number) => {
    setSettings(prev => ({ ...prev, margin }));
  };

  const handleToggleChange = (key: keyof SettingsData, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleImageStyleChange = (imageStyle: string) => {
    setSettings(prev => ({ ...prev, imageStyle }));
  };

  const handleSaveSettings = () => {
    console.log('保存设置:', settings);
    setShowSuccessModal(true);
  };

  const handleResetSettings = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      setSettings({
        font: 'system-ui',
        fontSize: 16,
        lineHeight: 1.6,
        backgroundColor: '#ffffff',
        margin: 50,
        nightMode: false,
        textEnhance: true,
        aiCharacterRelation: true,
        aiConceptExplanation: true,
        aiMindMap: true,
        aiSummary: true,
        aiImageGeneration: true,
        aiCharacterPortrait: true,
        imageStyle: 'realistic',
        progressNotification: true,
        aiCompletionNotification: true,
        autoCache: true
      });
      console.log('设置已重置为默认值');
    }
  };

  const handleClearCache = () => {
    if (confirm('确定要清理缓存吗？这将删除所有已缓存的内容。')) {
      console.log('缓存已清理');
      alert('缓存清理完成');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const fontOptions = [
    { id: 'system-ui', name: '系统默认', value: 'system-ui' },
    { id: 'serif', name: '衬线字体', value: 'serif' },
    { id: 'sans-serif', name: '无衬线', value: 'sans-serif' },
    { id: 'monospace', name: '等宽字体', value: 'monospace' }
  ];

  const colorOptions = [
    { id: '#ffffff', style: { backgroundColor: '#ffffff' } },
    { id: '#f5f5f5', style: { backgroundColor: '#f5f5f5' } },
    { id: '#f0f8ff', style: { backgroundColor: '#f0f8ff' } },
    { id: '#fff8dc', style: { backgroundColor: '#fff8dc' } },
    { id: '#f5f5dc', style: { backgroundColor: '#f5f5dc' } }
  ];

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
                src="https://s.coze.cn/image/llhyMYsQ8FM/" 
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
      <aside className={`fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-primary transition-all duration-300 z-40 ${
        isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
      }`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/home" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}
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
            className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-primary`}
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
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        {/* 页面头部 */}
        <div className="bg-bg-primary border-b border-border-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">设置</h2>
              <nav className="text-sm text-text-secondary mt-1">
                <span>首页</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>设置</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleResetSettings}
                className="px-4 py-2 text-sm text-text-secondary border border-border-secondary rounded-lg hover:bg-gray-50"
              >
                <i className="fas fa-undo mr-2"></i>重置默认
              </button>
              <button 
                onClick={handleSaveSettings}
                className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-secondary"
              >
                <i className="fas fa-save mr-2"></i>保存设置
              </button>
            </div>
          </div>
        </div>

        {/* 设置内容 */}
        <div className="p-6">
          {/* 阅读偏好设置 */}
          <div className={`${styles.settingCard} bg-bg-primary rounded-lg shadow-card p-6 mb-6`}>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <i className="fas fa-book-open text-primary mr-3"></i>
              阅读偏好设置
            </h3>
            
            <div className="space-y-6">
              {/* 字体选择 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">字体</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {fontOptions.map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => handleFontChange(option.value)}
                      className={`${styles.fontPreview} ${
                        settings.font === option.value ? styles.fontPreviewSelected : ''
                      }`}
                    >
                      <div className="text-sm font-medium">{option.name}</div>
                      <div className="text-xs text-text-secondary">{option.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 字号设置 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">字号</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    className={styles.rangeSlider}
                    style={{ flex: 1 }}
                    min="12" 
                    max="24" 
                    value={settings.fontSize}
                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  />
                  <span className="text-sm font-medium text-text-primary w-12">{settings.fontSize}px</span>
                </div>
              </div>

              {/* 行间距设置 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">行间距</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    className={styles.rangeSlider}
                    style={{ flex: 1 }}
                    min="1.2" 
                    max="2.0" 
                    step="0.1" 
                    value={settings.lineHeight}
                    onChange={(e) => handleLineHeightChange(parseFloat(e.target.value))}
                  />
                  <span className="text-sm font-medium text-text-primary w-12">{settings.lineHeight}</span>
                </div>
              </div>

              {/* 页面背景 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">页面背景</label>
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => handleBackgroundColorChange(option.id)}
                      className={`${styles.colorOption} ${
                        settings.backgroundColor === option.id ? styles.colorOptionSelected : ''
                      }`}
                      style={option.style}
                    ></div>
                  ))}
                </div>
              </div>

              {/* 边距设置 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">页面边距</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    className={styles.rangeSlider}
                    style={{ flex: 1 }}
                    min="0" 
                    max="100" 
                    value={settings.margin}
                    onChange={(e) => handleMarginChange(parseInt(e.target.value))}
                  />
                  <span className="text-sm font-medium text-text-primary w-12">{settings.margin}px</span>
                </div>
              </div>

              {/* 开关设置 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">夜间模式</label>
                    <p className="text-xs text-text-secondary mt-1">降低屏幕亮度，保护视力</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.nightMode}
                      onChange={(e) => handleToggleChange('nightMode', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">文本增强</label>
                    <p className="text-xs text-text-secondary mt-1">自动高亮关键内容</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.textEnhance}
                      onChange={(e) => handleToggleChange('textEnhance', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* AI功能设置 */}
          <div className={`${styles.settingCard} bg-bg-primary rounded-lg shadow-card p-6 mb-6`}>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <i className="fas fa-robot text-primary mr-3"></i>
              AI功能设置
            </h3>
            
            <div className="space-y-6">
              {/* AI内容理解 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-text-primary border-b border-border-primary pb-2">AI内容理解</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">人物关系梳理</label>
                    <p className="text-xs text-text-secondary mt-1">自动识别并展示人物关系</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.aiCharacterRelation}
                      onChange={(e) => handleToggleChange('aiCharacterRelation', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">概念解释</label>
                    <p className="text-xs text-text-secondary mt-1">自动解释复杂概念</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.aiConceptExplanation}
                      onChange={(e) => handleToggleChange('aiConceptExplanation', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">思维导图生成</label>
                    <p className="text-xs text-text-secondary mt-1">生成内容结构思维导图</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.aiMindMap}
                      onChange={(e) => handleToggleChange('aiMindMap', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">内容摘要</label>
                    <p className="text-xs text-text-secondary mt-1">自动生成内容摘要</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.aiSummary}
                      onChange={(e) => handleToggleChange('aiSummary', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              {/* AI文生图 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-text-primary border-b border-border-primary pb-2">AI文生图</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">段落生成图片</label>
                    <p className="text-xs text-text-secondary mt-1">根据文本内容生成相关图片</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.aiImageGeneration}
                      onChange={(e) => handleToggleChange('aiImageGeneration', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">人物生成画像</label>
                    <p className="text-xs text-text-secondary mt-1">自动为文本中的人物生成画像</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.aiCharacterPortrait}
                      onChange={(e) => handleToggleChange('aiCharacterPortrait', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                {/* 图片风格选择 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">默认图片风格</label>
                  <select 
                    value={settings.imageStyle}
                    onChange={(e) => handleImageStyleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="realistic">写实风格</option>
                    <option value="cartoon">卡通风格</option>
                    <option value="anime">动漫风格</option>
                    <option value="watercolor">水彩风格</option>
                    <option value="oil-painting">油画风格</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 通用设置 */}
          <div className={`${styles.settingCard} bg-bg-primary rounded-lg shadow-card p-6 mb-6`}>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <i className="fas fa-cog text-primary mr-3"></i>
              通用设置
            </h3>
            
            <div className="space-y-6">
              {/* 通知设置 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-text-primary border-b border-border-primary pb-2">通知设置</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">阅读进度提醒</label>
                    <p className="text-xs text-text-secondary mt-1">达到设定阅读进度时提醒</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.progressNotification}
                      onChange={(e) => handleToggleChange('progressNotification', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">AI处理完成通知</label>
                    <p className="text-xs text-text-secondary mt-1">AI分析完成时通知</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.aiCompletionNotification}
                      onChange={(e) => handleToggleChange('aiCompletionNotification', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              {/* 缓存管理 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-text-primary border-b border-border-primary pb-2">缓存管理</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">自动缓存已读内容</label>
                    <p className="text-xs text-text-secondary mt-1">离线时可查看已缓存内容</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={settings.autoCache}
                      onChange={(e) => handleToggleChange('autoCache', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-text-secondary">当前缓存大小: <span className="font-medium text-text-primary">125 MB</span></span>
                  </div>
                  <button 
                    onClick={handleClearCache}
                    className="px-3 py-1 text-sm text-text-secondary border border-border-secondary rounded-lg hover:bg-gray-50"
                  >
                    <i className="fas fa-trash mr-1"></i>清理缓存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 成功提示模态框 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={handleCloseSuccessModal}
        >
          <div 
            className="bg-bg-primary rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">设置已保存</h3>
              <p className="text-sm text-text-secondary mb-4">您的设置已成功保存</p>
              <button 
                onClick={handleCloseSuccessModal}
                className="w-full px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-secondary"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

