'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Settings, Shield, Mail, Loader } from 'lucide-react';

export default function AdminSettingsPage() {
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [paymentMode, setPaymentMode] = useState('test');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Email template state
  const [emailSubject, setEmailSubject] = useState('Your Ticket Reservation Confirmation');
  const [emailBody, setEmailBody] = useState('Hello, thank you for booking tickets with us. Your reservation is confirmed.');
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const rSettings = await api.get('/settings/razorpay');
      if (rSettings && rSettings.value) {
        const parsed = JSON.parse(rSettings.value);
        setRazorpayKeyId(parsed.keyId || '');
        setRazorpayKeySecret(parsed.keySecret || '');
        setPaymentMode(parsed.mode || 'test');
      }
      
      const emailSettings = await api.get('/settings/email_template').catch(() => null);
      if (emailSettings && emailSettings.value) {
        const parsed = JSON.parse(emailSettings.value);
        setEmailSubject(parsed.subject || '');
        setEmailBody(parsed.body || '');
      }
    } catch (err) {
      console.log('No settings key found, using defaults.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/razorpay', {
        value: JSON.stringify({ keyId: razorpayKeyId, keySecret: razorpayKeySecret, mode: paymentMode })
      });
      alert('Razorpay configurations successfully saved!');
    } catch (err) {
      alert('Failed to update Razorpay configurations');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    try {
      await api.put('/settings/email_template', {
        value: JSON.stringify({ subject: emailSubject, body: emailBody })
      });
      alert('Email templates updated successfully!');
    } catch (err) {
      alert('Failed to update email templates');
    } finally {
      setSavingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-black text-gray-900 tracking-tight leading-none">Settings</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">Configure payment gateways, email templates, and platform rules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Razorpay Config Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-yellow-500" size={20} />
              <div className="text-lg font-black text-gray-900">Razorpay Integration</div>
            </div>
            <p className="text-xs text-gray-400 font-semibold mb-6">Manage API keys and transaction environments for credit card and UPI processing.</p>
            
            <form onSubmit={handleSaveRazorpay} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Key ID</label>
                <input 
                  placeholder="rzp_test_..." 
                  value={razorpayKeyId} 
                  onChange={e => setRazorpayKeyId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Key Secret</label>
                <input 
                  type="password"
                  placeholder="••••••••••••••••" 
                  value={razorpayKeySecret} 
                  onChange={e => setRazorpayKeySecret(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Transaction Mode</label>
                <select 
                  value={paymentMode} 
                  onChange={e => setPaymentMode(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400 font-bold"
                >
                  <option value="test">Test Mode (Sandbox)</option>
                  <option value="live">Live Mode (Production)</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold py-3.5 w-full rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? <Loader className="animate-spin" size={16} /> : 'Save API Credentials'}
              </button>
            </form>
          </div>
        </div>

        {/* Email Templates Config Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="text-yellow-500" size={20} />
              <div className="text-lg font-black text-gray-900">Email Notification Templates</div>
            </div>
            <p className="text-xs text-gray-400 font-semibold mb-6">Customize subject lines and bodies dispatched automatically during ticket reservation events.</p>
            
            <form onSubmit={handleSaveEmail} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Confirmation Email Subject</label>
                <input 
                  placeholder="Email Subject" 
                  value={emailSubject} 
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Body Content</label>
                <textarea 
                  placeholder="Draft email body contents..." 
                  value={emailBody} 
                  onChange={e => setEmailBody(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400 h-28 resize-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold py-3.5 w-full rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                disabled={savingEmail}
              >
                {savingEmail ? <Loader className="animate-spin" size={16} /> : 'Save Notification Template'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
