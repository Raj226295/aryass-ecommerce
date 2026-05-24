import Icon from './Icon'

function LoginModal({
  isOpen,
  onClose,
  loginStep,
  phoneNumber,
  otpDigits,
  loginError,
  loginMessage,
  onPhoneChange,
  onPhoneSubmit,
  onVerifyOtp,
  onOtpChange,
  onOtpKeyDown,
  onResendOtp,
  otpInputRefs,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="login-modal-backdrop" onClick={onClose} aria-hidden={!isOpen}>
      <div
        className="login-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-label="Login with OTP"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="login-close-button" aria-label="Close login" onClick={onClose}>
          <Icon name="close" />
        </button>

        <div className="login-modal-card">
          <div className="login-modal-brand">
            <span className="brand-word">ARYASS</span>
            <span className="brand-tagline">FEEL BEFORE THE MOMENT</span>
          </div>

          {loginStep === 'phone' ? (
            <form className="login-form" onSubmit={onPhoneSubmit}>
              <p className="login-step-kicker">Enter your mobile number</p>
              <div className="phone-field">
                <span className="phone-prefix">
                  <span className="country-flag" />
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(event) => onPhoneChange(event.target.value)}
                  placeholder="Enter 10 digit number"
                  aria-label="Mobile number"
                />
              </div>

              <p className="login-helper-text">
                Submit karte hi OTP step open hoga. Demo flow ke liye code screen par show hoga.
              </p>

              {loginError ? <p className="login-error">{loginError}</p> : null}

              <button type="submit" className="login-submit-button">
                Submit
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={onVerifyOtp}>
              <p className="login-step-kicker">Enter OTP below</p>
              <div className="otp-input-row">
                {otpDigits.map((digit, index) => (
                  <input
                    key={`otp-${index}`}
                    ref={(element) => {
                      otpInputRefs.current[index] = element
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => onOtpChange(index, event.target.value)}
                    onKeyDown={(event) => onOtpKeyDown(event, index)}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <p className="login-helper-text">{loginMessage}</p>

              <button type="button" className="otp-resend-button" onClick={onResendOtp}>
                Resend OTP
              </button>

              {loginError ? <p className="login-error">{loginError}</p> : null}

              <button type="submit" className="login-submit-button">
                Verify
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginModal
