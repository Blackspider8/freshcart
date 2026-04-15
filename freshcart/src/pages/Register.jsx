import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register } from '../api';
import toast from 'react-hot-toast';

const schema = Yup.object({
  name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  rePassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
  phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Enter a valid Egyptian phone').required('Phone is required'),
});

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', rePassword: '', phone: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(values);
        toast.success('Account created! Please sign in 🎉');
        navigate('/login');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
      } finally { setSubmitting(false); }
    }
  });

  const Field = ({ name, label, type = 'text', placeholder }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={name === 'password' || name === 'rePassword' ? (showPass ? 'text' : 'password') : type}
        name={name}
        placeholder={placeholder}
        className={`form-input${formik.touched[name] && formik.errors[name] ? ' error' : ''}`}
        {...formik.getFieldProps(name)}
      />
      {formik.touched[name] && formik.errors[name] && <span className="form-error">{formik.errors[name]}</span>}
    </div>
  );

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
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:28,fontWeight:600,marginTop:20}}>Create account</h1>
          <p style={{color:'var(--gray-400)',marginTop:6}}>Join FreshCart and start shopping fresh</p>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:14}}>
          <Field name="name" label="Full Name" placeholder="John Doe"/>
          <Field name="email" label="Email Address" type="email" placeholder="hello@example.com"/>
          <Field name="phone" label="Phone Number" type="tel" placeholder="01xxxxxxxxx"/>

          <div className="form-group">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <label className="form-label">Password</label>
              <button type="button" onClick={() => setShowPass(s=>!s)} style={{fontSize:12,color:'var(--green-600)',background:'none',fontWeight:600}}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Min 6 characters"
              className={`form-input${formik.touched.password && formik.errors.password ? ' error' : ''}`}
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && <span className="form-error">{formik.errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              name="rePassword"
              placeholder="Repeat your password"
              className={`form-input${formik.touched.rePassword && formik.errors.rePassword ? ' error' : ''}`}
              {...formik.getFieldProps('rePassword')}
            />
            {formik.touched.rePassword && formik.errors.rePassword && <span className="form-error">{formik.errors.rePassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',marginTop:6}} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? <><div className="spinner" style={{width:20,height:20,borderWidth:2}}/> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'var(--gray-500)'}}>
          Already have an account?{' '}
          <Link to="/login" style={{color:'var(--green-600)',fontWeight:700}}>Sign in →</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 68px); display: flex; align-items: center; justify-content: center; padding: 32px 24px; background: linear-gradient(135deg, var(--green-50) 0%, white 100%); }
        .auth-card { background: white; border-radius: var(--radius-xl); padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-xl); }
        .auth-header { margin-bottom: 24px; }
        .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
      `}</style>
    </div>
  );
}
