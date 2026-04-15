import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyResetCode, resetPassword } from '../api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success('Reset code sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Email not found');
    } finally { setLoading(false); }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    try {
      await verifyResetCode({ resetCode: code });
      toast.success('Code verified!');
      setStep(3);
    } catch {
      toast.error('Invalid or expired code');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await resetPassword({ email, newPassword: newPass });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch {
      toast.error('Reset failed. Please try again.');
    } finally { setLoading(false); }
  };

  const steps = ['Email', 'Verify Code', 'New Password'];

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:48,marginBottom:12}}>🔐</div>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:26,fontWeight:600}}>Reset Password</h1>
          <p style={{color:'var(--gray-400)',fontSize:14,marginTop:6}}>Follow the steps to regain access</p>
        </div>

        {/* Steps indicator */}
        <div style={{display:'flex',alignItems:'center',marginBottom:28}}>
          {steps.map((s, i) => (
            <div key={s} style={{display:'flex',alignItems:'center',flex:1}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                <div style={{
                  width:28,height:28,borderRadius:'50%',
                  background: i+1 <= step ? 'var(--green-500)' : 'var(--gray-200)',
                  color: i+1 <= step ? 'white' : 'var(--gray-400)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:12,fontWeight:700,transition:'all 0.3s'
                }}>{i+1 < step ? '✓' : i+1}</div>
                <span style={{fontSize:10,marginTop:4,color:i+1<=step?'var(--green-600)':'var(--gray-400)',fontWeight:600}}>{s}</span>
              </div>
              {i < steps.length-1 && (
                <div style={{flex:1,height:2,background:i+1<step?'var(--green-500)':'var(--gray-200)',marginBottom:16,transition:'background 0.3s'}}/>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleSendEmail} style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="hello@example.com" className="form-input" required/>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading||!email}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} style={{display:'flex',flexDirection:'column',gap:16}}>
            <p style={{fontSize:14,color:'var(--gray-500)',textAlign:'center',background:'var(--green-50)',padding:'12px 16px',borderRadius:'var(--radius)',border:'1px solid var(--green-200)'}}>
              We sent a reset code to <strong>{email}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">Reset Code</label>
              <input type="text" value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter 6-digit code" className="form-input" maxLength={6} style={{letterSpacing:'0.2em',textAlign:'center',fontSize:18,fontWeight:700}}/>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading||!code}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Min 6 characters" className="form-input" minLength={6} required/>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading||!newPass}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'var(--gray-500)'}}>
          <Link to="/login" style={{color:'var(--green-600)',fontWeight:700}}>← Back to Login</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 68px); display: flex; align-items: center; justify-content: center; padding: 32px 24px; background: linear-gradient(135deg, var(--green-50) 0%, white 100%); }
        .auth-card { background: white; border-radius: var(--radius-xl); padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-xl); }
      `}</style>
    </div>
  );
}
