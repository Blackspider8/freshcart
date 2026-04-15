import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const schema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await login(values);
        loginUser(data.token);
        toast.success('Welcome back! 👋');
        navigate('/');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Login failed. Check your credentials.');
      } finally { setSubmitting(false); }
    }
  });

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div style={{width:48,height:48,borderRadius:14,background:'var(--green-500)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg viewBox="0 0 32 32" fill="none" width="30" height="30">
                <path d="M4 8h2l3 9 3-7 3 7 3-9h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="21" cy="22" r="3" fill="white"/>
                <circle cx="12" cy="22" r="3" fill="white"/>
              </svg>
            </div>
            <span style={{fontFamily:'var(--font-heading)',fontSize:24,fontWeight:600}}>FreshCart</span>
          </Link>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:28,fontWeight:600,marginTop:20}}>Welcome back</h1>
          <p style={{color:'var(--gray-400)',marginTop:6}}>Sign in to your account to continue</p>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:18}}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="hello@example.com"
              className={`form-input${formik.touched.email && formik.errors.email ? ' error' : ''}`}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && <span className="form-error">{formik.errors.email}</span>}
          </div>

          <div className="form-group">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{fontSize:13,color:'var(--green-600)',fontWeight:600}}>Forgot password?</Link>
            </div>
            <div style={{position:'relative'}}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                className={`form-input${formik.touched.password && formik.errors.password ? ' error' : ''}`}
                style={{paddingRight:44}}
                {...formik.getFieldProps('password')}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',color:'var(--gray-400)',padding:4}}>
                {showPass ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && <span className="form-error">{formik.errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',marginTop:4}} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? <><div className="spinner" style={{width:20,height:20,borderWidth:2}}/> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'var(--gray-500)'}}>
          Don't have an account?{' '}
          <Link to="/register" style={{color:'var(--green-600)',fontWeight:700}}>Create one →</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 68px); display: flex; align-items: center; justify-content: center; padding: 32px 24px; background: linear-gradient(135deg, var(--green-50) 0%, white 100%); }
        .auth-card { background: white; border-radius: var(--radius-xl); padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-xl); }
        .auth-header { margin-bottom: 28px; }
        .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
      `}</style>
    </div>
  );
}
