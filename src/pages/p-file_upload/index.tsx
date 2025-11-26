

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface SelectedFile {
  file: File;
  id: string;
}

interface ProgressInfo {
  currentFile: string;
  percentage: number;
}

const FileUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ProgressInfo>({
    currentFile: '',
    percentage: 0
  });
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [aiProcessingEnabled, setAiProcessingEnabled] = useState(true);
  const [textEnhancementEnabled, setTextEnhancementEnabled] = useState(true);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '文件上传 - MindEcho 心锚';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 文件选择处理
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newSelectedFiles: SelectedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // 验证文件格式
      const allowedTypes = ['.txt', '.pdf', '.epub', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert(`不支持的文件格式：${file.name}\n请上传 TXT、PDF、EPUB 或 DOCX 格式文件`);
        continue;
      }
      
      // 验证文件大小
      if (file.size > 50 * 1024 * 1024) {
        alert(`文件过大：${file.name}\n单个文件大小不能超过 50MB`);
        continue;
      }
      
      newSelectedFiles.push({
        file,
        id: Date.now().toString() + i
      });
      
      // 限制最多3个文件
      if (newSelectedFiles.length >= 3) {
        break;
      }
    }
    
    setSelectedFiles(newSelectedFiles);
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.uploadAreaDragover);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.uploadAreaDragover);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.uploadAreaDragover);
    handleFileSelect(e.dataTransfer.files);
  };

  // 点击选择文件
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  // 文件输入变化
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  // 删除文件
  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId));
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件图标
  const getFileIcon = (fileName: string): { icon: string; color: string } => {
    const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase();
    
    switch (fileExtension) {
      case '.pdf':
        return { icon: 'fas fa-file-pdf', color: 'text-red-500' };
      case '.docx':
        return { icon: 'fas fa-file-word', color: 'text-blue-500' };
      case '.txt':
        return { icon: 'fas fa-file-alt', color: 'text-purple-500' };
      case '.epub':
        return { icon: 'fas fa-book', color: 'text-orange-500' };
      default:
        return { icon: 'fas fa-file', color: 'text-gray-500' };
    }
  };

  // 开始阅读
  const handleStartReading = () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress({
      currentFile: selectedFiles[0].file.name,
      percentage: 0
    });
    
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newPercentage = prev.percentage + Math.random() * 15;
        if (newPercentage >= 100) {
          clearInterval(progressInterval);
          // 模拟处理完成，跳转到阅读器
          setTimeout(() => {
            navigate(`/reader?fileId=${Date.now()}`);
          }, 500);
          return { ...prev, percentage: 100 };
        }
        return { ...prev, percentage: newPercentage };
      });
    }, 200);
  };

  // 取消上传
  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress({ currentFile: '', percentage: 0 });
  };

  // 再次阅读
  const handleReadAgain = (fileId: string) => {
    navigate(`/reader?fileId=${fileId}`);
  };

  // 模态框处理
  const handleCloseModal = () => {
    setShowFormatModal(false);
  };

  const handleModalBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowFormatModal(false);
    }
  };

  // ESC键关闭模态框
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFormatModal) {
        setShowFormatModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFormatModal]);

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
                src="https://s.coze.cn/image/8NQ4idHWxRQ/" 
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
            className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-primary`}
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
      <main className={`${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      } pt-16 min-h-screen transition-all duration-300`}>
        {/* 页面头部 */}
        <div className="bg-bg-primary border-b border-border-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">上传文件</h2>
              <nav className="text-sm text-text-secondary mt-1">
                <span>首页</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>文件上传</span>
              </nav>
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="p-6 max-w-4xl mx-auto">
          {/* 文件上传区域 */}
          {!isUploading && (
            <div className="bg-bg-primary rounded-lg shadow-card p-8 mb-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cloud-upload-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">上传您的文档</h3>
                <p className="text-text-secondary">支持 TXT、PDF、EPUB、DOCX 格式，单个文件最大 50MB</p>
              </div>

              {/* 文件拖放区域 */}
              <div 
                className={`${styles.uploadArea} rounded-lg p-8 text-center mb-6`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <i className="fas fa-file-alt text-4xl text-text-secondary mb-4"></i>
                <p className="text-text-secondary mb-4">
                  <span className="font-medium">拖拽文件到此处</span> 或 
                  <button 
                    onClick={handleSelectFileClick}
                    className="text-primary hover:text-secondary font-medium"
                  >
                    点击选择文件
                  </button>
                </p>
                <p className="text-sm text-text-secondary">
                  支持格式：TXT、PDF、EPUB、DOCX | 最大 50MB | 每次最多 3 个文件
                </p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept=".txt,.pdf,.epub,.docx" 
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </div>

              {/* 已选择文件列表 */}
              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-text-primary mb-3">已选择文件</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((selectedFile) => {
                      const { icon, color } = getFileIcon(selectedFile.file.name);
                      return (
                        <div key={selectedFile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <i className={`${icon} ${color} text-lg`}></i>
                            <div>
                              <div className="font-medium text-text-primary">{selectedFile.file.name}</div>
                              <div className="text-sm text-text-secondary">{formatFileSize(selectedFile.file.size)}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveFile(selectedFile.id)}
                            className="text-text-secondary hover:text-red-500 p-1"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 处理选项 */}
              <div className="border-t border-border-primary pt-6">
                <h4 className="text-sm font-medium text-text-primary mb-4">处理选项</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className={styles.checkboxCustom}
                      checked={aiProcessingEnabled}
                      onChange={(e) => setAiProcessingEnabled(e.target.checked)}
                    />
                    <div>
                      <div className="text-sm font-medium text-text-primary">启用 AI 内容理解</div>
                      <div className="text-xs text-text-secondary">自动梳理人物关系、解释复杂概念、生成思维导图</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className={styles.checkboxCustom}
                      checked={textEnhancementEnabled}
                      onChange={(e) => setTextEnhancementEnabled(e.target.checked)}
                    />
                    <div>
                      <div className="text-sm font-medium text-text-primary">启用文本增强</div>
                      <div className="text-xs text-text-secondary">随机加粗、高亮显示、文字放大等增强效果</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 开始阅读按钮 */}
              <div className="mt-8">
                <button 
                  onClick={handleStartReading}
                  disabled={selectedFiles.length === 0}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-book-open mr-2"></i>
                  开始阅读
                </button>
              </div>
            </div>
          )}

          {/* 上传进度区域 */}
          {isUploading && (
            <div className="bg-bg-primary rounded-lg shadow-card p-6 mb-8">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-cog fa-spin text-white"></i>
                </div>
                <h4 className="text-lg font-medium text-text-primary">正在处理文件...</h4>
                <p className="text-text-secondary">请稍候，我们正在为您准备最佳的阅读体验</p>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-text-secondary mb-2">
                  <span>正在处理：{uploadProgress.currentFile}</span>
                  <span>{Math.round(uploadProgress.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={styles.progressBar}
                    style={{ width: `${uploadProgress.percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={handleCancelUpload}
                  className="text-text-secondary hover:text-primary text-sm"
                >
                  <i className="fas fa-times mr-1"></i>
                  取消上传
                </button>
              </div>
            </div>
          )}

          {/* 历史上传记录 */}
          <div className="bg-bg-primary rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">
                <i className="fas fa-history mr-2 text-primary"></i>
                最近上传
              </h3>
              <Link 
                to="/history" 
                className="text-primary hover:text-secondary text-sm font-medium"
              >
                查看全部 <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>

            <div className="space-y-3">
              {/* 历史文件项 */}
              <div className={`${styles.fileItem} flex items-center justify-between p-3 rounded-lg border border-border-secondary`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-pdf text-red-500"></i>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">人工智能简史.pdf</div>
                    <div className="text-sm text-text-secondary">2.3 MB • 昨天 14:30</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">已完成</span>
                  <button 
                    onClick={() => handleReadAgain('file1')}
                    className="text-primary hover:text-secondary p-2 rounded-lg"
                  >
                    <i className="fas fa-book-open"></i>
                  </button>
                </div>
              </div>

              <div className={`${styles.fileItem} flex items-center justify-between p-3 rounded-lg border border-border-secondary`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-word text-blue-500"></i>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">深度学习入门.docx</div>
                    <div className="text-sm text-text-secondary">1.8 MB • 3天前 09:15</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">已完成</span>
                  <button 
                    onClick={() => handleReadAgain('file2')}
                    className="text-primary hover:text-secondary p-2 rounded-lg"
                  >
                    <i className="fas fa-book-open"></i>
                  </button>
                </div>
              </div>

              <div className={`${styles.fileItem} flex items-center justify-between p-3 rounded-lg border border-border-secondary`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-alt text-purple-500"></i>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">算法导论.txt</div>
                    <div className="text-sm text-text-secondary">4.1 MB • 1周前 16:45</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">已完成</span>
                  <button 
                    onClick={() => handleReadAgain('file3')}
                    className="text-primary hover:text-secondary p-2 rounded-lg"
                  >
                    <i className="fas fa-book-open"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* 空状态 */}
            <div className="text-center py-12 hidden">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-folder-open text-gray-400 text-2xl"></i>
              </div>
              <h4 className="text-lg font-medium text-text-primary mb-2">暂无阅读记录</h4>
              <p className="text-text-secondary mb-6">上传您的第一个文档，开始智能阅读之旅</p>
              <button 
                onClick={handleSelectFileClick}
                className="bg-primary hover:bg-secondary text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200"
              >
                <i className="fas fa-upload mr-2"></i>
                上传文件
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 文件格式说明模态框 */}
      {showFormatModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={handleModalBackgroundClick}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-bg-primary rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  <i className="fas fa-info-circle text-primary mr-2"></i>
                  支持的文件格式
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-pdf text-red-500"></i>
                      <span className="font-medium">PDF</span>
                    </div>
                    <span className="text-sm text-text-secondary">.pdf</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-word text-blue-500"></i>
                      <span className="font-medium">Word</span>
                    </div>
                    <span className="text-sm text-text-secondary">.docx</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-alt text-purple-500"></i>
                      <span className="font-medium">纯文本</span>
                    </div>
                    <span className="text-sm text-text-secondary">.txt</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-book text-orange-500"></i>
                      <span className="font-medium">电子书</span>
                    </div>
                    <span className="text-sm text-text-secondary">.epub</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-exclamation-triangle text-blue-500 mt-0.5"></i>
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">注意事项</div>
                      <div className="mt-1">单个文件最大 50MB，每次最多上传 3 个文件</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button 
                  onClick={handleCloseModal}
                  className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;

