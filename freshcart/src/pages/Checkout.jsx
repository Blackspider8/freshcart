import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../context/CartContext';
import { createCashOrder, createOnlineOrder } from '../api';
import toast from 'react-hot-toast';

const schema = Yup.object({
  details: Yup.string().required('Address details required'),
  phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Enter a valid Egyptian phone number').required('Phone required'),
  city: Yup.string().required('City required'),
});

export default function Checkout() {
  const { cart, cartId, total, totalAfterDiscount, count, clearAllCart } = useCart();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cart || count === 0) navigate('/cart');
  }, [cart, count, navigate]);

  const formik = useFormik({
    initialValues: { details: '', phone: '', city: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!cartId) { toast.error('Your cart is empty'); return; }
      setLoading(true);
      try {
        const addr = { details: values.details, phone: values.phone, city: values.city };
        if (payMethod === 'cash') {
          await createCashOrder(cartId, addr);
          await clearAllCart();
          toast.success('Order placed successfully! 🎉');
          navigate('/orders');
        } else {
          const { data } = await createOnlineOrder(cartId, addr);
          if (data.session?.url) window.location.href = data.session.url;
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Order failed. Please try again.');
      } finally { setLoading(false); }
    }
  });

  if (!cart || count === 0) return null;

  const finalTotal = totalAfterDiscount || total;

  return (
    <div style={{padding:'32px 0 80px'}}>
      <div className="container">
        <h1 style={{fontFamily:'var(--font-heading)',fontSize:32,fontWeight:600,marginBottom:32}}>Checkout</h1>

        <div className="checkout-layout">
          {/* Form */}
          <div>
            <form onSubmit={formik.handleSubmit} noValidate>
              {/* Shipping */}
              <div className="card" style={{padding:28,marginBottom:20}}>
                <h2 style={{fontSize:18,fontWeight:700,marginBottom:20,display:'flex',alignItems:'center',gap:8}}>
                  <span style={{width:28,height:28,background:'var(--green-500)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700}}>1</span>
                  Shipping Address
                </h2>
                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                  <div className="form-group">
                    <label className="form-label">Address Details *</label>
                    <input
                      type="text"
                      name="details"
                      placeholder="Street address, building, apartment..."
                      className={`form-input${formik.touched.details && formik.errors.details ? ' error' : ''}`}
                      {...formik.getFieldProps('details')}
                    />
                    {formik.touched.details && formik.errors.details && <span className="form-error">{formik.errors.details}</span>}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="01xxxxxxxxx"
                        className={`form-input${formik.touched.phone && formik.errors.phone ? ' error' : ''}`}
                        {...formik.getFieldProps('phone')}
                      />
                      {formik.touched.phone && formik.errors.phone && <span className="form-error">{formik.errors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Cairo, Alexandria..."
                        className={`form-input${formik.touched.city && formik.errors.city ? ' error' : ''}`}
                        {...formik.getFieldProps('city')}
                      />
                      {formik.touched.city && formik.errors.city && <span className="form-error">{formik.errors.city}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card" style={{padding:28,marginBottom:20}}>
                <h2 style={{fontSize:18,fontWeight:700,marginBottom:20,display:'flex',alignItems:'center',gap:8}}>
                  <span style={{width:28,height:28,background:'var(--green-500)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700}}>2</span>
                  Payment Method
                </h2>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {[
                    { id:'cash', label:'Cash on Delivery', icon:'💵', desc:'Pay when your order arrives' },
                    { id:'online', label:'Online Payment', icon:'💳', desc:'Secure card payment via Stripe' },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`pay-option${payMethod===method.id?' selected':''}`}
                      onClick={() => setPayMethod(method.id)}
                    >
                      <input type="radio" name="payment" value={method.id} checked={payMethod===method.id} onChange={() => setPayMethod(method.id)} style={{display:'none'}}/>
                      <div className="pay-radio">
                        {payMethod===method.id && <div className="pay-radio-dot"/>}
                      </div>
                      <span style={{fontSize:24}}>{method.icon}</span>
                      <div>
                        <p style={{fontWeight:600,fontSize:15}}>{method.label}</p>
                        <p style={{fontSize:13,color:'var(--gray-400)'}}>{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading}>
                {loading ? (
                  <><div className="spinner" style={{width:20,height:20,borderWidth:2}}/> Processing...</>
                ) : (
                  <>Place Order — {finalTotal} EGP</>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="card" style={{padding:24,height:'fit-content',position:'sticky',top:90}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>Order Summary</h2>
            <div style={{display:'flex',flexDirection:'column',gap:10,maxHeight:280,overflowY:'auto',marginBottom:16}}>
              {cart.products.map(item => (
                <div key={item._id} style={{display:'flex',gap:10,alignItems:'center'}}>
                  <div style={{width:48,height:48,borderRadius:'var(--radius)',overflow:'hidden',background:'var(--gray-50)',padding:4,flexShrink:0}}>
                    <img src={item.product.imageCover} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:600,color:'var(--gray-800)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.product.title}</p>
                    <p style={{fontSize:12,color:'var(--gray-400)'}}>x{item.count}</p>
                  </div>
                  <p style={{fontSize:13,fontWeight:700,flexShrink:0}}>{item.price*item.count} EGP</p>
                </div>
              ))}
            </div>
            <div style={{height:1,background:'var(--gray-200)',marginBottom:12}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--gray-500)',marginBottom:8}}>
              <span>Subtotal</span><span>{total} EGP</span>
            </div>
            {totalAfterDiscount && (
              <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--green-600)',marginBottom:8}}>
                <span>Discount</span><span>-{total-totalAfterDiscount} EGP</span>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--gray-500)',marginBottom:12}}>
              <span>Delivery</span><span style={{color:'var(--green-600)',fontWeight:600}}>Free</span>
            </div>
            <div style={{height:1,background:'var(--gray-200)',marginBottom:12}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:18}}>
              <span>Total</span><span>{finalTotal} EGP</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .pay-option { display: flex; align-items: center; gap: 12px; padding: 16px; border: 2px solid var(--gray-200); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.2s; }
        .pay-option.selected { border-color: var(--green-500); background: var(--green-50); }
        .pay-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--gray-300); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.15s; }
        .pay-option.selected .pay-radio { border-color: var(--green-500); }
        .pay-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--green-500); }
        @media(max-width:768px) { .checkout-layout{grid-template-columns:1fr;} }
      `}</style>
    </div>
  );
}
