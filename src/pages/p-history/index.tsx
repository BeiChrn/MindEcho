

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface HistoryFile {
  id: string;
  name: string;
  type: 'pdf' | 'epub' | 'docx' | 'txt';
  uploadTime: string;
  lastReadTime: string;
  progress: number;
}

type SortField = 'name' | 'type' | 'uploadTime' | 'lastReadTime';
type SortOrder = 'asc' | 'desc';
type DateFilter = '' | 'today' | 'week' | 'month' | 'quarter';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // 模拟历史记录数据
  const mockHistoryData: HistoryFile[] = [
    {
      id: 'file1',
      name: '人工智能简史.pdf',
      type: 'pdf',
      uploadTime: '2024-01-15 14:30:25',
      lastReadTime: '2024-01-16 09:45:12',
      progress: 68
    },
    {
      id: 'file2',
      name: '深度学习入门.epub',
      type: 'epub',
      uploadTime: '2024-01-14 16:20:10',
      lastReadTime: '2024-01-15 20:30:45',
      progress: 32
    },
    {
      id: 'file3',
      name: 'Python编程基础.docx',
      type: 'docx',
      uploadTime: '2024-01-13 10:15:30',
      lastReadTime: '2024-01-14 15:20:18',
      progress: 85
    },
    {
      id: 'file4',
      name: '数据结构与算法.txt',
      type: 'txt',
      uploadTime: '2024-01-12 11:45:20',
      lastReadTime: '2024-01-13 19:10:33',
      progress: 15
    },
    {
      id: 'file5',
      name: '机器学习实战.pdf',
      type: 'pdf',
      uploadTime: '2024-01-11 13:25:45',
      lastReadTime: '2024-01-12 16:40:22',
      progress: 45
    },
    {
      id: 'file6',
      name: '神经网络原理.epub',
      type: 'epub',
      uploadTime: '2024-01-10 09:30:15',
      lastReadTime: '2024-01-11 21:15:48',
      progress: 72
    },
    {
      id: 'file7',
      name: '计算机视觉技术.docx',
      type: 'docx',
      uploadTime: '2024-01-09 15:10:30',
      lastReadTime: '2024-01-10 14:25:15',
      progress: 28
    },
    {
      id: 'file8',
      name: '自然语言处理.txt',
      type: 'txt',
      uploadTime: '2024-01-08 12:45:10',
      lastReadTime: '2024-01-09 18:35:52',
      progress: 55
    },
    {
      id: 'file9',
      name: '强化学习入门.pdf',
      type: 'pdf',
      uploadTime: '2024-01-07 10:20:45',
      lastReadTime: '2024-01-08 13:10:28',
      progress: 90
    },
    {
      id: 'file10',
      name: '云计算架构.epub',
      type: 'epub',
      uploadTime: '2024-01-06 14:35:20',
      lastReadTime: '2024-01-07 17:45:12',
      progress: 38
    },
    {
      id: 'file11',
      name: '大数据分析.docx',
      type: 'docx',
      uploadTime: '2024-01-05 11:15:30',
      lastReadTime: '2024-01-06 19:20:45',
      progress: 62
    },
    {
      id: 'file12',
      name: '区块链技术.txt',
      type: 'txt',
      uploadTime: '2024-01-04 16:40:15',
      lastReadTime: '2024-01-05 12:35:22',
      progress: 12
    }
  ];

  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<SortField>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filteredData, setFilteredData] = useState<HistoryFile[]>([...mockHistoryData]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isClearAll, setIsClearAll] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '历史记录 - MindEcho 心锚';
    return () => { document.title = originalTitle; };
  }, []);

  // 应用筛选
  const applyFilters = () => {
    let filtered = [...mockHistoryData];

    // 搜索筛选
    if (fileSearch) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(fileSearch.toLowerCase())
      );
    }

    // 文件类型筛选
    if (fileTypeFilter) {
      filtered = filtered.filter(file => file.type === fileTypeFilter);
    }

    // 日期筛选
    if (dateFilter) {
      filtered = filtered.filter(file => checkDateFilter(file, dateFilter));
    }

    // 排序
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField.includes('Time')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
    setSelectedFiles(new Set());
  };

  // 日期筛选逻辑
  const checkDateFilter = (file: HistoryFile, filter: DateFilter): boolean => {
    const lastReadDate = new Date(file.lastReadTime);
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return lastReadDate.toDateString() === now.toDateString();
      case 'week':
        return lastReadDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return lastReadDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter':
        return lastReadDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  };

  // 排序处理
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 应用筛选效果
  useEffect(() => {
    applyFilters();
  }, [fileSearch, fileTypeFilter, dateFilter, sortField, sortOrder]);

  // 全选处理
  const handleSelectAll = (checked: boolean) => {
    const currentPageData = getCurrentPageData();
    if (checked) {
      setSelectedFiles(new Set(currentPageData.map(file => file.id)));
    } else {
      setSelectedFiles(new Set());
    }
  };

  // 单项选择处理
  const handleSelectFile = (fileId: string, checked: boolean) => {
    const newSelected = new Set(selectedFiles);
    if (checked) {
      newSelected.add(fileId);
    } else {
      newSelected.delete(fileId);
    }
    setSelectedFiles(newSelected);
  };

  // 获取当前页数据
  const getCurrentPageData = (): HistoryFile[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredData.length);
    return filteredData.slice(startIndex, endIndex);
  };

  // 分页处理
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const currentPageData = getCurrentPageData();
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredData.length);

  // 生成页码
  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 工具函数
  const getFileTypeIcon = (type: string): string => {
    const icons = {
      'pdf': 'PDF',
      'epub': 'EPUB',
      'docx': 'DOC',
      'txt': 'TXT'
    };
    return icons[type as keyof typeof icons] || type.toUpperCase();
  };

  const getFileTypeName = (type: string): string => {
    const names = {
      'pdf': 'PDF文档',
      'epub': 'EPUB电子书',
      'docx': 'Word文档',
      'txt': '文本文件'
    };
    return names[type as keyof typeof names] || type.toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 事件处理
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBatchDelete = () => {
    if (selectedFiles.size > 0) {
      setIsClearAll(false);
      setShowDeleteModal(true);
    }
  };

  const handleClearAll = () => {
    if (filteredData.length > 0) {
      setIsClearAll(true);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setSelectedFiles(new Set([fileId]));
    setIsClearAll(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (isClearAll) {
      // 清空全部
      mockHistoryData.length = 0;
    } else {
      // 删除选中的文件
      selectedFiles.forEach(fileId => {
        const index = mockHistoryData.findIndex(file => file.id === fileId);
        if (index > -1) {
          mockHistoryData.splice(index, 1);
        }
      });
    }

    setSelectedFiles(new Set());
    applyFilters();
    setShowDeleteModal(false);
  };

  const handleReadAgain = (fileId: string) => {
    navigate(`/reader?fileId=${fileId}`);
  };

  const handleFileNameClick = (fileId: string) => {
    navigate(`/reader?fileId=${fileId}`);
  };

  const handleUploadFromEmpty = () => {
    navigate('/file-upload');
  };

  const isAllSelected = currentPageData.length > 0 && currentPageData.every(file => selectedFiles.has(file.id));
  const isIndeterminate = selectedFiles.size > 0 && selectedFiles.size < currentPageData.length;

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-bg-primary border-b border-border-primary shadow-nav z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
                src="https://s.coze.cn/image/FElO8zuyY18/" 
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
          <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-home text-lg w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>首页</span>
          </Link>
          <Link to="/file-upload" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-upload text-lg w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>文件上传</span>
          </Link>
          <Link to="/reader" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-book-open text-lg w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>阅读器</span>
          </Link>
          <Link to="/history" className={`${styles.navItem} ${styles.active} flex items-center space-x-3 px-3 py-2 rounded-lg text-primary`}>
            <i className="fas fa-history text-lg w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>历史记录</span>
          </Link>
          <Link to="/settings" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-cog text-lg w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>设置</span>
          </Link>
          <Link to="/help" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-question-circle text-lg w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>帮助</span>
          </Link>
          <Link to="/profile" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-text-secondary`}>
            <i className="fas fa-user text-lg w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>个人中心</span>
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen transition-all duration-300`}>
        {/* 页面头部 */}
        <div className="bg-bg-primary border-b border-border-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">历史记录</h2>
              <nav className="text-sm text-text-secondary mt-1">
                <span>首页</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>历史记录</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">共 <span className="font-medium text-primary">{filteredData.length}</span> 条记录</span>
              <button 
                onClick={handleClearAll}
                className="px-3 py-1 text-sm text-text-secondary hover:text-red-500 rounded-lg hover:bg-red-50"
              >
                <i className="fas fa-trash mr-1"></i>清空全部
              </button>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="bg-bg-primary border-b border-border-primary px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 搜索框 */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索文件名..." 
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>
              
              {/* 文件类型筛选 */}
              <select 
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="px-3 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">全部类型</option>
                <option value="pdf">PDF</option>
                <option value="epub">EPUB</option>
                <option value="docx">DOCX</option>
                <option value="txt">TXT</option>
              </select>
              
              {/* 日期筛选 */}
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="px-3 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">全部时间</option>
                <option value="today">今天</option>
                <option value="week">最近一周</option>
                <option value="month">最近一月</option>
                <option value="quarter">最近三月</option>
              </select>
              
              {/* 批量操作 */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleBatchDelete}
                  disabled={selectedFiles.size === 0}
                  className={`px-3 py-2 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50 ${
                    selectedFiles.size > 0 
                      ? 'text-red-500' 
                      : 'text-text-secondary hover:text-red-500'
                  }`}
                >
                  <i className="fas fa-trash mr-1"></i>
                  {selectedFiles.size > 0 ? `批量删除 (${selectedFiles.size})` : '批量删除'}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* 每页显示数量 */}
              <select 
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="10">10条/页</option>
                <option value="20">20条/页</option>
                <option value="50">50条/页</option>
              </select>
            </div>
          </div>
        </div>

        {/* 数据展示区域 */}
        <div className="p-6">
          {/* 历史记录表格 */}
          <div className="bg-bg-primary rounded-lg shadow-card overflow-hidden">
            {filteredData.length === 0 ? (
              /* 空状态 */
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-history text-3xl text-text-secondary"></i>
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">暂无阅读记录</h3>
                <p className="text-text-secondary mb-6">上传您的第一个文件开始智能阅读之旅</p>
                <button 
                  onClick={handleUploadFromEmpty}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  <i className="fas fa-upload mr-2"></i>上传新文件
                </button>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-bg-secondary border-b border-border-primary">
                    <tr>
                      <th className="w-10 px-4 py-3 text-left">
                        <input 
                          type="checkbox" 
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-border-secondary focus:ring-primary"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                        <button 
                          onClick={() => handleSort('name')}
                          className={`${styles.sortButton} flex items-center px-2 py-1 rounded ${
                            sortField === 'name' ? (sortOrder === 'asc' ? styles.sortAsc : styles.sortDesc) : ''
                          }`}
                        >
                          文件名
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary w-20">
                        <button 
                          onClick={() => handleSort('type')}
                          className={`${styles.sortButton} flex items-center px-2 py-1 rounded ${
                            sortField === 'type' ? (sortOrder === 'asc' ? styles.sortAsc : styles.sortDesc) : ''
                          }`}
                        >
                          文件类型
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary w-40">
                        <button 
                          onClick={() => handleSort('uploadTime')}
                          className={`${styles.sortButton} flex items-center px-2 py-1 rounded ${
                            sortField === 'uploadTime' ? (sortOrder === 'asc' ? styles.sortAsc : styles.sortDesc) : ''
                          }`}
                        >
                          上传时间
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary w-40">
                        <button 
                          onClick={() => handleSort('lastReadTime')}
                          className={`${styles.sortButton} flex items-center px-2 py-1 rounded ${
                            sortField === 'lastReadTime' ? (sortOrder === 'asc' ? styles.sortAsc : styles.sortDesc) : ''
                          }`}
                        >
                          上次阅读
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary w-32">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary">
                    {currentPageData.map(file => (
                      <tr key={file.id} className={styles.tableRow}>
                        <td className="px-4 py-3">
                          <input 
                            type="checkbox" 
                            value={file.id}
                            checked={selectedFiles.has(file.id)}
                            onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                            className="rounded border-border-secondary focus:ring-primary"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className={`${styles.fileTypeIcon} ${styles[`fileType${file.type.charAt(0).toUpperCase() + file.type.slice(1)}`]}`}>
                              {getFileTypeIcon(file.type)}
                            </div>
                            <div>
                              <button 
                                onClick={() => handleFileNameClick(file.id)}
                                className="text-primary hover:text-secondary font-medium text-left"
                              >
                                {file.name}
                              </button>
                              <div className="text-xs text-text-secondary mt-1">
                                阅读进度: {file.progress}%
                                <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                                  <div 
                                    className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full" 
                                    style={{width: `${file.progress}%`}}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {getFileTypeName(file.type)}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {formatDate(file.uploadTime)}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {formatDate(file.lastReadTime)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleReadAgain(file.id)}
                              className="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                            >
                              <i className="fas fa-book-open mr-1"></i>继续阅读
                            </button>
                            <button 
                              onClick={() => handleDeleteFile(file.id)}
                              className="p-1 text-text-secondary hover:text-red-500 rounded"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* 分页区域 */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-text-secondary">
                显示第 <span>{startIndex}</span> - <span>{endIndex}</span> 条，共 <span>{filteredData.length}</span> 条记录
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 text-sm border border-border-secondary rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left mr-1"></i>上一页
                </button>
                <div className="flex items-center space-x-1">
                  {generatePageNumbers().map(page => (
                    <button 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm border rounded-lg ${
                        page === currentPage 
                          ? 'bg-primary text-white border-primary' 
                          : 'border-border-secondary hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 text-sm border border-border-secondary rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  下一页<i className="fas fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-bg-primary rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <h3 className="text-lg font-medium text-text-primary">确认删除</h3>
              </div>
              <p className="text-text-secondary mb-6">确定要删除选中的文件吗？此操作不可撤销。</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-border-secondary rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={confirmDelete}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    isClearAll 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isClearAll ? '清空全部' : '删除'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

