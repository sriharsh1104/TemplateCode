import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import './HelpSupport.scss';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SystemStatus {
  service: string;
  status: 'operational' | 'maintenance' | 'issue';
  message?: string;
}

const HelpSupport: React.FC = () => {
  const [supportForm, setSupportForm] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    email: '',
  });
  
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // FAQ data
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email to create a new password.',
      category: 'account',
    },
    {
      id: '2',
      question: 'How do I enable two-factor authentication?',
      answer: 'You can enable two-factor authentication in the Security section of your settings. We support authentication apps and SMS verification.',
      category: 'security',
    },
    {
      id: '3',
      question: 'Can I change my email address?',
      answer: 'Yes, you can change your email address in the Account section of your settings. You will need to verify the new email address before the change takes effect.',
      category: 'account',
    },
    {
      id: '4',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription in the Billing section of your settings. If you cancel, you will still have access until the end of your current billing period.',
      category: 'billing',
    },
    {
      id: '5',
      question: 'What happens to my data when I delete my account?',
      answer: 'When you delete your account, all your personal data will be permanently removed from our systems within 30 days, in accordance with our privacy policy.',
      category: 'privacy',
    },
  ];
  
  // System status data
  const systemStatus: SystemStatus[] = [
    { service: 'API', status: 'operational' },
    { service: 'Web App', status: 'operational' },
    { service: 'Database', status: 'operational' },
    { service: 'Authentication', status: 'operational' },
    { service: 'Payment Processing', status: 'maintenance', message: 'Scheduled maintenance from 2AM to 4AM UTC' },
    { service: 'Email Delivery', status: 'issue', message: 'Experiencing delays in email delivery' },
  ];
  
  const categories = ['all', 'account', 'security', 'billing', 'privacy'];
  
  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit support ticket logic would go here
    alert('Support ticket submitted! We will get back to you soon.');
    setSupportForm({
      subject: '',
      description: '',
      priority: 'medium',
      email: '',
    });
  };
  
  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="status-icon operational" />;
      case 'maintenance':
        return <WarningIcon className="status-icon maintenance" />;
      case 'issue':
        return <ErrorIcon className="status-icon issue" />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <h1 className="settings-title">Help & Support</h1>
      <p className="settings-description">
        Find answers to common questions or contact our support team
      </p>
      
      {/* FAQs Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Frequently Asked Questions</h2>
        
        <div className="faq-categories">
          {categories.map(category => (
            <button 
              key={category}
              className={`faq-category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="faq-list">
          {faqs
            .filter(faq => activeCategory === 'all' || faq.category === activeCategory)
            .map(faq => (
              <div key={faq.id} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <HelpIcon className="faq-icon" />
                  <span>{faq.question}</span>
                  <ExpandMoreIcon className={`expand-icon ${expandedFaq === faq.id ? 'expanded' : ''}`} />
                </div>
                
                {expandedFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
        
        <div className="more-help">
          <h3>Need more help?</h3>
          <div className="help-options">
            <a href="#documentation" className="help-option">
              <ArticleIcon />
              <span>Documentation</span>
            </a>
            <a href="#tutorials" className="help-option">
              <ArticleIcon />
              <span>Tutorials</span>
            </a>
            <a href="#community" className="help-option">
              <ContactSupportIcon />
              <span>Community Forum</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Contact Support */}
      <div className="settings-section">
        <h2 className="settings-section-title">Contact Support</h2>
        <p className="contact-description">
          Can't find what you're looking for? Submit a support ticket and we'll get back to you as soon as possible.
        </p>
        
        <form className="support-form" onSubmit={handleSubmit}>
          <div className="settings-form-group">
            <label htmlFor="subject" className="settings-form-label">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              className="settings-input" 
              value={supportForm.subject} 
              onChange={handleFormChange} 
              placeholder="Brief summary of your issue"
              required
            />
          </div>
          
          <div className="settings-form-group">
            <label htmlFor="description" className="settings-form-label">Description</label>
            <textarea 
              id="description" 
              name="description" 
              className="settings-input settings-textarea" 
              value={supportForm.description} 
              onChange={handleFormChange} 
              placeholder="Please provide details about your issue..."
              rows={5}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="settings-form-group">
              <label htmlFor="priority" className="settings-form-label">Priority</label>
              <select 
                id="priority" 
                name="priority" 
                className="settings-input" 
                value={supportForm.priority} 
                onChange={handleFormChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="settings-form-group">
              <label htmlFor="email" className="settings-form-label">Email for Response</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="settings-input" 
                value={supportForm.email} 
                onChange={handleFormChange} 
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="settings-button">Submit Ticket</button>
        </form>
      </div>
      
      {/* System Status */}
      <div className="settings-section">
        <h2 className="settings-section-title">System Status</h2>
        <div className="system-status">
          {systemStatus.map((service, index) => (
            <div key={index} className="status-item">
              <div className="status-info">
                {getStatusIcon(service.status)}
                <span className="service-name">{service.service}</span>
              </div>
              
              <div className="status-details">
                <span className={`status-text ${service.status}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
                {service.message && <span className="status-message">{service.message}</span>}
              </div>
            </div>
          ))}
        </div>
        
        <a href="#status" className="view-status-link">
          View Status Page
        </a>
      </div>
    </div>
  );
};

export default HelpSupport; 