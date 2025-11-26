

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FormData {
  nickname: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAvatar, setUserAvatar] = useState('https://s.coze.cn/image/b3k8O9Hh6H8/');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '138****8888',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [originalFormData] = useState<FormData>({
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '138****8888',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '个人中心 - MindEcho 心锚';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('请选择 JPG、PNG 或 GIF 格式的图片');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUserAvatar(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nickname.trim()) {
      alert('请输入昵称');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('请输入邮箱');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('请输入有效的邮箱地址');
      return;
    }
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        alert('请输入当前密码');
        return;
      }
      
      if (formData.newPassword.length < 8 || formData.newPassword.length > 20) {
        alert('新密码长度应为8-20位');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setShowSuccessMessage(true);
      setIsSubmitting(false);
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      console.log('个人信息保存成功', formData);
    }, 1000);
  };

  const handleCancelChanges = () => {
    if (confirm('确定要取消修改吗？未保存的更改将丢失。')) {
      setFormData(originalFormData);
      setUserAvatar('https://s.coze.cn/image/AhT08qGSPII/');
      setShowSuccessMessage(false);
    }
  };

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = (e.target as HTMLInputElement).value.trim();
      if (searchTerm) {
        console.log('全局搜索:', searchTerm);
      }
    }
  };

  const handleNotificationsClick = () => {
    console.log('打开通知中心');
  };

  const handleUserMenuClick = () => {
    console.log('打开用户菜单');
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
                onKeyPress={handleGlobalSearch}
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
                src="https://s.coze.cn/image/mt6s7622Pec/" 
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
            className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-primary`}
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
              <h2 className="text-lg font-semibold text-text-primary">个人中心</h2>
              <nav className="text-sm text-text-secondary mt-1">
                <span>首页</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>个人中心</span>
              </nav>
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="p-6">
          {/* 成功提示消息 */}
          {showSuccessMessage && (
            <div className={styles.successMessage}>
              <i className="fas fa-check-circle mr-2"></i>
              个人信息更新成功！
            </div>
          )}

          {/* 个人信息表单 */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-bg-primary rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">个人信息</h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* 头像上传 */}
                <div className="flex flex-col items-center space-y-4">
                  <div className={styles.avatarUpload} onClick={handleAvatarUpload}>
                    <img 
                      src={userAvatar} 
                      alt="用户头像" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-border-primary"
                    />
                    <div className={styles.avatarOverlay}>
                      <i className="fas fa-camera"></i>
                    </div>
                    <input 
                      type="file" 
                      ref={avatarInputRef}
                      accept="image/*" 
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-text-secondary text-center">
                    点击头像更换图片，支持 JPG、PNG 格式，文件大小不超过 2MB
                  </p>
                </div>

                {/* 基本信息 */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-text-primary border-b border-border-primary pb-2">基本信息</h4>
                  
                  {/* 昵称 */}
                  <div className="space-y-2">
                    <label htmlFor="nickname" className="block text-sm font-medium text-text-primary">昵称 *</label>
                    <input 
                      type="text" 
                      id="nickname" 
                      name="nickname" 
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-border-secondary rounded-lg ${styles.formInputFocus}`}
                      required
                    />
                    <p className="text-xs text-text-secondary">请输入2-20个字符的昵称</p>
                  </div>

                  {/* 邮箱 */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary">邮箱 *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-border-secondary rounded-lg ${styles.formInputFocus}`}
                      required
                    />
                    <p className="text-xs text-text-secondary">用于登录和接收通知</p>
                  </div>

                  {/* 手机号码 */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-text-primary">手机号码</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-border-secondary rounded-lg ${styles.formInputFocus}`}
                    />
                    <p className="text-xs text-text-secondary">选填，用于找回密码</p>
                  </div>
                </div>

                {/* 密码修改 */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-text-primary border-b border-border-primary pb-2">密码修改</h4>
                  
                  {/* 当前密码 */}
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="block text-sm font-medium text-text-primary">当前密码</label>
                    <input 
                      type="password" 
                      id="current-password" 
                      name="currentPassword" 
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-border-secondary rounded-lg ${styles.formInputFocus}`}
                    />
                    <p className="text-xs text-text-secondary">不修改密码请留空</p>
                  </div>

                  {/* 新密码 */}
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="block text-sm font-medium text-text-primary">新密码</label>
                    <input 
                      type="password" 
                      id="new-password" 
                      name="newPassword" 
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-border-secondary rounded-lg ${styles.formInputFocus}`}
                    />
                    <p className="text-xs text-text-secondary">8-20位，包含字母和数字</p>
                  </div>

                  {/* 确认密码 */}
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary">确认新密码</label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      name="confirmPassword" 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-border-secondary rounded-lg ${styles.formInputFocus}`}
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-4 pt-6 border-t border-border-primary">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        保存中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        保存修改
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancelChanges}
                    className="px-6 py-2 border border-border-secondary text-text-primary rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                  >
                    <i className="fas fa-undo mr-2"></i>
                    取消修改
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

